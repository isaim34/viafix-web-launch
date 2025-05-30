
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { sessionId, mechanicId, days } = await req.json();
    
    console.log('Updating featured status:', { sessionId, mechanicId, days });
    
    if (!mechanicId || !days) {
      throw new Error('Missing mechanicId or days');
    }

    // Create Supabase client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Calculate featured_until date
    const featuredUntil = new Date();
    featuredUntil.setDate(featuredUntil.getDate() + parseInt(days));

    // Update mechanic profile with featured status
    const { error: updateError } = await supabaseAdmin
      .from('mechanic_profiles')
      .update({
        is_featured: true,
        featured_until: featuredUntil.toISOString()
      })
      .eq('id', mechanicId);

    if (updateError) {
      throw updateError;
    }

    console.log('Successfully updated featured status for mechanic:', mechanicId);

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Featured status updated successfully',
      featured_until: featuredUntil.toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error updating featured status:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to update featured status',
      success: false 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
