
import React from 'react';
import { Loader2, AlertTriangle, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { VehicleInfo, NHTSAData } from '@/services/nhtsa';
import RiskLevelAlert from './insights/RiskLevelAlert';
import SafetyMetrics from './insights/SafetyMetrics';
import MaintenanceRecommendations from './insights/MaintenanceRecommendations';
import { getVehicleRiskLevel, getMaintenanceRecommendations } from './insights/vehicleRiskUtils';

interface FixIQInsightsProps {
  vehicleInfo: VehicleInfo;
  safetyData: NHTSAData;
}

const FixIQInsights = ({ vehicleInfo, safetyData }: FixIQInsightsProps) => {
  if (safetyData.isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3">Analyzing vehicle data...</span>
      </div>
    );
  }
  
  if (safetyData.error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error Loading FixIQ</AlertTitle>
        <AlertDescription>
          Unable to retrieve vehicle insights at this time. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }
  
  const hasRecalls = safetyData.recalls.length > 0;
  const recallCount = safetyData.recalls.length;
  const complaintCount = safetyData.complaints.length;
  const investigationCount = safetyData.investigations.length;
  
  const riskLevel = getVehicleRiskLevel(recallCount, complaintCount, investigationCount);
  const recommendations = getMaintenanceRecommendations(
    hasRecalls, 
    vehicleInfo, 
    complaintCount, 
    safetyData.complaints
  );
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <RiskLevelAlert riskLevel={riskLevel} />
        
        <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-medium border border-blue-200">
          <Info className="h-3 w-3" />
          <span>Analysis powered by FixIQ & NHTSA data</span>
        </div>
      </div>
      
      <SafetyMetrics 
        recallCount={recallCount}
        complaintCount={complaintCount}
        investigationCount={investigationCount}
      />
      
      <MaintenanceRecommendations recommendations={recommendations} />
    </div>
  );
};

export default FixIQInsights;
