
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Car, AlertCircle, Check, ExternalLink, Mail } from 'lucide-react';
import { decodeVin, VehicleInfo } from '@/services/nhtsa';
import VehicleSafetyData from './VehicleSafetyData';
import useVehicleSafetyData from '@/hooks/useVehicleSafetyData';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const subscriptionSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type SubscriptionFormData = z.infer<typeof subscriptionSchema>;

const VINLookupTool = () => {
  const [vin, setVin] = useState('');
  const [isDecoding, setIsDecoding] = useState(false);
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribedEmail, setSubscribedEmail] = useState('');
  
  const safetyData = useVehicleSafetyData(vin, vehicleInfo);

  const form = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      email: '',
    }
  });
  
  const handleVINChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Convert to uppercase and remove non-alphanumeric characters
    const formatted = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    // Only allow VINs up to 17 characters
    if (formatted.length <= 17) {
      setVin(formatted);
      // Reset states when VIN changes
      if (vehicleInfo) {
        setVehicleInfo(null);
      }
      if (error) {
        setError(null);
      }
    }
  };
  
  const handleLookup = async () => {
    if (!vin || vin.length !== 17) {
      setError("Please enter a valid 17-character VIN");
      return;
    }
    
    if (!isSubscribed) {
      toast({
        title: "Email required",
        description: "Please subscribe with your email to access vehicle safety data",
        variant: "default"
      });
      return;
    }
    
    setIsDecoding(true);
    setError(null);
    
    try {
      const info = await decodeVin(vin);
      setVehicleInfo(info);
      if (!info) {
        setError("Could not decode this VIN. Please check if it's correct.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to decode VIN");
      setVehicleInfo(null);
    } finally {
      setIsDecoding(false);
    }
  };
  
  const resetForm = () => {
    setVin('');
    setVehicleInfo(null);
    setError(null);
  };

  const onSubscribe = async (data: SubscriptionFormData) => {
    try {
      // Check if the email is already subscribed
      const { data: existingSubscriber, error: checkError } = await supabase
        .from('subscribers')
        .select('email')
        .eq('email', data.email)
        .maybeSingle();
        
      if (checkError) {
        console.error("Error checking subscription:", checkError);
        throw new Error("Failed to check subscription status");
      }
      
      if (!existingSubscriber) {
        // If not already subscribed, add to subscribers table (without user_id since no account required)
        const { error: insertError } = await supabase
          .from('subscribers')
          .insert({
            email: data.email,
            subscription_tier: 'free',
            subscribed: true,
            user_id: null, // No user account required for VIN lookup
          });
          
        if (insertError) {
          console.error("Error subscribing:", insertError);
          throw new Error("Failed to subscribe");
        }
      }
      
      // Store subscription status in localStorage
      localStorage.setItem('vin_lookup_email', data.email);
      localStorage.setItem('vin_lookup_subscribed_at', new Date().toISOString());
      
      setIsSubscribed(true);
      setSubscribedEmail(data.email);
      toast({
        title: "Access granted",
        description: "You can now lookup vehicle safety information",
      });
    } catch (error) {
      console.error("Subscription error:", error);
      toast({
        title: "Subscription failed",
        description: error instanceof Error ? error.message : "Failed to subscribe",
        variant: "destructive"
      });
    }
  };

  // Check for existing subscription on component mount
  React.useEffect(() => {
    const savedEmail = localStorage.getItem('vin_lookup_email');
    if (savedEmail) {
      form.setValue('email', savedEmail);
      setSubscribedEmail(savedEmail);
      setIsSubscribed(true);
    }
  }, []);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Vehicle Safety Lookup</CardTitle>
        <CardDescription>
          Enter your email and Vehicle Identification Number (VIN) to check for recalls, complaints, and safety investigations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!isSubscribed ? (
            <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-6">
              <h3 className="flex items-center text-blue-800 text-sm font-medium mb-2">
                <Mail className="h-4 w-4 mr-2" />
                Enter Email for Free VIN Lookup
              </h3>
              <p className="text-blue-700 text-xs mb-4">
                No account required! Just enter your email to access vehicle safety information
              </p>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubscribe)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex gap-2">
                            <Input 
                              placeholder="Enter your email" 
                              {...field} 
                              className="flex-1" 
                            />
                            <Button 
                              type="submit" 
                              variant="default"
                              disabled={form.formState.isSubmitting}
                            >
                              {form.formState.isSubmitting ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Processing
                                </>
                              ) : (
                                'Get Access'
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </div>
          ) : (
            <Alert className="bg-green-50 border-green-200 mb-4">
              <Check className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Access Granted</AlertTitle>
              <AlertDescription className="text-green-700">
                Welcome! You can now lookup vehicle safety information with the email: {subscribedEmail}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="vin-lookup">Vehicle Identification Number (VIN)</Label>
            <div className="flex space-x-2">
              <Input
                id="vin-lookup"
                value={vin}
                onChange={handleVINChange}
                placeholder="Enter 17-character VIN"
                className="font-mono"
                maxLength={17}
                disabled={isDecoding}
              />
              <Button 
                type="button"
                onClick={handleLookup}
                disabled={isDecoding || !vin || vin.length !== 17 || !isSubscribed}
              >
                {isDecoding ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  'Lookup'
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              The VIN can be found on your vehicle registration, insurance card, or driver's side dashboard
            </p>
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {vehicleInfo && (
            <Alert>
              <Car className="h-4 w-4" />
              <AlertTitle>Vehicle Information</AlertTitle>
              <AlertDescription>
                <div className="font-medium">
                  {vehicleInfo.modelYear} {vehicleInfo.make} {vehicleInfo.model}
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          {vehicleInfo && !safetyData.isLoading && !safetyData.error && (
            <VehicleSafetyData
              recalls={safetyData.recalls}
              complaints={safetyData.complaints}
              investigations={safetyData.investigations}
              loading={safetyData.isLoading}
              error={safetyData.error}
            />
          )}
          
          {safetyData.isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3">Loading vehicle safety data...</span>
            </div>
          )}
        </div>
      </CardContent>
      {vehicleInfo && (
        <CardFooter className="flex justify-between border-t pt-6">
          <Button variant="outline" onClick={resetForm}>
            Check Another Vehicle
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => window.open(`https://www.nhtsa.gov/recalls?vin=${vin}`, '_blank', 'noopener,noreferrer')}
          >
            NHTSA Recall Lookup 
            <ExternalLink className="h-4 w-4" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default VINLookupTool;
