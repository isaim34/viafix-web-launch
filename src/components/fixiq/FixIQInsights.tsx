
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertTriangle, Shield, Info } from "lucide-react";
import { VehicleInfo, NHTSAData } from '@/services/nhtsa';

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
  const hasComplaints = safetyData.complaints.length > 0;
  const hasInvestigations = safetyData.investigations.length > 0;
  
  const recallCount = safetyData.recalls.length;
  const complaintCount = safetyData.complaints.length;
  const investigationCount = safetyData.investigations.length;
  
  const getVehicleRiskLevel = () => {
    if (recallCount > 2 || investigationCount > 1) {
      return {
        level: "high",
        label: "High",
        description: "This vehicle has multiple safety recalls or ongoing investigations",
        color: "bg-red-100 text-red-800 border-red-200"
      };
    } else if (recallCount > 0 || complaintCount > 5 || investigationCount > 0) {
      return {
        level: "medium",
        label: "Medium", 
        description: "This vehicle has safety recalls or numerous complaints",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200"
      };
    } else {
      return {
        level: "low",
        label: "Low",
        description: "No known safety recalls or significant issues",
        color: "bg-green-100 text-green-800 border-green-200"
      };
    }
  };
  
  const riskLevel = getVehicleRiskLevel();
  
  const getMaintenanceRecommendations = () => {
    const recommendations = [];
    
    if (hasRecalls) {
      recommendations.push({
        title: "Schedule recall service",
        description: "Visit an authorized dealer to address open recalls",
        urgent: true
      });
    }
    
    // Age-based recommendations
    const currentYear = new Date().getFullYear();
    const vehicleAge = currentYear - parseInt(vehicleInfo.modelYear);
    
    if (vehicleAge >= 5) {
      recommendations.push({
        title: "Brake system inspection",
        description: "Recommended for vehicles over 5 years old",
        urgent: false
      });
    }
    
    if (vehicleAge >= 7) {
      recommendations.push({
        title: "Timing belt inspection/replacement",
        description: "Critical for vehicles over 7 years old",
        urgent: true
      });
    }
    
    // Complaint-based recommendations
    if (complaintCount > 0) {
      const components = safetyData.complaints.map(c => c.component).filter(Boolean);
      
      if (components.some(c => c.toLowerCase().includes('brake'))) {
        recommendations.push({
          title: "Brake system diagnosis",
          description: "Based on reported issues with similar vehicles",
          urgent: true
        });
      }
      
      if (components.some(c => c.toLowerCase().includes('engine'))) {
        recommendations.push({
          title: "Engine diagnostic scan",
          description: "Based on reported issues with similar vehicles",
          urgent: false
        });
      }
    }
    
    return recommendations;
  };
  
  const recommendations = getMaintenanceRecommendations();
  
  return (
    <div className="space-y-6">
      <Alert className={riskLevel.color}>
        <Shield className="h-4 w-4" />
        <AlertTitle>Risk Level: {riskLevel.label}</AlertTitle>
        <AlertDescription>
          {riskLevel.description}
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={recallCount > 0 ? "border-red-300" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex justify-between">
              Recalls
              <Badge variant={recallCount > 0 ? "destructive" : "outline"}>
                {recallCount}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {recallCount > 0 
                ? "Safety recalls require immediate attention" 
                : "No open safety recalls found"}
            </p>
          </CardContent>
        </Card>
        
        <Card className={complaintCount > 5 ? "border-yellow-300" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex justify-between">
              Complaints
              <Badge variant={complaintCount > 5 ? "default" : "outline"}>
                {complaintCount}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {complaintCount > 0 
                ? `${complaintCount} complaints reported by owners` 
                : "No owner complaints found"}
            </p>
          </CardContent>
        </Card>
        
        <Card className={investigationCount > 0 ? "border-yellow-300" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex justify-between">
              Investigations
              <Badge variant={investigationCount > 0 ? "default" : "outline"}>
                {investigationCount}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {investigationCount > 0 
                ? "Active safety investigations" 
                : "No active investigations"}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {recommendations.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-3">FixIQ Recommendations</h3>
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <Alert key={index} variant={rec.urgent ? "destructive" : "default"}>
                <Info className="h-4 w-4" />
                <AlertTitle>{rec.title}</AlertTitle>
                <AlertDescription>{rec.description}</AlertDescription>
              </Alert>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FixIQInsights;
