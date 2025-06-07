
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

    // Extract client info for better tracking
    const userAgent = req.headers.get('user-agent') || null
    const forwarded = req.headers.get('x-forwarded-for')
    const realIp = req.headers.get('x-real-ip')
    const ipAddress = forwarded?.split(',')[0] || realIp || null

    console.log('QR scan from:', { userAgent, ipAddress })

    // Log the QR scan to the database with enhanced tracking
    const { data: scanData, error: scanError } = await supabase
      .from('qr_scans')
      .insert({
        user_agent: userAgent,
        ip_address: ipAddress
      })
      .select()
      .single()

    if (scanError) {
      console.error('Error logging QR scan:', scanError)
      // Even if logging fails, we still want to redirect the user
    } else {
      console.log('QR scan logged successfully with ID:', scanData.id)
    }

    // Get the redirect URL from environment variable or use default
    // You can set REDIRECT_BASE_URL in your Supabase environment variables
    const redirectBaseUrl = Deno.env.get('REDIRECT_BASE_URL') || 'https://tryviafix.com'
    const redirectUrl = `${redirectBaseUrl}/qr-welcome`

    console.log('Redirecting to:', redirectUrl)

    // Redirect to the QR welcome page
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        'Location': redirectUrl
      }
    })

  } catch (error) {
    console.error('Error in QR redirect function:', error)
    
    // Fallback redirect
    const fallbackUrl = Deno.env.get('REDIRECT_BASE_URL') || 'https://tryviafix.com'
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        'Location': `${fallbackUrl}/qr-welcome`
      }
    })
  }
})
