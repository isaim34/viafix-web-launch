
import { format } from 'date-fns';
import { WeeklyPlan } from '@/types/mechanic';

// Sample data - in a real app, this would come from an API or database
export const sampleWeeklyPlan: WeeklyPlan = {
  week: format(new Date(), "'Week of' MMM d, yyyy"),
  entries: [
    {
      id: '1',
      date: format(new Date(), 'yyyy-MM-dd'),
      customerName: 'John Smith',
      serviceType: 'Oil Change',
      estimatedTime: '1 hour',
      notes: 'Customer requested synthetic oil'
    },
    {
      id: '2',
      date: format(new Date(Date.now() + 86400000), 'yyyy-MM-dd'),
      customerName: 'Sarah Johnson',
      serviceType: 'Brake Replacement',
      estimatedTime: '3 hours',
      notes: 'Front and rear brake pads'
    },
    {
      id: '3',
      date: format(new Date(Date.now() + 86400000 * 2), 'yyyy-MM-dd'),
      customerName: 'Mike Wilson',
      serviceType: 'Tire Rotation',
      estimatedTime: '45 minutes',
      notes: 'Check tire pressure and tread depth'
    }
  ]
};

export const getEmptyEntry = () => ({
  date: format(new Date(), 'yyyy-MM-dd'),
  customerName: '',
  serviceType: '',
  estimatedTime: '',
  notes: ''
});
