
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'

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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user } } = await supabase.auth.getUser(token)

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { title, content, targetArea, customZipCode } = await req.json()

    console.log(`[SEND-MASS-MESSAGE] Processing request for user ${user.id}`)

    // Get sender profile info
    const { data: senderProfile } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', user.id)
      .single()

    const senderName = `${senderProfile?.first_name || ''} ${senderProfile?.last_name || ''}`.trim() || 'ViaFix User'

    // Get customers in target area based on zip codes
    let targetCustomers = []
    let estimatedCount = 0

    if (targetArea === 'custom' && customZipCode) {
      const { data: customers } = await supabase
        .from('profiles')
        .select('id')
        .eq('zip_code', customZipCode)
        .neq('id', user.id) // Don't send to self

      targetCustomers = customers || []
      estimatedCount = targetCustomers.length
    } else {
      // Get sender's zip code for area-based targeting
      const { data: senderData } = await supabase
        .from('profiles')
        .select('zip_code')
        .eq('id', user.id)
        .single()

      const senderZip = senderData?.zip_code

      if (senderZip) {
        switch (targetArea) {
          case 'localZip':
            const { data: localCustomers } = await supabase
              .from('profiles')
              .select('id')
              .eq('zip_code', senderZip)
              .neq('id', user.id)

            targetCustomers = localCustomers || []
            break

          case 'cityWide':
          case 'nearbyZips':
          case 'stateWide':
            // For now, get all customers with zip codes
            // In production, you'd implement proper geographic filtering
            const { data: allCustomers } = await supabase
              .from('profiles')
              .select('id')
              .not('zip_code', 'is', null)
              .neq('id', user.id)

            targetCustomers = allCustomers || []
            break
        }
      }

      estimatedCount = targetCustomers.length
    }

    console.log(`[SEND-MASS-MESSAGE] Found ${estimatedCount} target customers`)

    if (estimatedCount === 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'No customers found in target area',
          sentCount: 0 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Send individual messages to each customer
    let sentCount = 0
    const messageContent = `${title}\n\n${content}`

    for (const customer of targetCustomers) {
      try {
        // Create or find existing thread between sender and customer
        const { data: existingThread } = await supabase
          .from('chat_threads')
          .select('id')
          .contains('participants', [user.id, customer.id])
          .single()

        let threadId = existingThread?.id

        if (!threadId) {
          // Create new thread
          const { data: newThread } = await supabase
            .from('chat_threads')
            .insert({
              participants: [user.id, customer.id],
              participant_names: {
                [user.id]: senderName,
                [customer.id]: 'Customer'
              }
            })
            .select('id')
            .single()

          threadId = newThread?.id
        }

        if (threadId) {
          // Send the message
          await supabase
            .from('chat_messages')
            .insert({
              thread_id: threadId,
              sender_id: user.id,
              sender_name: senderName,
              receiver_id: customer.id,
              content: messageContent
            })

          // Update thread last message time
          await supabase
            .from('chat_threads')
            .update({ last_message_at: new Date().toISOString() })
            .eq('id', threadId)

          sentCount++
        }
      } catch (error) {
        console.error(`[SEND-MASS-MESSAGE] Failed to send to customer ${customer.id}:`, error)
      }
    }

    console.log(`[SEND-MASS-MESSAGE] Successfully sent ${sentCount} messages`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        sentCount,
        targetCount: estimatedCount 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('[SEND-MASS-MESSAGE] Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
