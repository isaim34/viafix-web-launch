
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MaintenanceRecordForm } from './MaintenanceRecordForm';
import { CustomOfferFilters } from './custom-offers/CustomOfferFilters';
import { useCustomOffers } from './custom-offers/hooks/useCustomOffers';
import { useCustomerData } from './custom-offers/hooks/useCustomerData';
import { CustomOffer, ExistingMaintenanceRecord } from './custom-offers/types';

const CustomOffersTab = () => {
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<CustomOffer | null>(null);
  const [existingMaintenanceRecord, setExistingMaintenanceRecord] = useState<ExistingMaintenanceRecord | null>(null);
  const [customerVehicle, setCustomerVehicle] = useState<any>(null);
  
  const { offers, isLoading, updateOfferStatus } = useCustomOffers();
  const { fetchCustomerMaintenanceAndVehicle } = useCustomerData();

  const handleCompleteOffer = async (offer: CustomOffer) => {
    setSelectedOffer(offer);
    
    const { maintenanceRecord, vehicle } = await fetchCustomerMaintenanceAndVehicle(offer.customer_id);
    
    if (maintenanceRecord) {
      setExistingMaintenanceRecord({
        id: maintenanceRecord.id,
        service_type: maintenanceRecord.service_type,
        description: maintenanceRecord.description,
        date: maintenanceRecord.date,
        vehicle_id: maintenanceRecord.vehicle_id,
        customer_id: maintenanceRecord.customer_id,
        mechanic_id: maintenanceRecord.mechanic_id,
        mechanic_signature: maintenanceRecord.mechanic_signature
      });
    } else {
      setExistingMaintenanceRecord(null);
    }
    
    setCustomerVehicle(vehicle);
    setShowMaintenanceForm(true);
  };

  const handleMaintenanceRecordSuccess = () => {
    if (selectedOffer) {
      updateOfferStatus(selectedOffer.id, 'completed');
    }
    setShowMaintenanceForm(false);
    setSelectedOffer(null);
    setExistingMaintenanceRecord(null);
    setCustomerVehicle(null);
  };

  const handleCancelForm = () => {
    setShowMaintenanceForm(false);
    setSelectedOffer(null);
    setExistingMaintenanceRecord(null);
    setCustomerVehicle(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Custom Service Requests</h2>
          <p className="text-muted-foreground">
            Manage custom service requests from customers
          </p>
        </div>
        
        <CustomOfferFilters 
          offers={offers}
          onUpdateStatus={updateOfferStatus}
          onCompleteOffer={handleCompleteOffer}
        />
      </div>

      <Dialog open={showMaintenanceForm} onOpenChange={setShowMaintenanceForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {existingMaintenanceRecord 
                ? 'Add Work to Existing Maintenance Record' 
                : 'Complete Service & Create Maintenance Record'
              }
            </DialogTitle>
          </DialogHeader>
          {selectedOffer && (
            <MaintenanceRecordForm
              customerId={selectedOffer.customer_id}
              serviceName="Custom Service"
              existingMaintenanceRecord={existingMaintenanceRecord}
              customerVehicle={customerVehicle}
              customOfferId={selectedOffer.id}
              onSuccess={handleMaintenanceRecordSuccess}
              onCancel={handleCancelForm}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CustomOffersTab;
