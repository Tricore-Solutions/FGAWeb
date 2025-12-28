import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Calendar, X, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { getActiveSubscription, cancelSubscription, reactivateSubscription } from '../services/subscriptionService';
import AuthContext from '../context/AuthContext';
import colors from '../styles/design-tokens/colors';

function SubscriptionManagement() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useContext(AuthContext);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Fetch active subscription
  useEffect(() => {
    const loadSubscription = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getActiveSubscription();
        setSubscription(data?.subscription || null);
      } catch (err) {
        console.error('Failed to fetch subscription:', err);
        setError('Failed to load subscription. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      loadSubscription();
    }
  }, [isAuthenticated, authLoading]);

  const handleCancel = async () => {
    if (!subscription) return;

    try {
      setActionLoading(true);
      await cancelSubscription(subscription.id);
      setSubscription({ ...subscription, status: 'cancelled' });
      setShowCancelConfirm(false);
    } catch (err) {
      console.error('Error cancelling subscription:', err);
      setError(err.response?.data?.error || 'Failed to cancel subscription. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReactivate = async () => {
    if (!subscription) return;

    try {
      setActionLoading(true);
      const data = await reactivateSubscription(subscription.id);
      setSubscription(data.subscription);
    } catch (err) {
      console.error('Error reactivating subscription:', err);
      setError(err.response?.data?.error || 'Failed to reactivate subscription. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // Show loading spinner while checking auth
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Loading subscription..." />
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <div className="text-center p-8">
            <h2 className="text-2xl font-heading font-bold text-river-bed mb-4">
              Please Log In
            </h2>
            <p className="text-oslo-gray mb-6">
              You need to be logged in to manage your subscription.
            </p>
            <Button
              text="Go to Login"
              variant="primary"
              onClick={() => navigate('/login')}
            />
          </div>
        </Card>
      </div>
    );
  }

  const isCancelled = subscription?.status === 'cancelled';
  const endDate = subscription?.end_date ? new Date(subscription.end_date) : null;
  const isExpired = endDate && endDate < new Date();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="w-full py-8 bg-gradient-to-r from-gulf-stream to-river-bed">
        <div className="w-full mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between text-white">
            <div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
                Manage Subscription
              </h1>
              <p className="text-lg opacity-90">
                Control your membership and billing
              </p>
            </div>
            <Button
              text="← Back to Dashboard"
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="bg-white/20 text-white border-white hover:bg-white/30"
            />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="w-full py-12 md:py-16">
        <div className="w-full mx-auto px-4 md:px-8 max-w-4xl">
          {error && (
            <Card className="mb-6 border-red-200 bg-red-50">
              <div className="p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-600">{error}</p>
              </div>
            </Card>
          )}

          {!subscription ? (
            <Card>
              <div className="p-12 text-center">
                <CreditCard className="w-20 h-20 text-oslo-gray mx-auto mb-6" />
                <h2 className="text-2xl font-heading font-bold text-river-bed mb-4">
                  No Active Subscription
                </h2>
                <p className="text-lg text-oslo-gray mb-8">
                  You don't have an active subscription. Subscribe to a plan to get started.
                </p>
                <Button
                  text="View Plans"
                  variant="primary"
                  onClick={() => navigate('/#membership-plans')}
                />
              </div>
            </Card>
          ) : (
            <>
              {/* Current Subscription */}
              <Card className="mb-6">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-heading font-bold text-river-bed">
                      CURRENT SUBSCRIPTION
                    </h2>
                    {isCancelled && !isExpired && (
                      <Button
                        text="Don't Cancel Subscription"
                        variant="outline"
                        onClick={handleReactivate}
                        disabled={actionLoading}
                        className="bg-geyser hover:bg-geyser/80"
                      />
                    )}
                  </div>

                  {isCancelled && (
                    <div className="mb-4 inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded-lg">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-semibold">
                        Cancels {endDate?.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  )}

                  <div className="bg-gradient-to-r from-gulf-stream to-river-bed rounded-xl p-6 text-white mb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          {!isCancelled ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <X className="w-5 h-5" />
                          )}
                          <span className="text-sm font-semibold uppercase tracking-wide">
                            {isCancelled ? 'Cancelled' : 'Active Plan'}
                          </span>
                        </div>
                        <h3 className="text-3xl font-heading font-bold mb-2">
                          {subscription.plan_name}
                        </h3>
                        <p className="text-xl font-semibold opacity-90">
                          {subscription.currency} {parseFloat(subscription.plan_amount).toFixed(3)} / month
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                          <CreditCard className="w-8 h-8" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {endDate && (
                    <div className="flex items-center gap-2 text-oslo-gray mb-4">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        {isCancelled 
                          ? `Your service will end on ${endDate.toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric'
                            })}.`
                          : `Next billing date: ${endDate.toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric'
                            })}`
                        }
                      </span>
                    </div>
                  )}

                  {!isCancelled && !showCancelConfirm && (
                    <Button
                      text="Cancel Subscription"
                      variant="outline"
                      onClick={() => setShowCancelConfirm(true)}
                      className="w-full md:w-auto border-red-300 text-red-600 hover:bg-red-50"
                    />
                  )}

                  {showCancelConfirm && (
                    <Card className="mt-4 border-red-200 bg-red-50">
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-red-900 mb-2">
                          Cancel Subscription?
                        </h3>
                        <p className="text-red-800 mb-4">
                          Your subscription will remain active until {endDate?.toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}. You can reactivate it anytime before then.
                        </p>
                        <div className="flex gap-3">
                          <Button
                            text="Yes, Cancel"
                            variant="outline"
                            onClick={handleCancel}
                            disabled={actionLoading}
                            className="border-red-600 text-red-600 hover:bg-red-100"
                          />
                          <Button
                            text="Keep Subscription"
                            variant="primary"
                            onClick={() => setShowCancelConfirm(false)}
                            disabled={actionLoading}
                          />
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              </Card>

              {/* Billing Information */}
              <Card>
                <div className="p-6">
                  <h2 className="text-2xl font-heading font-bold text-river-bed mb-6">
                    BILLING INFORMATION
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-oslo-gray mb-1">Name</p>
                      <p className="text-lg font-semibold text-river-bed">
                        {user?.first_name && user?.last_name
                          ? `${user.first_name} ${user.last_name}`
                          : user?.first_name || 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-oslo-gray mb-1">Email</p>
                      <p className="text-lg font-semibold text-river-bed">
                        {user?.email || 'Not provided'}
                      </p>
                    </div>
                    {subscription.merchant_reference && (
                      <div>
                        <p className="text-sm text-oslo-gray mb-1">Payment Reference</p>
                        <p className="text-lg font-semibold text-river-bed">
                          {subscription.merchant_reference}
                        </p>
                      </div>
                    )}
                    {subscription.transaction_id && (
                      <div>
                        <p className="text-sm text-oslo-gray mb-1">Transaction ID</p>
                        <p className="text-lg font-semibold text-river-bed">
                          {subscription.transaction_id}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default SubscriptionManagement;

