
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Send } from 'lucide-react';

const massMessageSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  content: z.string().min(20, { message: "Message must be at least 20 characters" }),
  targetArea: z.string({ required_error: "Please select a target area" }),
  scheduleOption: z.enum(["now", "later"]),
  scheduledDate: z.string().optional(),
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
  
  const form = useForm<z.infer<typeof massMessageSchema>>({
    resolver: zodResolver(massMessageSchema),
    defaultValues: {
      title: "",
      content: "",
      targetArea: "",
      scheduleOption: "now",
      scheduledDate: "",
    },
  });
  
  const handleSelectTarget = (value: string) => {
    // In a real app, this would estimate recipients based on area
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
    }
    
    setEstimatedCount(estimatedRecipients);
    form.setValue("targetArea", value);
  };
  
  const onSubmit = (data: z.infer<typeof massMessageSchema>) => {
    console.log("Mass message data:", data);
    
    // Check if user has enough messages
    if (estimatedCount > messagesAvailable) {
      toast({
        title: "Not enough messages",
        description: `You need ${estimatedCount} messages but only have ${messagesAvailable}`,
        variant: "destructive",
      });
      return;
    }
    
    // Try to send the message
    const success = onSend(estimatedCount);
    
    if (success) {
      toast({
        title: "Advertisement sent!",
        description: `Your message has been sent to approximately ${estimatedCount} customers.`,
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Advertisement</CardTitle>
        <CardDescription>Promote your services to customers in your area</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
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
                  <FormLabel>Message</FormLabel>
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
                  <FormLabel>Target Area</FormLabel>
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
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
                    <FormLabel>Schedule Date</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {estimatedCount > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">Cost Summary</p>
                <div className="flex justify-between items-center mt-2">
                  <span>Estimated recipients:</span>
                  <span className="font-medium">{estimatedCount}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span>Total cost:</span>
                  <span className="font-medium">{estimatedCount} message credits</span>
                </div>
                {messagesAvailable < estimatedCount && (
                  <p className="text-destructive text-sm mt-2">
                    You need {estimatedCount - messagesAvailable} more message credits
                  </p>
                )}
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full flex items-center gap-2"
              disabled={messagesAvailable < estimatedCount || estimatedCount === 0}
            >
              <Send className="h-4 w-4" />
              Send Advertisement
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
