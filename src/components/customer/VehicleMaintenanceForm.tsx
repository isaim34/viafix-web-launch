
import React from 'react';
import { FormProvider } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { MaintenanceRecord } from '@/types/customer';
import { useMaintenanceForm } from './form/useMaintenanceForm';
import VehicleInfoFields from './form/VehicleInfoFields';
import ServiceDetailsFields from './form/ServiceDetailsFields';
import SafetyDataSection from './form/SafetyDataSection';
import { MaintenanceImageSection } from './form/MaintenanceImageSection';

interface VehicleMaintenanceFormProps {
  onSave: (record: MaintenanceRecord) => void;
  onCancel: () => void;
  initialData?: MaintenanceRecord;
}

const VehicleMaintenanceForm = ({ onSave, onCancel, initialData }: VehicleMaintenanceFormProps) => {
  const {
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
  } = useMaintenanceForm({ onSave, initialData });

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
          
          <MaintenanceImageSection 
            maintenanceRecordId={initialData?.id}
            isEditMode={isEditMode}
          />
          
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
