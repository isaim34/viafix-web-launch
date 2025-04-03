
import { RiskLevel } from './RiskLevelAlert';
import { VehicleInfo } from '@/services/nhtsa';

export const getVehicleRiskLevel = (recallCount: number, complaintCount: number, investigationCount: number): RiskLevel => {
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

export const getMaintenanceRecommendations = (hasRecalls: boolean, vehicleInfo: VehicleInfo, complaintCount: number, complaints: any[]) => {
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
    const components = complaints.map(c => c.component).filter(Boolean);
    
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
