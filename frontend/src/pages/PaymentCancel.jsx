import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import Button from '../components/Button';
import colors from '../styles/design-tokens/colors';

function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-16 md:py-24">
      <div className="max-w-2xl mx-auto px-4 md:px-8 text-center">
        <div className="mb-8 flex justify-center">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#ef4444' }}
          >
            <XCircle size={48} color="#ffffff" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-river-bed mb-4">
          Payment Cancelled
        </h1>
        
        <p className="text-lg text-oslo-gray mb-8">
          Your payment was cancelled. No charges were made to your account.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            text="Try Again"
            onClick={() => navigate('/')}
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

export default PaymentCancel;

