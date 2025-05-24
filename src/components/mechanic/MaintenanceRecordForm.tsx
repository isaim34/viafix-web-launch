
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { FileText, User } from 'lucide-react';
import * as z from 'zod';

const maintenanceRecordSchema = z.object({
  service_type: z.string().min(2, "Service type is required"),
  description: z.string().min(10, "Please provide a detailed description"),
  vehicle_info: z.string().min(2, "Vehicle information is required"),
  parts_used: z.string().optional(),
  labor_hours: z.number().min(0).optional(),
  completion_notes: z.string().optional(),
});

type MaintenanceRecordFormData = z.infer<typeof maintenanceRecordSchema>;

interface MaintenanceRecordFormProps {
  customerId: string;
  serviceId?: string;
  serviceName?: string;
  existingMaintenanceRecord?: any;
  customerVehicle?: any;
  customOfferId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const MaintenanceRecordForm = ({ 
  customerId, 
  serviceId, 
  serviceName, 
  existingMaintenanceRecord,
  customerVehicle,
  customOfferId,
  onSuccess, 
  onCancel 
}: MaintenanceRecordFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Determine vehicle info from customer's vehicle or existing record
  const getVehicleInfo = () => {
    if (customerVehicle) {
      return `${customerVehicle.year} ${customerVehicle.make} ${customerVehicle.model}`;
    }
    if (existingMaintenanceRecord?.vehicle_info) {
      return existingMaintenanceRecord.vehicle_info;
    }
    return '';
  };
  
  const form = useForm<MaintenanceRecordFormData>({
    resolver: zodResolver(maintenanceRecordSchema),
    defaultValues: {
      service_type: serviceName || 'Custom Service',
      description: existingMaintenanceRecord?.description || '',
      vehicle_info: getVehicleInfo(),
      parts_used: '',
      labor_hours: 0,
      completion_notes: '',
    },
  });

  // Update form when existing record or vehicle data changes
  useEffect(() => {
    form.setValue('vehicle_info', getVehicleInfo());
  }, [existingMaintenanceRecord, customerVehicle]);

  const onSubmit = async (data: MaintenanceRecordFormData) => {
    setIsSubmitting(true);
    
    try {
      const mechanicId = localStorage.getItem('userId');
      
      if (!mechanicId) {
        throw new Error('Mechanic ID not found');
      }

      let vehicleId = customerVehicle?.id;
      
      // Create vehicle record if it doesn't exist
      if (!vehicleId) {
        const vehicleInfo = data.vehicle_info.split(' ');
        const year = parseInt(vehicleInfo[0]) || new Date().getFullYear();
        const make = vehicleInfo[1] || 'Unknown';
        const model = vehicleInfo.slice(2).join(' ') || 'Unknown';

        const { data: newVehicle, error: vehicleError } = await supabase
          .from('vehicles')
          .insert({
            owner_id: customerId,
            year: year,
            make: make,
            model: model,
          })
          .select()
          .single();

        if (vehicleError) throw vehicleError;
        vehicleId = newVehicle.id;
      }

      if (existingMaintenanceRecord) {
        // Update existing maintenance record by adding to the description
        const updatedDescription = `${existingMaintenanceRecord.description}\n\n--- Additional Work by Mechanic ---\n${data.description}`;
        
        const { error } = await supabase
          .from('maintenance_records')
          .update({
            description: updatedDescription,
            mechanic_id: mechanicId,
            mechanic_signature: true,
            updated_at: new Date().toISOString(),
            custom_offer_id: customOfferId,
          })
          .eq('id', existingMaintenanceRecord.id);

        if (error) throw error;
      } else {
        // Create new maintenance record
        const { error } = await supabase
          .from('maintenance_records')
          .insert({
            customer_id: customerId,
            mechanic_id: mechanicId,
            vehicle_id: vehicleId,
            service_type: data.service_type,
            description: data.description,
            mechanic_signature: true,
            date: new Date().toISOString(),
            custom_offer_id: customOfferId,
          });

        if (error) throw error;
      }

      // If this is related to a service booking, update it to completed
      if (serviceId) {
        await supabase
          .from('service_bookings')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString(),
            completion_notes: data.completion_notes,
            parts_used: data.parts_used,
            labor_hours: data.labor_hours,
          })
          .eq('id', serviceId);
      }

      toast({
        title: "Success",
        description: existingMaintenanceRecord 
          ? "Work added to existing maintenance record successfully"
          : "Maintenance record created successfully",
      });

      onSuccess();
    } catch (error) {
      console.error('Error handling maintenance record:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to handle maintenance record",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {existingMaintenanceRecord && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Existing Maintenance Record Found
            </CardTitle>
            <CardDescription>
              The customer already has a maintenance record. Your work will be added to it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {new Date(existingMaintenanceRecord.date).toLocaleDateString()}
                </Badge>
                <span className="text-sm font-medium">{existingMaintenanceRecord.service_type}</span>
              </div>
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                {existingMaintenanceRecord.description}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {customerVehicle && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Vehicle Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              <strong>Vehicle:</strong> {customerVehicle.year} {customerVehicle.make} {customerVehicle.model}
            </p>
            {customerVehicle.vin && (
              <p className="text-sm text-muted-foreground">
                <strong>VIN:</strong> {customerVehicle.vin}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="service_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Type</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Oil Change, Brake Repair" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vehicle_info"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle Information</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 2018 Honda Civic" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {existingMaintenanceRecord ? 'Additional Work Description' : 'Service Description'}
                </FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder={existingMaintenanceRecord 
                      ? "Describe the additional work you performed..."
                      : "Detailed description of work performed..."
                    }
                    className="min-h-[100px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="parts_used"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parts Used (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="List of parts used in this service..."
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="labor_hours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Labor Hours (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.5"
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="completion_notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Completion Notes (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Any additional notes or recommendations..."
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting 
                ? 'Processing...' 
                : existingMaintenanceRecord 
                  ? 'Add Work to Record' 
                  : 'Create Maintenance Record'
              }
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
