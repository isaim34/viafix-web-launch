
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle } from 'lucide-react';
import VehicleSafetyData from './VehicleSafetyData';
import useVehicleSafetyData from '@/hooks/useVehicleSafetyData';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import EmailSubscriptionForm from './vin-lookup/EmailSubscriptionForm';
import AccessGrantedAlert from './vin-lookup/AccessGrantedAlert';
import VINInputForm from './vin-lookup/VINInputForm';
import VehicleInfoDisplay from './vin-lookup/VehicleInfoDisplay';
import VINLookupFooter from './vin-lookup/VINLookupFooter';
import { useVINLookupState } from './vin-lookup/useVINLookupState';
import { useVINLookupActions } from './vin-lookup/useVINLookupActions';

const VINLookupTool = () => {
  const {
    vin,
    isDecoding,
    vehicleInfo,
    vinError,
    isSubscribed,
    subscribedEmail,
    setIsDecoding,
    setVehicleInfo,
    setVinError,
    setIsSubscribed,
    setSubscribedEmail,
    handleVINChange,
    resetForm
  } = useVINLookupState();

  const { handleLookup, onSubscribe } = useVINLookupActions(
    vin,
    isSubscribed,
    subscribedEmail,
    setIsDecoding,
    setVehicleInfo,
    setVinError,
    setIsSubscribed,
    setSubscribedEmail
  );
  
  const safetyData = useVehicleSafetyData(vin, vehicleInfo);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Vehicle Safety Lookup</CardTitle>
        <CardDescription>
          Enter your email and Vehicle Identification Number (VIN) to check for recalls, complaints, and safety investigations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!isSubscribed ? (
            <EmailSubscriptionForm onSubscribe={onSubscribe} />
          ) : (
            <AccessGrantedAlert subscribedEmail={subscribedEmail} />
          )}
          
          <VINInputForm
            vin={vin}
            onVINChange={handleVINChange}
            onLookup={handleLookup}
            isDecoding={isDecoding}
            isSubscribed={isSubscribed}
          />
          
          {vinError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>VIN Lookup Error</AlertTitle>
              <AlertDescription>{vinError}</AlertDescription>
            </Alert>
          )}
          
          {vehicleInfo && (
            <VehicleInfoDisplay vehicleInfo={vehicleInfo} />
          )}
          
          {vehicleInfo && !safetyData.isLoading && !safetyData.error && (
            <VehicleSafetyData
              recalls={safetyData.recalls}
              complaints={safetyData.complaints}
              investigations={safetyData.investigations}
              loading={safetyData.isLoading}
              error={safetyData.error}
            />
          )}
          
          {safetyData.isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3">Loading vehicle safety data...</span>
            </div>
          )}
        </div>
      </CardContent>
      {vehicleInfo && (
        <VINLookupFooter vin={vin} onReset={resetForm} />
      )}
    </Card>
  );
};

export default VINLookupTool;
