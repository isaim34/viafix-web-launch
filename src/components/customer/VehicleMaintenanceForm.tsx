
import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { MaintenanceRecord } from '@/types/customer';
import { maintenanceRecordSchema } from '@/schemas/maintenanceSchema';
import { VehicleInfo } from '@/services/nhtsaService';
import useVehicleSafetyData from '@/hooks/useVehicleSafetyData';
import VehicleInfoFields from './form/VehicleInfoFields';
import ServiceDetailsFields from './form/ServiceDetailsFields';
import SafetyDataSection from './form/SafetyDataSection';

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
  
  const defaultValues = initialData || {
    date: new Date().toISOString().split('T')[0],
    vehicle: '',
    vin: '',
    serviceType: '',
    description: '',
    mechanic: '',
    mechanicSignature: false,
  };
  
  const form = useForm<MaintenanceRecord>({
    resolver: zodResolver(maintenanceRecordSchema),
    defaultValues,
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
        const currentDescription = form.getValues('description') || '';
        const newDescription = currentDescription.includes('Vehicle specifications') 
          ? currentDescription 
          : `Vehicle specifications:\n${additionalDetails.join('\n')}\n\n${currentDescription}`;
        
        form.setValue('description', newDescription);
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
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <VehicleInfoFields onVehicleInfoChange={handleVehicleInfoChange} />
          
          <SafetyDataSection 
            recalls={recalls}
            complaints={complaints}
            investigations={investigations}
            isLoading={isLoading}
            error={error}
          />
          
          <ServiceDetailsFields />
          
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">{isEditMode ? 'Update' : 'Save'} Record</Button>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
};

export default VehicleMaintenanceForm;
