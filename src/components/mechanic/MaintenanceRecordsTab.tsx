
import React, { useState } from 'react';
import { MaintenanceRecordForm } from './MaintenanceRecordForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MaintenanceRecordsHeader } from './maintenance-records/MaintenanceRecordsHeader';
import { MaintenanceRecordsEmptyState } from './maintenance-records/MaintenanceRecordsEmptyState';
import { MaintenanceRecordsGrid } from './maintenance-records/MaintenanceRecordsGrid';
import { useMaintenanceRecords } from './maintenance-records/useMaintenanceRecords';

const MaintenanceRecordsTab = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { records, isLoading, formatDate, refetchRecords } = useMaintenanceRecords();

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    refetchRecords();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MaintenanceRecordsHeader onAddRecord={() => setIsFormOpen(true)} />

      {records.length === 0 ? (
        <MaintenanceRecordsEmptyState />
      ) : (
        <MaintenanceRecordsGrid records={records} formatDate={formatDate} />
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Maintenance Record</DialogTitle>
          </DialogHeader>
          <MaintenanceRecordForm
            customerId="test-customer" // For test purposes
            onSuccess={handleFormSuccess}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MaintenanceRecordsTab;
