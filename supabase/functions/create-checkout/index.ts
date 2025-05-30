
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@14.21.0'

import { corsHeaders, handleCorsPreflightRequest } from './utils/cors.ts';
import { logStep } from './utils/logging.ts';
import { validateEnvironment, validateRequestBody } from './utils/validation.ts';
import { parseRequestBody } from './utils/requestParser.ts';
import { authenticateUser } from './auth/userAuth.ts';
import { getOrCreateStripeCustomer } from './stripe/customerManagement.ts';
import { createSubscriptionSession } from './stripe/subscriptionSession.ts';
import { createMessageSession } from './stripe/messageSession.ts';
import { createFeaturedSession } from './stripe/featuredSession.ts';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return handleCorsPreflightRequest();
  }

  try {
    logStep('Function started');
    
    // Validate environment variables
    const envValidation = validateEnvironment();
    if ('error' in envValidation) {
      return envValidation.error;
    }
    const { stripeKey, supabaseUrl, supabaseServiceRole } = envValidation;
    
    // Parse request body with error handling
    const bodyResult = await parseRequestBody(req);
    if ('error' in bodyResult) {
      return bodyResult.error;
    }
    const { requestBody } = bodyResult;
    
    // Validate required fields
    const validation = validateRequestBody(requestBody);
    if ('error' in validation) {
      return validation.error;
    }
    
    const { paymentType, quantity, planType, email: requestEmail } = requestBody;
    logStep('Request validation passed', { paymentType, quantity, planType, hasEmail: !!requestEmail });
    
    // Try to get user from auth header first (Supabase auth)
    const authHeader = req.headers.get('Authorization');
    const { userEmail: authUserEmail, userId } = await authenticateUser(authHeader, supabaseUrl, supabaseServiceRole);
    
    // If no user from Supabase auth, check the request body for email (local auth)
    let userEmail = authUserEmail;
    if (!userEmail && requestEmail) {
      userEmail = requestEmail;
      logStep('Using email from request body', { email: userEmail });
    }
    
    // If still no user email, return error
    if (!userEmail) {
      logStep('ERROR: No authentication found');
      return new Response(JSON.stringify({ 
        error: 'Authentication required. Please sign in to continue.',
        success: false
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Initialize Stripe
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    });

    // Get or create Stripe customer
    const customerId = await getOrCreateStripeCustomer(stripe, userEmail, userId);

    // Get origin from request headers or set a default
    const origin = req.headers.get('origin') || req.headers.get('referer') || 'https://viafix-web.com';

    // Create checkout session based on payment type
    let session;
    
    if (paymentType === 'subscription') {
      session = await createSubscriptionSession(stripe, customerId, planType, userId, userEmail, origin);
    } else if (paymentType === 'messages') {
      session = await createMessageSession(stripe, customerId, quantity, userId, userEmail, origin);
    } else {
      session = await createFeaturedSession(stripe, customerId, paymentType, quantity, userId, userEmail, origin);
    }

    logStep('Checkout session created successfully', { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url, session_id: session.id, success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep('ERROR: Unexpected error in create-checkout', { error: errorMessage, stack: error instanceof Error ? error.stack : undefined });
    
    return new Response(JSON.stringify({ 
      error: 'An unexpected error occurred. Please try again.',
      success: false
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  }
});
