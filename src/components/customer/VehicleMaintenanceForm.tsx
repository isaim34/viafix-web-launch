
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { MaintenanceRecord } from '@/types/customer';
import { maintenanceRecordSchema } from '@/schemas/maintenanceSchema';
import VINInput from './VINInput';
import { VehicleInfo } from '@/services/nhtsaService';
import useVehicleSafetyData from '@/hooks/useVehicleSafetyData';
import VehicleSafetyData from './VehicleSafetyData';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface VehicleMaintenanceFormProps {
  onSave: (record: MaintenanceRecord) => void;
  onCancel: () => void;
  initialData?: MaintenanceRecord;
}

const VehicleMaintenanceForm = ({ onSave, onCancel, initialData }: VehicleMaintenanceFormProps) => {
  const isEditMode = !!initialData;
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo | null>(null);
  const { recalls, complaints, investigations, isLoading, error } = useVehicleSafetyData(
    initialData?.vin, 
    vehicleInfo
  );
  
  const form = useForm<MaintenanceRecord>({
    resolver: zodResolver(maintenanceRecordSchema),
    defaultValues: initialData || {
      date: new Date().toISOString().split('T')[0],
      vehicle: '',
      vin: '',
      serviceType: '',
      description: '',
      mechanic: '',
      mechanicSignature: false,
    },
  });

  const handleVehicleInfoChange = (info: VehicleInfo | null) => {
    setVehicleInfo(info);
    
    if (info) {
      // Update vehicle field with detailed info
      const vehicleDetails = [
        info.modelYear,
        info.make,
        info.model,
        info.trim,
        info.bodyClass
      ].filter(Boolean).join(' ');
      
      form.setValue('vehicle', vehicleDetails);
      
      // Add additional details to the description if available
      const additionalDetails = [
        info.engineCylinders && `${info.engineCylinders} cylinder engine`,
        info.displacement && `${info.displacement}L`,
        info.driveType,
        info.transmissionStyle,
        info.fuelType && `${info.fuelType} fuel`
      ].filter(Boolean);
      
      if (additionalDetails.length > 0) {
        form.setValue('description', `Vehicle specifications:\n${additionalDetails.join('\n')}\n\n${form.getValues('description')}`);
      }
    }
  };

  const onSubmit = (data: MaintenanceRecord) => {
    // Preserve mechanicNotes if they exist in initialData
    if (initialData?.mechanicNotes) {
      data.mechanicNotes = initialData.mechanicNotes;
    }
    
    // Make sure to keep the original ID when editing
    if (isEditMode && initialData?.id) {
      data.id = initialData.id;
    }
    
    // Include NHTSA data if available
    if (recalls.length > 0 || complaints.length > 0 || investigations.length > 0) {
      data.nhtsaData = {
        recalls,
        complaints,
        investigations
      };
    }
    
    onSave(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="vehicle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Year, Make, Model" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Example: 2018 Toyota Camry
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="vin"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <VINInput 
                  value={field.value || ''} 
                  onChange={field.onChange}
                  onVehicleInfoChange={handleVehicleInfoChange}
                />
              </FormControl>
              <FormDescription>
                The VIN can be found on your vehicle registration or insurance card.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Display NHTSA data if available */}
        {form.watch('vin') && form.watch('vin').length === 17 && (
          <Card>
            <CardContent className="pt-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-3">Loading vehicle safety data...</span>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-medium mb-3">Vehicle Safety Information</h3>
                  <VehicleSafetyData
                    recalls={recalls}
                    complaints={complaints}
                    investigations={investigations}
                    error={error}
                  />
                </>
              )}
            </CardContent>
          </Card>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="serviceType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Type</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Oil Change, Brake Repair, etc." 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="mechanic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mechanic Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Name of mechanic who performed service" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Details about the maintenance service performed"
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
          name="mechanicSignature"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Mechanic Signature
                </FormLabel>
                <FormDescription>
                  Check this box if the mechanic has verified this maintenance record
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{isEditMode ? 'Update' : 'Save'} Record</Button>
        </div>
      </form>
    </Form>
  );
};

export default VehicleMaintenanceForm;
