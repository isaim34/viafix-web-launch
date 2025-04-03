
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Search } from 'lucide-react';
import { Recall, Complaint, Investigation } from '@/types/customer';
import SafetyDataTabs from './safety/SafetyDataTabs';

interface VehicleSafetyDataProps {
  recalls: Recall[];
  complaints: Complaint[];
  investigations: Investigation[];
  loading?: boolean;
  error?: string | null;
  onOpenExternalLink?: (type: string, id: string) => void;
}

export const VehicleSafetyData = ({
  recalls,
  complaints,
  investigations,
  loading = false,
  error = null,
  onOpenExternalLink
}: VehicleSafetyDataProps) => {
  const handleExternalLink = (type: string, id: string) => {
    if (onOpenExternalLink) {
      onOpenExternalLink(type, id);
    } else {
      let url = "";
      
      switch (type) {
        case "recall":
          url = `https://www.nhtsa.gov/recalls?nhtsaId=${id}`;
          break;
        case "complaint":
          url = `https://www.nhtsa.gov/vehicle/complaints?odi=${id}`;
          break;
        case "investigation":
          url = `https://www.nhtsa.gov/vehicle/investigations?odi=${id}`;
          break;
      }
      
      if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
      }
    }
  };
  
  if (loading) {
    return (
      <div className="py-8 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2.5"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  
  const hasNoData = recalls.length === 0 && complaints.length === 0 && investigations.length === 0;
  
  if (hasNoData) {
    return (
      <Alert>
        <Search className="h-4 w-4" />
        <AlertTitle>No Safety Data Found</AlertTitle>
        <AlertDescription>
          No recalls, complaints, or investigations were found for this vehicle.
          This could mean the vehicle has no reported issues, or the data could be unavailable.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <SafetyDataTabs
      recalls={recalls}
      complaints={complaints}
      investigations={investigations}
      onExternalLink={handleExternalLink}
    />
  );
};

export default VehicleSafetyData;
