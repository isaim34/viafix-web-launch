
import { Recall, VehicleInfo, FixIQJobDecision } from '@/services/nhtsa/types';

/**
 * Determines if a job can be dispatched to a regular mechanic
 * or needs to be handled by a dealer due to recalls or warranty issues
 */
export const makeDispatchDecision = (
  vehicleInfo: VehicleInfo,
  recalls: Recall[],
  serviceType: string,
  description: string
): FixIQJobDecision => {
  // Convert strings to lowercase for easier comparison
  const serviceTypeLower = serviceType.toLowerCase();
  const descriptionLower = description.toLowerCase();
  
  // Check if the job involves a recalled component
  const involvedRecalls = recalls.filter(recall => {
    const component = recall.component.toLowerCase();
    return (
      serviceTypeLower.includes(component) || 
      descriptionLower.includes(component)
    );
  });
  
  if (involvedRecalls.length > 0) {
    return {
      isServiceable: false,
      requiresDealerRepair: true,
      reasonCode: 'RECALL',
      message: `This issue is covered under a recall for ${involvedRecalls[0].component}. Please contact a certified ${vehicleInfo.make} dealership for service.`
    };
  }
  
  // Check for warranty service (this would be more comprehensive in a real system)
  const currentYear = new Date().getFullYear();
  const vehicleAge = currentYear - parseInt(vehicleInfo.modelYear);
  const isUnderBasicWarranty = vehicleAge <= 3; // Most basic warranties are 3 years
  
  // Warranty-specific repairs that should go to dealers
  const warrantyKeywords = [
    'warranty', 'covered under warranty', 'factory defect',
    'powertrain', 'transmission failure', 'engine replacement'
  ];
  
  const isWarrantyRepair = isUnderBasicWarranty && warrantyKeywords.some(keyword => 
    serviceTypeLower.includes(keyword) || descriptionLower.includes(keyword)
  );
  
  if (isWarrantyRepair) {
    return {
      isServiceable: false,
      requiresDealerRepair: true,
      reasonCode: 'WARRANTY',
      message: `This issue may be covered under the ${vehicleInfo.make} manufacturer warranty. Please contact a certified dealership for service.`
    };
  }
  
  // Regular maintenance that can be performed by any mechanic
  return {
    isServiceable: true,
    requiresDealerRepair: false,
    reasonCode: 'APPROVED',
    message: 'This service can be performed by any qualified mechanic.'
  };
};

/**
 * Logs a FixIQ decision to the maintenance history
 */
export const logFixIQDecision = (
  decision: FixIQJobDecision,
  vehicleInfo: VehicleInfo,
  serviceType: string
) => {
  // This would typically save to a database
  console.log('FixIQ Decision:', {
    timestamp: new Date().toISOString(),
    vehicle: `${vehicleInfo.modelYear} ${vehicleInfo.make} ${vehicleInfo.model}`,
    vin: vehicleInfo.vin,
    serviceType,
    decision
  });
  
  return {
    timestamp: new Date().toISOString(),
    decision
  };
};
