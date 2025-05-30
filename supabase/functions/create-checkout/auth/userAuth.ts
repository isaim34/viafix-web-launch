
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { logStep } from '../utils/logging.ts';

export const authenticateUser = async (authHeader: string | null, supabaseUrl: string, supabaseServiceRole: string) => {
  let userEmail: string | undefined;
  let userId: string | undefined;
  
  const supabaseClient = createClient(supabaseUrl, supabaseServiceRole);
  
  if (authHeader && authHeader !== 'Bearer null') {
    try {
      logStep('Trying to authenticate with token');
      
      const token = authHeader.replace('Bearer ', '');
      const { data, error } = await supabaseClient.auth.getUser(token);
      
      if (error) {
        logStep('Auth error', { error: error.message });
      } else if (data.user) {
        userEmail = data.user.email;
        userId = data.user.id;
        logStep('User authenticated via Supabase', { userId: data.user.id, email: userEmail });
      }
    } catch (authError) {
      logStep('Error during Supabase authentication', { error: authError });
    }
  }
  
  return { userEmail, userId };
};
