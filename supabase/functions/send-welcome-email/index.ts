
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[WELCOME-EMAIL] ${step}${detailsStr}`);
};

interface EmailRequest {
  userId: string;
  userType: 'customer' | 'mechanic';
  email: string;
  firstName?: string;
  lastName?: string;
  subscriptionDetails?: {
    planType: string;
    amount: number;
    nextBilling: string;
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const mailerLiteApiKey = Deno.env.get("MAILERLITE");
    if (!mailerLiteApiKey) {
      throw new Error("MAILERLITE API key is not configured");
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { userId, userType, email, firstName, lastName, subscriptionDetails }: EmailRequest = await req.json();
    logStep("Request received", { userType, email, hasSubscriptionDetails: !!subscriptionDetails });

    // Get user profile data from database
    const { data: profileData } = await supabaseClient
      .from('profiles')
      .select('first_name, last_name, zip_code')
      .eq('id', userId)
      .single();

    const userName = firstName || profileData?.first_name || 'there';
    const fullName = `${firstName || profileData?.first_name || ''} ${lastName || profileData?.last_name || ''}`.trim();

    // Prepare subscriber data for MailerLite
    const subscriberData = {
      email: email,
      fields: {
        name: fullName,
        first_name: firstName || profileData?.first_name,
        last_name: lastName || profileData?.last_name,
        user_type: userType,
        zip_code: profileData?.zip_code,
        ...(subscriptionDetails && {
          subscription_plan: subscriptionDetails.planType,
          subscription_amount: subscriptionDetails.amount,
          next_billing: subscriptionDetails.nextBilling
        })
      }
    };

    // Add subscriber to appropriate group in MailerLite
    const groupId = userType === 'customer' ? 'customers' : 'mechanics';
    
    // Add subscriber to MailerLite
    const addSubscriberResponse = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${mailerLiteApiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(subscriberData)
    });

    const subscriberResult = await addSubscriberResponse.json();
    logStep("Subscriber added to MailerLite", { subscriberId: subscriberResult.data?.id });

    // Send appropriate welcome email based on user type
    let emailTemplate;
    let emailSubject;

    if (userType === 'customer') {
      emailSubject = "Welcome to ViaFix - Find Trusted Mechanics Near You! 🚗";
      emailTemplate = generateCustomerWelcomeEmail(userName, profileData?.zip_code);
    } else if (userType === 'mechanic') {
      if (subscriptionDetails) {
        emailSubject = "Welcome to ViaFix - Your Subscription is Active! 🔧";
        emailTemplate = generateMechanicSubscriptionEmail(userName, subscriptionDetails);
      } else {
        emailSubject = "Welcome to ViaFix - Start Building Your Mechanic Profile! 🔧";
        emailTemplate = generateMechanicWelcomeEmail(userName);
      }
    }

    // Send email via MailerLite
    const emailData = {
      to: [{ email: email, name: fullName }],
      subject: emailSubject,
      html: emailTemplate,
      from: {
        email: 'support@viafix.com',
        name: 'ViaFix Team'
      }
    };

    const emailResponse = await fetch('https://connect.mailerlite.com/api/campaigns', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${mailerLiteApiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        type: 'regular',
        emails: [emailData]
      })
    });

    const emailResult = await emailResponse.json();
    logStep("Email sent successfully", { campaignId: emailResult.data?.id });

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Welcome email sent successfully",
      subscriberId: subscriberResult.data?.id,
      campaignId: emailResult.data?.id
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in send-welcome-email", { error: errorMessage });
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      success: false
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

function generateCustomerWelcomeEmail(userName: string, zipCode?: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to ViaFix</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to ViaFix! 🚗</h1>
            <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">Your trusted platform for finding reliable mechanics</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Hi ${userName}!</h2>
            
            <p>Welcome to ViaFix! We're excited to help you find trusted, qualified mechanics in your area. Here's how to get started:</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
                <h3 style="margin-top: 0; color: #667eea;">🔍 Find Mechanics Near You</h3>
                <p>Search for mechanics in your area using our advanced filtering system. Filter by specialty, rating, hourly rate, and availability.</p>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
                <h3 style="margin-top: 0; color: #28a745;">📋 Book Services Easily</h3>
                <p>Browse mechanic profiles, read reviews, and book services directly through our platform. Get quotes and schedule appointments at your convenience.</p>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
                <h3 style="margin-top: 0; color: #e6a500;">🛡️ Safety & Trust</h3>
                <p>All mechanics are verified and reviewed by real customers. Access vehicle safety data, maintenance histories, and transparent pricing.</p>
            </div>
            
            ${zipCode ? `<p style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;"><strong>Ready to start?</strong> We'll show you mechanics near ${zipCode}. <a href="https://viafix-web.com/mechanics" style="color: #667eea; text-decoration: none;">Find mechanics now →</a></p>` : ''}
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://viafix-web.com/mechanics" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Start Finding Mechanics</a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="font-size: 14px; color: #666;">
                Need help? Reply to this email or visit our <a href="https://viafix-web.com/support" style="color: #667eea;">support center</a>.
            </p>
            
            <p style="font-size: 14px; color: #666; margin-bottom: 0;">
                Best regards,<br>
                The ViaFix Team
            </p>
        </div>
    </body>
    </html>
  `;
}

function generateMechanicWelcomeEmail(userName: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to ViaFix</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to ViaFix! 🔧</h1>
            <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">Start growing your mechanic business today</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Hi ${userName}!</h2>
            
            <p>Welcome to ViaFix! You're now part of our network of trusted mechanics. Let's get your profile set up so customers can find you:</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
                <h3 style="margin-top: 0; color: #28a745;">1. Complete Your Profile</h3>
                <p>Add your specialties, experience, hourly rate, and upload photos of your work. A complete profile gets 3x more bookings!</p>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
                <h3 style="margin-top: 0; color: #667eea;">2. Set Up Payment Method</h3>
                <p>Add your payment method to start your $50/month subscription. Don't worry - you won't be charged until you complete your first job!</p>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
                <h3 style="margin-top: 0; color: #e6a500;">3. Start Getting Bookings</h3>
                <p>Once your profile is complete, customers in your area can find and book your services. Manage everything from your dashboard.</p>
            </div>
            
            <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #28a745;">🎉 Trial Period Benefits:</h3>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>Full platform access immediately</li>
                    <li>No charges until your first completed job</li>
                    <li>Unlimited profile customization</li>
                    <li>Customer chat and booking tools</li>
                </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://viafix-web.com/mechanic-dashboard" style="background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Complete Your Profile</a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="font-size: 14px; color: #666;">
                Need help getting started? Reply to this email or visit our <a href="https://viafix-web.com/support" style="color: #28a745;">mechanic support center</a>.
            </p>
            
            <p style="font-size: 14px; color: #666; margin-bottom: 0;">
                Best regards,<br>
                The ViaFix Team
            </p>
        </div>
    </body>
    </html>
  `;
}

