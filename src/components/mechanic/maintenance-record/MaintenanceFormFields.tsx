
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { MaintenanceRecordFormData } from './types';

interface MaintenanceFormFieldsProps {
  form: UseFormReturn<MaintenanceRecordFormData>;
  existingRecord?: any;
}

export const MaintenanceFormFields = ({ form, existingRecord }: MaintenanceFormFieldsProps) => {
  return (
    <>
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
              {existingRecord ? 'Additional Work Description' : 'Service Description'}
            </FormLabel>
            <FormControl>
              <Textarea 
                placeholder={existingRecord 
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
    </>
  );
};
