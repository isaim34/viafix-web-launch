
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/Button';
import { Service } from '@/types/mechanic';
import { CalendarDays, Clock, DollarSign, FileText } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface CustomOfferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mechanicId: string;
  mechanicName: string;
  selectedService: Service | null;
  onSubmit: (offerDetails: CustomOfferDetails) => void;
}

export interface CustomOfferDetails {
  description: string;
  budget: string;
  timeframe: string;
  preferredDate: string;
}

export const CustomOfferDialog: React.FC<CustomOfferDialogProps> = ({
  open,
  onOpenChange,
  mechanicId,
  mechanicName,
  selectedService,
  onSubmit
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<CustomOfferDetails>({
    description: '',
    budget: selectedService ? selectedService.price.toString() : '',
    timeframe: '',
    preferredDate: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description.trim()) {
      toast({
        title: "Description required",
        description: "Please describe what service you need.",
        variant: "destructive"
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be signed in to request a custom offer.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Save to Supabase
      const { error } = await supabase.from('custom_offers').insert({
        customer_id: user.id,
        mechanic_id: mechanicId,
        description: formData.description,
        budget: formData.budget,
        timeframe: formData.timeframe,
        preferred_date: formData.preferredDate
      });
      
      if (error) {
        throw error;
      }
      
      // Call the original onSubmit callback
      onSubmit(formData);
      
      // Reset form
      setFormData({
        description: '',
        budget: selectedService ? selectedService.price.toString() : '',
        timeframe: '',
        preferredDate: ''
      });
      
    } catch (error) {
      console.error('Error submitting custom offer:', error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your custom offer. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request Custom Service from {mechanicName}</DialogTitle>
          <DialogDescription>
            Describe your service needs in detail so the mechanic can better understand your requirements.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {selectedService && (
            <div className="bg-muted p-3 rounded-md mb-4">
              <p className="text-sm font-medium">Selected Service: <span className="text-primary">{selectedService.name}</span></p>
              <p className="text-sm text-muted-foreground">Base Price: ${selectedService.price}</p>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Service Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe what you need done, include details about your vehicle (make, model, year) and the specific problem..."
              value={formData.description}
              onChange={handleChange}
              className="resize-none min-h-[120px]"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Budget
              </Label>
              <Input
                id="budget"
                name="budget"
                type="text"
                placeholder="Your budget (e.g. $100)"
                value={formData.budget}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timeframe" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Estimated Timeframe
              </Label>
              <Input
                id="timeframe"
                name="timeframe"
                type="text"
                placeholder="e.g. 2-3 hours"
                value={formData.timeframe}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="preferredDate" className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              Preferred Date/Time
            </Label>
            <Input
              id="preferredDate"
              name="preferredDate"
              type="text"
              placeholder="e.g. Oct 15, afternoon"
              value={formData.preferredDate}
              onChange={handleChange}
            />
          </div>
          
          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="ml-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Send Request'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