function generateMechanicSubscriptionEmail(userName: string, subscriptionDetails: any): string {
  const planName = subscriptionDetails.planType === 'monthly' ? 'Monthly' : 
                   subscriptionDetails.planType === 'quarterly' ? 'Quarterly' : 'Biannual';
  const amount = (subscriptionDetails.amount / 100).toFixed(2);
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Subscription Confirmed - ViaFix</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Subscription Active! 🎉</h1>
            <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">Welcome to the ViaFix mechanic network</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Hi ${userName}!</h2>
            
            <p>Great news! Your ViaFix mechanic subscription is now active. Here are your subscription details:</p>
            
            <div style="background: white; padding: 25px; border-radius: 8px; margin: 20px 0; border: 2px solid #28a745;">
                <h3 style="margin-top: 0; color: #28a745;">📋 Subscription Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Plan:</strong></td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">${planName} Subscription</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Amount:</strong></td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">$${amount}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0;"><strong>Next Billing:</strong></td>
                        <td style="padding: 8px 0; text-align: right;">${subscriptionDetails.nextBilling}</td>
                    </tr>
                </table>
            </div>
            
            <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #28a745;">🚀 What's Next?</h3>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li><strong>Complete your profile</strong> with photos and specialties</li>
                    <li><strong>Set your availability</strong> and service areas</li>
                    <li><strong>Start receiving bookings</strong> from local customers</li>
                    <li><strong>Use your dashboard</strong> to manage jobs and track earnings</li>
                </ul>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
                <h3 style="margin-top: 0; color: #667eea;">💡 Pro Tips for Success</h3>
                <p>Mechanics with complete profiles and 5-star ratings get 5x more bookings. Add detailed service descriptions and upload quality photos of your work!</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://viafix-web.com/mechanic-dashboard" style="background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; margin-right: 10px;">Go to Dashboard</a>
                <a href="https://viafix-web.com/mechanic-profile" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Edit Profile</a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="font-size: 14px; color: #666;">
                Questions about your subscription? Reply to this email or visit our <a href="https://viafix-web.com/support" style="color: #28a745;">support center</a>.
            </p>
            
            <p style="font-size: 14px; color: #666; margin-bottom: 0;">
                Best regards,<br>
                The ViaFix Team
            </p>
        </div>
    </body>
    </html>
  `;
}
