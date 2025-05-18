
import { format } from 'date-fns';
import { PlannerEntry } from '../types/plannerTypes';

// This file now contains empty data arrays since test data has been removed
export const sampleData: PlannerEntry[] = [];

export const getEmptyEntry = () => ({
  date: format(new Date(), 'yyyy-MM-dd'),
  customerName: '',
  serviceType: '',
  estimatedTime: '',
  notes: ''
});
