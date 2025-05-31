
import { supabase } from '@/integrations/supabase/client';

export const activateMechanicSubscription = async (mechanicId: string, triggerReason: 'first_job' = 'first_job') => {
  try {
    const { data, error } = await supabase.functions.invoke('activate-subscription', {
      body: { 
        mechanic_id: mechanicId,
        trigger_reason: triggerReason
      }
    });

    if (error) {
      console.error('Failed to activate subscription:', error);
      throw error;
    }

    console.log('Subscription activated successfully:', data);
    return data;
  } catch (error) {
    console.error('Error activating mechanic subscription:', error);
    throw error;
  }
};
