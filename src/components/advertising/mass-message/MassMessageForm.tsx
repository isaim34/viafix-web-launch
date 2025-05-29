
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Send, Users, MessageSquare } from 'lucide-react';
import { useZipcode } from '@/hooks/useZipcode';
import { supabase } from '@/integrations/supabase/client';
import { massMessageSchema, MassMessageFormData, MassMessageFormProps } from './types';
import { useCustomerCount } from './useCustomerCount';
import { MessageBalanceCard } from './MessageBalanceCard';
import { CostSummary } from './CostSummary';

export const MassMessageForm: React.FC<MassMessageFormProps> = ({
  messagesAvailable,
  messageCost,
  onSend
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { locationData, fetchLocationData } = useZipcode();
  const { estimatedCount, isCountLoading, getCustomerCount, setEstimatedCount } = useCustomerCount();
  
  const form = useForm<MassMessageFormData>({
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
  
  const handleSelectTarget = async (value: string) => {
    form.setValue("targetArea", value);
    await getCustomerCount(value, form.getValues("customZipCode"));
  };

  const handleCustomZipCode = async (zipCode: string) => {
    if (zipCode.length === 5) {
      await fetchLocationData(zipCode);
      await getCustomerCount("custom", zipCode);
    }
  };
  
  const onSubmit = async (formData: MassMessageFormData) => {
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
        onSend(responseData.sentCount);
        
        toast({
          title: "Messages sent successfully!",
          description: `Your advertisement was sent to ${responseData.sentCount} customers via ViaFix messaging.`,
        });
        
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
      <MessageBalanceCard 
        messagesAvailable={messagesAvailable}
        estimatedCount={estimatedCount}
        isCountLoading={isCountLoading}
        canAffordMessage={canAffordMessage}
      />

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
              
              <CostSummary 
                estimatedCount={estimatedCount}
                messagesAvailable={messagesAvailable}
                canAffordMessage={canAffordMessage}
              />
              
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
