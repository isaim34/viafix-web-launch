
import { BasicProfileFields, MechanicProfileFields } from '../types';

export const checkBasicProfileCompleteness = (fields: BasicProfileFields): boolean => {
  return !!(
    fields.firstName && 
    fields.lastName && 
    fields.phone && 
    fields.zipCode
  );
};

export const checkMechanicProfileCompleteness = (fields: MechanicProfileFields): boolean => {
  return !!(
    fields.about && 
    typeof fields.about === 'string' &&
    fields.about.length >= 20 &&
    fields.specialties &&
    fields.hourlyRate && 
    typeof fields.hourlyRate === 'number' &&
    fields.hourlyRate > 0 &&
    fields.yearsExperience !== null &&
    typeof fields.yearsExperience === 'number' &&
    fields.yearsExperience >= 0
  );
};

export const analyzeMissingFields = (
  basicFields: BasicProfileFields, 
  mechanicFields: MechanicProfileFields
) => {
  const basicMissing = Object.entries(basicFields).filter(([key, value]) => !value);
  
  const mechanicMissing = Object.entries(mechanicFields).filter(([key, value]) => {
    if (key === 'about') return !value || typeof value !== 'string' || value.length < 20;
    if (key === 'hourlyRate') return !value || typeof value !== 'number' || value <= 0;
    if (key === 'yearsExperience') return value === null || typeof value !== 'number' || value < 0;
    return !value;
  });

  return { basicMissing, mechanicMissing };
};
