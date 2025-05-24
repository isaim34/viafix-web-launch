import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MaintenanceRecord } from '@/types/customer';
import { maintenanceRecordSchema } from '@/schemas/maintenanceSchema';
import { VehicleInfo } from '@/services/nhtsaService';
import useVehicleSafetyData from '@/hooks/useVehicleSafetyData';

interface UseMaintenanceFormProps {
  onSave: (record: MaintenanceRecord) => void;
  initialData?: MaintenanceRecord;
}

export const useMaintenanceForm = ({ onSave, initialData }: UseMaintenanceFormProps) => {
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

  return {
    form,
    isEditMode,
    vehicleInfo,
    recalls,
    complaints,
    investigations,
    isLoading,
    error,
    handleVehicleInfoChange,
    onSubmit
  };
};
