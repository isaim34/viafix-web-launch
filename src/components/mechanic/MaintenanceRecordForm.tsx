
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { ExistingRecordCard } from './maintenance-record/ExistingRecordCard';
import { CustomerVehicleCard } from './maintenance-record/CustomerVehicleCard';
import { MaintenanceFormFields } from './maintenance-record/MaintenanceFormFields';
import { useMaintenanceSubmit } from './maintenance-record/useMaintenanceSubmit';
import { 
  maintenanceRecordSchema, 
  type MaintenanceRecordFormData, 
  type MaintenanceRecordFormProps 
} from './maintenance-record/types';

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
  const { submitMaintenanceRecord, isSubmitting } = useMaintenanceSubmit();
  
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
    const success = await submitMaintenanceRecord(
      data,
      customerId,
      serviceId,
      existingMaintenanceRecord,
      customerVehicle,
      customOfferId
    );

    if (success) {
      onSuccess();
    }
  };

  return (
    <div className="space-y-6">
      {existingMaintenanceRecord && (
        <ExistingRecordCard existingRecord={existingMaintenanceRecord} />
      )}

      {customerVehicle && (
        <CustomerVehicleCard vehicle={customerVehicle} />
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <MaintenanceFormFields 
            form={form} 
            existingRecord={existingMaintenanceRecord} 
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
