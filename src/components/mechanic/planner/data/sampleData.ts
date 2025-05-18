
import { format } from 'date-fns';
import { PlannerEntry } from '../types/plannerTypes';

// Sample data removed - in a real app, this would come from an API or database
export const sampleData: PlannerEntry[] = [];

export const getEmptyEntry = () => ({
  date: format(new Date(), 'yyyy-MM-dd'),
  customerName: '',
  serviceType: '',
  estimatedTime: '',
  notes: ''
});
