
import { format } from 'date-fns';
import { PlannerEntry } from '../types/plannerTypes';

// Production-ready file with no sample data
export const sampleData: PlannerEntry[] = [];

export const getEmptyEntry = () => ({
  date: format(new Date(), 'yyyy-MM-dd'),
  customerName: '',
  serviceType: '',
  estimatedTime: '',
  notes: ''
});
