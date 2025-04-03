
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MaintenanceRecord } from '@/types/customer';
import VINInput from '../VINInput';
import { VehicleInfo } from '@/services/nhtsa';

interface VehicleInfoFieldsProps {
  onVehicleInfoChange: (info: VehicleInfo | null) => void;
}

const VehicleInfoFields = ({ onVehicleInfoChange }: VehicleInfoFieldsProps) => {
  const form = useFormContext<MaintenanceRecord>();
  
  return (
    <div className="space-y-6">
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
                onVehicleInfoChange={onVehicleInfoChange}
              />
            </FormControl>
            <FormDescription>
              The VIN can be found on your vehicle registration or insurance card.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default VehicleInfoFields;
