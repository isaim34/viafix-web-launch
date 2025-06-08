
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { decodeVin } from '@/services/nhtsa';

interface SubscriptionFormData {
  email: string;
}

export const useVINLookupActions = (
  vin: string,
  isSubscribed: boolean,
  subscribedEmail: string,
  setIsDecoding: (loading: boolean) => void,
  setVehicleInfo: (info: any) => void,
  setVinError: (error: string | null) => void,
  setIsSubscribed: (subscribed: boolean) => void,
  setSubscribedEmail: (email: string) => void
) => {
  const handleLookup = async () => {
    console.log('🚀 Starting VIN lookup process');
    console.log('📋 Current state:', {
      vin,
      vinLength: vin.length,
      isSubscribed,
      subscribedEmail
    });
    
    if (!vin || vin.length !== 17) {
      const errorMsg = "Please enter a valid 17-character VIN";
      console.log('❌ VIN validation failed:', errorMsg);
      setVinError(errorMsg);
      return;
    }
    
    if (!isSubscribed) {
      console.log('❌ User not subscribed');
      toast({
        title: "Email required",
        description: "Please subscribe with your email to access vehicle safety data",
        variant: "default"
      });
      return;
    }
    
    setIsDecoding(true);
    setVinError(null);
    console.log('🔄 Starting VIN decode...');
    
    try {
      const info = await decodeVin(vin);
      console.log('📊 VIN decode result:', info);
      
      if (info) {
        setVehicleInfo(info);
        console.log('✅ Vehicle info set successfully');
      } else {
        const errorMsg = "Could not decode this VIN. Please check if it's correct.";
        console.log('❌ VIN decode returned null');
        setVinError(errorMsg);
      }
    } catch (err) {
      console.error('💥 VIN lookup error:', err);
      const errorMsg = err instanceof Error ? err.message : "Failed to decode VIN";
      setVinError(errorMsg);
      setVehicleInfo(null);
    } finally {
      setIsDecoding(false);
      console.log('🏁 VIN lookup process completed');
    }
  };

  const onSubscribe = async (data: SubscriptionFormData) => {
    console.log('📧 Starting subscription process for:', data.email);
    
    try {
      // Check if the email is already subscribed
      const { data: existingSubscriber, error: checkError } = await supabase
        .from('subscribers')
        .select('email')
        .eq('email', data.email)
        .maybeSingle();
        
      if (checkError) {
        console.error("❌ Error checking subscription:", checkError);
        throw new Error("Failed to check subscription status");
      }
      
      console.log('📋 Existing subscriber check:', existingSubscriber);
      
      if (!existingSubscriber) {
        console.log('📝 Creating new subscriber record');
        // Create subscriber with null user_id for VIN lookup users
        const { error: insertError } = await supabase
          .from('subscribers')
          .insert({
            email: data.email,
            subscription_tier: 'free',
            subscribed: true,
            user_id: null, // Explicitly set to null for VIN lookup users
          });
          
        if (insertError) {
          console.error("❌ Error creating subscriber:", insertError);
          throw new Error("Failed to subscribe");
        }
        console.log('✅ Subscriber created successfully');
      } else {
        console.log('ℹ️ Email already subscribed');
      }
      
      // Store subscription status in localStorage
      localStorage.setItem('vin_lookup_email', data.email);
      localStorage.setItem('vin_lookup_subscribed_at', new Date().toISOString());
      
      setIsSubscribed(true);
      setSubscribedEmail(data.email);
      console.log('🎉 Subscription process completed successfully');
      
      toast({
        title: "Access granted",
        description: "You can now lookup vehicle safety information",
      });
    } catch (error) {
      console.error("💥 Subscription error:", error);
      toast({
        title: "Subscription failed",
        description: error instanceof Error ? error.message : "Failed to subscribe",
        variant: "destructive"
      });
    }
  };

  return {
    handleLookup,
    onSubscribe
  };
};
