import React from 'react';
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

interface VehicleMaintenanceFormProps {
  onSave: (record: MaintenanceRecord) => void;
  onCancel: () => void;
  initialData?: MaintenanceRecord;
}

const VehicleMaintenanceForm = ({ onSave, onCancel, initialData }: VehicleMaintenanceFormProps) => {
  const isEditMode = !!initialData;
  
  const form = useForm<MaintenanceRecord>({
    resolver: zodResolver(maintenanceRecordSchema),
    defaultValues: initialData || {
      date: new Date().toISOString().split('T')[0],
      vehicle: '',
      serviceType: '',
      description: '',
      mechanic: '',
      mechanicSignature: false,
    },
  });

  const onSubmit = (data: MaintenanceRecord) => {
    // Preserve mechanicNotes if they exist in initialData
    if (initialData?.mechanicNotes) {
      data.mechanicNotes = initialData.mechanicNotes;
    }
    
    // Make sure to keep the original ID when editing
    if (isEditMode && initialData?.id) {
      data.id = initialData.id;
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
