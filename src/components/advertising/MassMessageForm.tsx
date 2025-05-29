
import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Send, Users, CreditCard, MessageSquare } from 'lucide-react';
import { useZipcode } from '@/hooks/useZipcode';
import { supabase } from '@/integrations/supabase/client';

const massMessageSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  content: z.string().min(20, { message: "Message must be at least 20 characters" }),
  targetArea: z.string({ required_error: "Please select a target area" }),
  scheduleOption: z.enum(["now", "later"]),
  scheduledDate: z.string().optional(),
  customZipCode: z.string().optional(),
});

interface MassMessageFormProps {
  messagesAvailable: number;
  messageCost: number;
  onSend: (messageCount: number) => boolean;
}

export const MassMessageForm: React.FC<MassMessageFormProps> = ({
  messagesAvailable,
  messageCost,
  onSend
}) => {
  const { toast } = useToast();
  const [estimatedCount, setEstimatedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isCountLoading, setIsCountLoading] = useState(false);
  const { locationData, fetchLocationData } = useZipcode();
  
  const form = useForm<z.infer<typeof massMessageSchema>>({
    resolver: zodResolver(massMessageSchema),
    defaultValues: {
      title: "",
      content: "",
      targetArea: "",
      scheduleOption: "now",
      scheduledDate: "",
      customZipCode: "",
    },
  });

  // Get real customer count for target area
  const getCustomerCount = async (targetArea: string, customZip?: string) => {
    setIsCountLoading(true);
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('zip_code')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      const userZip = profile?.zip_code;
      let query = supabase
        .from('profiles')
        .select('id', { count: 'exact' })
        .not('zip_code', 'is', null);

      // Exclude the current user
      const currentUser = await supabase.auth.getUser();
      if (currentUser.data.user) {
        query = query.neq('id', currentUser.data.user.id);
      }

      switch (targetArea) {
        case 'localZip':
          if (userZip) {
            query = query.eq('zip_code', userZip);
          }
          break;
        case 'custom':
          if (customZip) {
            query = query.eq('zip_code', customZip);
          }
          break;
        case 'nearbyZips':
        case 'cityWide':
        case 'stateWide':
          // For now, return all customers with zip codes
          // In production, implement proper geographic filtering
          break;
      }

      const { count } = await query;
      return count || 0;
    } catch (error) {
      console.error('Error getting customer count:', error);
      return 0;
    } finally {
      setIsCountLoading(false);
    }
  };
  
  const handleSelectTarget = async (value: string) => {
    form.setValue("targetArea", value);
    const count = await getCustomerCount(value, form.getValues("customZipCode"));
    setEstimatedCount(count);
  };

  const handleCustomZipCode = async (zipCode: string) => {
    if (zipCode.length === 5) {
      await fetchLocationData(zipCode);
      const count = await getCustomerCount("custom", zipCode);
      setEstimatedCount(count);
    }
  };
  
  const onSubmit = async (formData: z.infer<typeof massMessageSchema>) => {
    if (estimatedCount === 0) {
      toast({
        title: "No customers found",
        description: "There are no customers in your target area to send messages to.",
        variant: "destructive",
      });
      return;
    }

    if (estimatedCount > messagesAvailable) {
      toast({
        title: "Not enough message credits",
        description: `You need ${estimatedCount} credits but only have ${messagesAvailable}. Purchase more message credits to continue.`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data: responseData, error } = await supabase.functions.invoke('send-mass-message', {
        body: {
          title: formData.title,
          content: formData.content,
          targetArea: formData.targetArea,
          customZipCode: formData.customZipCode
        }
      });

      if (error) throw error;

      if (responseData.success) {
        // Deduct messages from balance
        onSend(responseData.sentCount);
        
        toast({
          title: "Messages sent successfully!",
          description: `Your advertisement was sent to ${responseData.sentCount} customers via ViaFix messaging.`,
        });
        
        // Reset the form
        form.reset();
        setEstimatedCount(0);
      } else {
        throw new Error(responseData.error || 'Failed to send messages');
      }
    } catch (error) {
      console.error('Error sending mass message:', error);
      toast({
        title: "Failed to send messages",
        description: "There was an error sending your messages. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const canAffordMessage = messagesAvailable >= estimatedCount;

  return (
    <div className="space-y-6">
      {/* Message Balance Display */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            Message Credits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{messagesAvailable}</div>
                <div className="text-sm text-gray-600">Available</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {isCountLoading ? '...' : estimatedCount}
                </div>
                <div className="text-sm text-gray-600">Required</div>
              </div>
            </div>
            {!canAffordMessage && estimatedCount > 0 && (
              <div className="text-right">
                <div className="text-sm text-red-600 font-medium">
                  Need {estimatedCount - messagesAvailable} more credits
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Mass Message Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Send Mass Advertisement via ViaFix
          </CardTitle>
          <CardDescription>
            Send your advertisement to customers in your target area through ViaFix's internal messaging system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Advertisement Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Summer Special: 20% Off Brake Service" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message Content</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your special offer, promotion, or service... Be concise and highlight the value for customers." 
                        className="min-h-[120px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="targetArea"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Target Area
                    </FormLabel>
                    <Select onValueChange={handleSelectTarget} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select target customers" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="localZip">Your Zip Code Only</SelectItem>
                        <SelectItem value="nearbyZips">Nearby Zip Codes</SelectItem>
                        <SelectItem value="cityWide">City-Wide</SelectItem>
                        <SelectItem value="stateWide">State-Wide</SelectItem>
                        <SelectItem value="custom">Custom Zip Code</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("targetArea") === "custom" && (
                <FormField
                  control={form.control}
                  name="customZipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom Zip Code</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter 5-digit zip code" 
                          maxLength={5}
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            handleCustomZipCode(e.target.value);
                          }}
                        />
                      </FormControl>
                      {locationData && (
                        <div className="text-sm text-gray-600 mt-1">
                          Targeting: {locationData.places[0]?.placeName}, {locationData.places[0]?.stateAbbreviation}
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <FormField
                control={form.control}
                name="scheduleOption"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>When to Send</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select when to send" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="now">Send Immediately</SelectItem>
                        <SelectItem value="later">Schedule for Later</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {form.watch("scheduleOption") === "later" && (
                <FormField
                  control={form.control}
                  name="scheduledDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Schedule Date & Time</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              {estimatedCount > 0 && (
                <div className={`p-4 rounded-lg border ${canAffordMessage ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Cost Summary</span>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${canAffordMessage ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {canAffordMessage ? 'Affordable' : 'Insufficient Credits'}
                    </div>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Target customers:</span>
                      <span className="font-medium">{estimatedCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Credits required:</span>
                      <span className="font-medium">{estimatedCount} credits</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Your balance:</span>
                      <span className={`font-medium ${canAffordMessage ? 'text-green-600' : 'text-red-600'}`}>
                        {messagesAvailable} credits
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full flex items-center gap-2"
                disabled={!canAffordMessage || estimatedCount === 0 || isLoading || isCountLoading}
                size="lg"
              >
                <Send className="h-4 w-4" />
                {isLoading ? 'Sending...' :
                 estimatedCount === 0 ? 'Select Target Area' : 
                 !canAffordMessage ? 'Insufficient Credits' : 
                 'Send Advertisement via ViaFix'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
