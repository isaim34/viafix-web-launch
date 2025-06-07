
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Log the QR scan to the database
    const { error } = await supabase
      .from('qr_scans')
      .insert({
        // scan_time will be automatically set to NOW() by the database
      })

    if (error) {
      console.error('Error logging QR scan:', error)
      // Even if logging fails, we still want to redirect the user
    } else {
      console.log('QR scan logged successfully')
    }

    // Redirect to tryviafix.com
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        'Location': 'https://tryviafix.com'
      }
    })

  } catch (error) {
    console.error('Error in QR redirect function:', error)
    
    // Even if there's an error, redirect to the website
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        'Location': 'https://tryviafix.com'
      }
    })
  }
})
