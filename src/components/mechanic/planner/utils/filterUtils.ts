
import { PlannerEntry } from '@/types/mechanic';
import { FilterOptions } from '../types/plannerTypes';

// Apply filters to entries
export const filterEntries = (entries: PlannerEntry[], filterOptions: FilterOptions): PlannerEntry[] => {
  return entries.filter(entry => {
    // Filter by service type (skip if "all" is selected or no filter)
    if (filterOptions.serviceType && 
        filterOptions.serviceType !== 'all' && 
        entry.serviceType !== filterOptions.serviceType) {
      return false;
    }

    // Filter by date range
    if (filterOptions.startDate && entry.date < filterOptions.startDate) {
      return false;
    }
    if (filterOptions.endDate && entry.date > filterOptions.endDate) {
      return false;
    }

    return true;
  });
};

// Get unique service types from entries
export const getUniqueServiceTypes = (entries: PlannerEntry[]): string[] => {
  return Array.from(new Set(entries.map(entry => entry.serviceType)));
};
