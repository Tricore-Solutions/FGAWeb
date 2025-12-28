import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import colors from '../styles/design-tokens/colors';
import { initializeAmwalPay, openAmwalPayCheckout } from '../services/amwalpayService';
import { createSubscription } from '../services/subscriptionService';

function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const paymentCompletedRef = useRef(false); // Use ref to track payment completion

  // Get payment data from location state or use defaults
  useEffect(() => {
    const data = location.state || {
      plan: 'Starter',
      amount: 10,
      description: 'Starter Plan - Monthly Subscription'
    };
    setPaymentData(data);
  }, [location.state]);

  // Check if SmartBox.js is already loaded or load it
  useEffect(() => {
    // Check if SmartBox is already loaded (from index.html)
    if (typeof window.SmartBox !== 'undefined') {
      return;
    }

    // Load SmartBox.js script if not already loaded
    const existingScript = document.querySelector('script[src*="SmartBox.js"]');
    if (existingScript) {
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://test.amwalpg.com:7443/js/SmartBox.js?v=1.1';
    script.async = true;
    script.onerror = () => {
      console.error('Failed to load SmartBox.js script');
      setError('Failed to load AmwalPay SmartBox. Please check your internet connection.');
    };
    document.body.appendChild(script);
  }, []);

  const handlePayment = () => {
    if (!paymentData) {
      setError('Payment data is missing');
      return;
    }

    // Check if SmartBox is loaded
    if (typeof window.SmartBox === 'undefined') {
      setError('AmwalPay SmartBox is not loaded. Please wait a moment and try again.');
      console.error('SmartBox is not defined');
      return;
    }

    // Check if SmartBox.Checkout exists
    if (typeof window.SmartBox.Checkout === 'undefined') {
      setError('AmwalPay SmartBox Checkout is not available. Please refresh the page and try again.');
      console.error('SmartBox.Checkout is not defined');
      return;
    }

    setLoading(true);
    setError(null);

    // Generate unique merchant reference
    const merchantReference = `FGA_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Prepare order items
    const orderItems = [
      {
        name: paymentData.plan + ' Plan',
        descriptionOne: 'Monthly subscription',
        descriptionTwo: 'Quantity: 1',
        price: paymentData.amount
      }
    ];

    try {
      // Initialize payment
      const initialized = initializeAmwalPay(
        {
          amount: paymentData.amount,
          merchantReference: merchantReference,
          orderItems: orderItems,
          languageId: 'en'
        },
        {
          onSuccess: async (data) => {
            paymentCompletedRef.current = true; // Mark payment as completed
            
            // Save subscription to database
            try {
              // Calculate end date (30 days from now for monthly subscription)
              const endDate = new Date();
              endDate.setDate(endDate.getDate() + 30);
              
              // Format date for MySQL (YYYY-MM-DD HH:MM:SS)
              const formatDateForMySQL = (date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                const seconds = String(date.getSeconds()).padStart(2, '0');
                return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
              };
              
              // Extract payment data from nested structure
              const paymentInfo = data.data?.data || data.data || data;
              
              const subscriptionData = {
                plan_name: paymentData.plan,
                plan_amount: paymentData.amount,
                currency: 'OMR',
                payment_id: paymentInfo.PaymentId || paymentInfo.paymentId || paymentInfo.PaymentID || null,
                merchant_reference: merchantReference,
                transaction_id: paymentInfo.TransactionId || paymentInfo.transactionId || paymentInfo.TransactionID || null,
                retrieval_reference: paymentInfo.RetrievalRefNo || paymentInfo.retrievalReference || paymentInfo.RetrievalReferenceNumber || null,
                end_date: formatDateForMySQL(endDate)
              };
              
              await createSubscription(subscriptionData);
            } catch (error) {
              console.error('Error creating subscription:', error);
              // Don't block the success page even if subscription creation fails
            }
            
            setLoading(false);
            // Navigate to success page with payment data
            navigate('/payment/success', {
              state: {
                paymentData: data,
                plan: paymentData.plan,
                amount: paymentData.amount
              }
            });
          },
          onError: (data) => {
            console.error('Payment error:', data);
            setError(data?.Message || data?.message || 'Payment failed. Please try again.');
            setLoading(false);
          },
          onCancel: () => {
            setLoading(false);
            
            // Wait a moment to see if complete callback fires
            // This handles the case where user closes success popup
            setTimeout(() => {
              // Only navigate to cancel page if payment wasn't completed
              // This prevents redirect when user closes the success popup
              if (!paymentCompletedRef.current) {
                navigate('/payment/cancel');
              }
            }, 500);
          }
        }
      );

      if (!initialized) {
        setError('Failed to initialize payment. Please check the console for errors.');
        setLoading(false);
        return;
      }

      // Wait a bit for configuration to be set, then open checkout
      setTimeout(() => {
        try {
          const opened = openAmwalPayCheckout();
          if (!opened) {
            setError('Failed to open payment checkout. Please refresh the page and try again.');
            setLoading(false);
          }
        } catch (error) {
          console.error('Error opening checkout:', error);
          setError(`Failed to open payment checkout: ${error.message}. Please try again.`);
          setLoading(false);
        }
      }, 1000);
    } catch (error) {
      console.error('Error in handlePayment:', error);
      setError(`Payment initialization failed: ${error.message}. Please try again.`);
      setLoading(false);
    }
  };

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-oslo-gray mb-4">No payment information found.</p>
          <Button
            text="Go to Home"
            onClick={() => navigate('/')}
            variant="primary"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-16 md:py-24">
      <div className="max-w-2xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-river-bed mb-4">
            Complete Your Payment
          </h1>
          <p className="text-lg text-oslo-gray">
            Secure payment powered by AmwalPay
          </p>
        </div>

        <Card
          title={paymentData.plan + ' Plan'}
          description={paymentData.description}
          variant="elevated"
        >
          <div className="space-y-6">
            <div className="flex justify-between items-center py-4 border-b border-geyser">
              <span className="text-lg font-semibold text-river-bed">Amount</span>
              <span className="text-2xl font-bold text-gulf-stream">
                OMR {parseFloat(paymentData.amount).toFixed(3)}
              </span>
            </div>

            {error && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <Button
                text={loading ? 'Processing...' : 'Proceed to Payment'}
                onClick={handlePayment}
                variant="primary"
                disabled={loading}
                className="w-full"
              />
              <Button
                text="Cancel"
                onClick={() => navigate('/')}
                variant="outline"
                className="w-full"
              />
            </div>

            <div className="mt-6 p-4 bg-geyser rounded-lg">
              <p className="text-sm text-river-bed mb-2 font-semibold">Test Card Details:</p>
              <div className="text-xs text-oslo-gray space-y-1">
                <p><strong>Card Number:</strong> 4000 0000 0000 2701</p>
                <p><strong>Name:</strong> Test</p>
                <p><strong>Expiry:</strong> 06/27</p>
                <p><strong>CVV:</strong> 436</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Payment;

