
import React, { useState } from 'react';
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
import { Send, Users, CreditCard } from 'lucide-react';
import { useZipcode } from '@/hooks/useZipcode';

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
  
  const handleSelectTarget = (value: string) => {
    // Enhanced recipient estimation based on area
    let estimatedRecipients = 0;
    
    switch(value) {
      case "localZip":
        estimatedRecipients = 35;
        break;
      case "nearbyZips":
        estimatedRecipients = 120;
        break;
      case "cityWide":
        estimatedRecipients = 250;
        break;
      case "stateWide":
        estimatedRecipients = 500;
        break;
      case "custom":
        estimatedRecipients = 75; // Default for custom zip
        break;
    }
    
    setEstimatedCount(estimatedRecipients);
    form.setValue("targetArea", value);
  };

  const handleCustomZipCode = async (zipCode: string) => {
    if (zipCode.length === 5) {
      await fetchLocationData(zipCode);
      // Update estimated count based on zip code data
      setEstimatedCount(45); // Estimate for custom zip
    }
  };
  
  const onSubmit = (data: z.infer<typeof massMessageSchema>) => {
    console.log("Mass message data:", data);
    
    // Check if user has enough messages
    if (estimatedCount > messagesAvailable) {
      toast({
        title: "Not enough messages",
        description: `You need ${estimatedCount} messages but only have ${messagesAvailable}. Purchase more message credits to continue.`,
        variant: "destructive",
      });
      return;
    }
    
    // Try to send the message
    const success = onSend(estimatedCount);
    
    if (success) {
      toast({
        title: "Advertisement sent!",
        description: `Your message has been sent to approximately ${estimatedCount} customers in your target area.`,
      });
      
      // Reset the form
      form.reset();
      setEstimatedCount(0);
    } else {
      toast({
        title: "Failed to send",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
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
                <div className="text-2xl font-bold text-green-600">{estimatedCount}</div>
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
            <Send className="h-5 w-5" />
            Send Mass Advertisement
          </CardTitle>
          <CardDescription>Promote your services to customers in your target area</CardDescription>
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
                        <SelectItem value="localZip">Your Zip Code Only (~35 customers)</SelectItem>
                        <SelectItem value="nearbyZips">Nearby Zip Codes (~120 customers)</SelectItem>
                        <SelectItem value="cityWide">City-Wide (~250 customers)</SelectItem>
                        <SelectItem value="stateWide">State-Wide (~500 customers)</SelectItem>
                        <SelectItem value="custom">Custom Zip Code (~45 customers)</SelectItem>
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
                      <span>Estimated recipients:</span>
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
                disabled={!canAffordMessage || estimatedCount === 0}
                size="lg"
              >
                <Send className="h-4 w-4" />
                {estimatedCount === 0 ? 'Select Target Area' : 
                 !canAffordMessage ? 'Insufficient Credits' : 
                 'Send Advertisement'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
