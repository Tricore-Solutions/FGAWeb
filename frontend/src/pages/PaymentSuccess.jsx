import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Button from '../components/Button';
import colors from '../styles/design-tokens/colors';

function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const paymentData = location.state?.paymentData;
  const plan = location.state?.plan || 'Plan';
  const amount = location.state?.amount || 0;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-16 md:py-24">
      <div className="max-w-2xl mx-auto px-4 md:px-8 text-center">
        <div className="mb-8 flex justify-center">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors['gulf-stream'] }}
          >
            <CheckCircle size={48} color="#ffffff" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-river-bed mb-4">
          Payment Successful!
        </h1>
        
        <p className="text-lg text-oslo-gray mb-8">
          Thank you for your payment. Your {plan} subscription has been activated.
        </p>

        {paymentData && (
          <div className="bg-geyser rounded-lg p-6 mb-8 text-left">
            <h2 className="text-xl font-semibold text-river-bed mb-4">Transaction Details</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-oslo-gray">Plan:</span>
                <span className="text-river-bed font-medium">{plan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-oslo-gray">Amount:</span>
                <span className="text-river-bed font-medium">OMR {parseFloat(amount).toFixed(3)}</span>
              </div>
              {paymentData.TransactionId && (
                <div className="flex justify-between">
                  <span className="text-oslo-gray">Transaction ID:</span>
                  <span className="text-river-bed font-medium">{paymentData.TransactionId}</span>
                </div>
              )}
              {paymentData.ResponseCode && (
                <div className="flex justify-between">
                  <span className="text-oslo-gray">Response Code:</span>
                  <span className="text-river-bed font-medium">{paymentData.ResponseCode}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            text="Go to Dashboard"
            onClick={() => navigate('/dashboard')}
            variant="primary"
          />
          <Button
            text="Back to Home"
            onClick={() => navigate('/')}
            variant="outline"
          />
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;

