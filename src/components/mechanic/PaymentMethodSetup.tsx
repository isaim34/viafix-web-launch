
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

// Updated with your live publishable key
const stripePromise = loadStripe('pk_live_51RHQBoL5TpM4x7IGAYh4EkllpuCDhgkbq9zz3XncmikVMM3JBjmnHZaqUwYARgl86if2a1TeZhug1MbLmxMTFlSx00t5vQZY88');

interface PaymentMethodSetupProps {
  onSuccess: () => void;
}

const PaymentMethodForm: React.FC<PaymentMethodSetupProps> = ({ onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [setupIntentSecret, setSetupIntentSecret] = useState<string | null>(null);

  useEffect(() => {
    const setupPaymentIntent = async () => {
      try {
        console.log('Setting up payment intent...');
        const { data, error } = await supabase.functions.invoke('mechanic-payment-setup');
        
        if (error) {
          console.error('Setup intent error:', error);
          throw error;
        }
        
        console.log('Setup intent response:', data);
        setSetupIntentSecret(data.setup_intent_client_secret);
      } catch (err: any) {
        console.error('Setup intent error:', err);
        setError(err.message || 'Failed to initialize payment setup');
      }
    };

    setupPaymentIntent();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements || !setupIntentSecret || !user) {
      return;
    }

    setIsLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);
    
    if (!cardElement) {
      setError('Card element not found');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Confirming card setup with secret:', setupIntentSecret);
      
      const { error: stripeError, setupIntent } = await stripe.confirmCardSetup(setupIntentSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (stripeError) {
        console.error('Stripe error:', stripeError);
        throw new Error(stripeError.message);
      }

      if (setupIntent && setupIntent.status === 'succeeded') {
        console.log('Setup intent succeeded:', setupIntent);
        
        // Save payment method info to our database
        const { error: dbError } = await supabase
          .from('mechanic_payment_methods')
          .insert({
            mechanic_id: user.id,
            stripe_setup_intent_id: setupIntent.id,
            stripe_payment_method_id: setupIntent.payment_method as string,
            is_active: true,
          });

        if (dbError) {
          console.error('Database error:', dbError);
          throw dbError;
        }

        console.log('Payment method saved successfully');
        onSuccess();
      }
    } catch (err: any) {
      console.error('Payment method setup error:', err);
      setError(err.message || 'Failed to save payment method');
    } finally {
      setIsLoading(false);
    }
  };

  if (!setupIntentSecret) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Initializing payment setup...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="p-4 border rounded-lg">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
            },
          }}
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-700">
          🔒 Your payment information is secure and encrypted. 
          No charges will be made until you complete your first job.
        </p>
      </div>

      <Button 
        type="submit" 
        disabled={!stripe || isLoading}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving Payment Method...
          </>
        ) : (
          'Save Payment Method'
        )}
      </Button>
    </form>
  );
};

export const PaymentMethodSetup: React.FC<PaymentMethodSetupProps> = ({ onSuccess }) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentMethodForm onSuccess={onSuccess} />
    </Elements>
  );
};
