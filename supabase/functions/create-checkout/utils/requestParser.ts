
import { corsHeaders } from './cors.ts';
import { logStep } from './logging.ts';

export const parseRequestBody = async (req: Request) => {
  try {
    const rawBody = await req.text();
    logStep('Raw request body received', { bodyLength: rawBody.length, preview: rawBody.substring(0, 100) });
    
    if (!rawBody || rawBody.trim() === '') {
      logStep('ERROR: Empty request body');
      return {
        error: new Response(JSON.stringify({ 
          error: 'No request data provided',
          success: false
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        })
      };
    }
    
    const requestBody = JSON.parse(rawBody);
    logStep('Successfully parsed request body', requestBody);
    return { requestBody };
  } catch (parseError) {
    logStep('ERROR: Failed to parse JSON', { error: parseError.message });
    return {
      error: new Response(JSON.stringify({ 
        error: 'Invalid request format',
        success: false
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    };
  }
};
