
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { MechanicDetail, Service } from '@/types/mechanic';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/Button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Car, Clock } from 'lucide-react';

interface BookServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mechanic: MechanicDetail;
  selectedService: Service | null;
  onSuccess?: () => void;
}

interface BookingData {
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  vehicleInfo: string;
  preferredDate: string;
  notes: string;
}

export const BookServiceDialog: React.FC<BookServiceDialogProps> = ({
  open,
  onOpenChange,
  mechanic,
  selectedService,
  onSuccess
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState<BookingData>({
    serviceId: selectedService ? `${selectedService.name}-${selectedService.price}` : '',
    serviceName: selectedService?.name || '',
    servicePrice: selectedService?.price || 0,
    vehicleInfo: '',
    preferredDate: '',
    notes: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.serviceName.trim()) {
      toast({
        title: "Service required",
        description: "Please select a service to book.",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.vehicleInfo.trim()) {
      toast({
        title: "Vehicle information required",
        description: "Please provide information about your vehicle.",
        variant: "destructive"
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be signed in to book a service.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from('service_bookings').insert({
        customer_id: user.id,
        mechanic_id: mechanic.id,
        service_id: formData.serviceId,
        service_name: formData.serviceName,
        service_price: formData.servicePrice,
        vehicle_info: formData.vehicleInfo,
        preferred_date: formData.preferredDate,
        notes: formData.notes,
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Service booked successfully!",
        description: `Your booking request for ${formData.serviceName} has been sent to ${mechanic.name}.`,
      });
      
      // Reset form
      setFormData({
        serviceId: '',
        serviceName: '',
        servicePrice: 0,
        vehicleInfo: '',
        preferredDate: '',
        notes: ''
      });
      
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error booking service:', error);
      toast({
        title: "Booking failed",
        description: "There was an error booking your service. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Create options for the services
  const serviceOptions = mechanic.services.map(service => ({
    id: `${service.name}-${service.price}`,
    name: service.name,
    price: service.price
  }));
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book Service with {mechanic.name}</DialogTitle>
          <DialogDescription>
            Fill out the form below to book a service. We'll notify you when the mechanic responds to your request.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {selectedService ? (
            <div className="bg-muted p-3 rounded-md mb-4">
              <p className="text-sm font-medium">Selected Service: <span className="text-primary">{selectedService.name}</span></p>
              <p className="text-sm text-muted-foreground">Price: ${selectedService.price}</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="serviceName">Select Service</Label>
              <select 
                id="serviceName"
                name="serviceName"
                value={formData.serviceName}
                onChange={(e) => {
                  const selected = serviceOptions.find(s => s.name === e.target.value);
                  if (selected) {
                    setFormData(prev => ({
                      ...prev,
                      serviceName: selected.name,
                      servicePrice: selected.price,
                      serviceId: selected.id
                    }));
                  }
                }}
                className="w-full border border-input bg-background px-3 py-2 text-sm rounded-md"
                required
              >
                <option value="">-- Select a service --</option>
                {serviceOptions.map(option => (
                  <option key={option.id} value={option.name}>
                    {option.name} - ${option.price}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="vehicleInfo" className="flex items-center gap-2">
              <Car className="w-4 h-4" />
              Vehicle Information <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="vehicleInfo"
              name="vehicleInfo"
              placeholder="Make, Model, Year, and any relevant vehicle information..."
              value={formData.vehicleInfo}
              onChange={handleChange}
              className="resize-none min-h-[80px]"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="preferredDate" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Preferred Date/Time
            </Label>
            <Input
              id="preferredDate"
              name="preferredDate"
              type="text"
              placeholder="e.g. Tomorrow afternoon, Next Monday at 2pm"
              value={formData.preferredDate}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Additional Notes
            </Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Any special instructions or concerns..."
              value={formData.notes}
              onChange={handleChange}
              className="resize-none min-h-[80px]"
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
              {isSubmitting ? 'Submitting...' : 'Book Service'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
