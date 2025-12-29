const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');

// Create a new subscription (after successful payment)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      plan_name,
      plan_amount,
      currency = 'OMR',
      payment_id,
      merchant_reference,
      transaction_id,
      retrieval_reference,
      end_date
    } = req.body;

    // Validate required fields
    if (!plan_name || !plan_amount || !merchant_reference) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Deactivate any existing active subscriptions for this user
    // Only expire subscriptions that haven't been cancelled or have passed their end_date
    await pool.query(
      `UPDATE subscriptions 
       SET status = ? 
       WHERE user_id = ? 
       AND status = 'active' 
       AND (cancelled_at IS NULL OR end_date <= NOW())`,
      ['expired', userId]
    );

    // Create new subscription
    const [result] = await pool.query(
      `INSERT INTO subscriptions 
       (user_id, plan_name, plan_amount, currency, status, payment_id, 
        merchant_reference, transaction_id, retrieval_reference, end_date) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        plan_name,
        plan_amount,
        currency,
        'active',
        payment_id,
        merchant_reference,
        transaction_id,
        retrieval_reference,
        end_date
      ]
    );

    const subscriptionId = result.insertId;

    // Update user's active_subscription_id
    await pool.query(
      'UPDATE users SET active_subscription_id = ? WHERE id = ?',
      [subscriptionId, userId]
    );

    // Fetch the created subscription
    const [subscriptions] = await pool.query(
      'SELECT * FROM subscriptions WHERE id = ?',
      [subscriptionId]
    );

    res.status(201).json({
      message: 'Subscription created successfully',
      subscription: subscriptions[0]
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    
    // Handle duplicate merchant_reference
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Subscription with this payment reference already exists' });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user's active subscription
router.get('/active', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get active subscription: status='active' AND (not cancelled OR cancelled but end_date hasn't passed)
    const [subscriptions] = await pool.query(
      `SELECT * FROM subscriptions 
       WHERE user_id = ? 
       AND status = 'active' 
       AND (cancelled_at IS NULL OR end_date > NOW())
       AND (end_date IS NULL OR end_date > NOW())
       ORDER BY created_at DESC 
       LIMIT 1`,
      [userId]
    );

    if (subscriptions.length === 0) {
      return res.json({ subscription: null });
    }

    res.json({ subscription: subscriptions[0] });
  } catch (error) {
    console.error('Error fetching active subscription:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all subscriptions for current user
router.get('/my-subscriptions', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const [subscriptions] = await pool.query(
      `SELECT * FROM subscriptions 
       WHERE user_id = ? 
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json({ subscriptions });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Cancel subscription
router.patch('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const subscriptionId = req.params.id;

    // Verify subscription belongs to user
    const [subscriptions] = await pool.query(
      'SELECT * FROM subscriptions WHERE id = ? AND user_id = ?',
      [subscriptionId, userId]
    );

    if (subscriptions.length === 0) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    const subscription = subscriptions[0];

    // Check if already cancelled
    if (subscription.cancelled_at) {
      return res.status(400).json({ error: 'Subscription is already cancelled' });
    }

    // Set cancelled_at but keep status as 'active' and keep active_subscription_id
    // The subscription will remain active until end_date
    await pool.query(
      'UPDATE subscriptions SET cancelled_at = NOW(), updated_at = NOW() WHERE id = ?',
      [subscriptionId]
    );

    // Fetch the updated subscription
    const [updated] = await pool.query(
      'SELECT * FROM subscriptions WHERE id = ?',
      [subscriptionId]
    );

    res.json({ 
      message: 'Subscription cancelled successfully. Your access will continue until the end of your billing period.',
      subscription: updated[0]
    });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reactivate subscription (uncancel)
router.patch('/:id/reactivate', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const subscriptionId = req.params.id;

    // Verify subscription belongs to user
    const [subscriptions] = await pool.query(
      'SELECT * FROM subscriptions WHERE id = ? AND user_id = ?',
      [subscriptionId, userId]
    );

    if (subscriptions.length === 0) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    const subscription = subscriptions[0];

    // Check if subscription end_date is in the future
    const endDate = new Date(subscription.end_date);
    const now = new Date();

    if (endDate < now) {
      return res.status(400).json({ error: 'Subscription has expired. Please subscribe to a new plan.' });
    }

    // Deactivate any other active subscriptions
    await pool.query(
      'UPDATE subscriptions SET status = ? WHERE user_id = ? AND status = ? AND id != ?',
      ['expired', userId, 'active', subscriptionId]
    );

    // Reactivate this subscription (clear cancelled_at)
    await pool.query(
      'UPDATE subscriptions SET status = ?, cancelled_at = NULL, updated_at = NOW() WHERE id = ?',
      ['active', subscriptionId]
    );

    // Update user's active_subscription_id
    await pool.query(
      'UPDATE users SET active_subscription_id = ? WHERE id = ?',
      [subscriptionId, userId]
    );

    // Fetch the updated subscription
    const [updated] = await pool.query(
      'SELECT * FROM subscriptions WHERE id = ?',
      [subscriptionId]
    );

    res.json({
      message: 'Subscription reactivated successfully',
      subscription: updated[0]
    });
  } catch (error) {
    console.error('Error reactivating subscription:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

