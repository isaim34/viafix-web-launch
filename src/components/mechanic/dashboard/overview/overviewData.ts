
import { 
  Calendar, 
  MessageCircle, 
  Star, 
  CheckCircle
} from 'lucide-react';

export const getTodaysSchedule = () => [
  {
    id: 1,
    time: '9:00 AM',
    customer: 'John Smith',
    service: 'Oil Change',
    location: '123 Main St',
    status: 'confirmed' as const
  },
  {
    id: 2,
    time: '11:30 AM',
    customer: 'Sarah Johnson',
    service: 'Brake Inspection',
    location: '456 Oak Ave',
    status: 'pending' as const
  },
  {
    id: 3,
    time: '2:00 PM',
    customer: 'Mike Wilson',
    service: 'Engine Diagnostic',
    location: '789 Pine St',
    status: 'confirmed' as const
  }
];

export const getRecentActivity = () => [
  {
    id: 1,
    type: 'review',
    message: 'New 5-star review from Emma Davis',
    time: '2 hours ago',
    icon: Star
  },
  {
    id: 2,
    type: 'message',
    message: 'Message from Alex Thompson about brake service',
    time: '4 hours ago',
    icon: MessageCircle
  },
  {
    id: 3,
    type: 'completed',
    message: 'Completed oil change for Robert Chen',
    time: '6 hours ago',
    icon: CheckCircle
  },
  {
    id: 4,
    type: 'booking',
    message: 'New booking request for transmission repair',
    time: '1 day ago',
    icon: Calendar
  }
];

export const getQuickActions = (handleTabChange: (tabValue: string) => void) => [
  { 
    title: 'Add New Gig', 
    description: 'Create a new service offering', 
    icon: '🔧',
    action: () => handleTabChange('gigs')
  },
  { 
    title: 'Update Schedule', 
    description: 'Manage your availability', 
    icon: '📅',
    action: () => handleTabChange('planner')
  },
  { 
    title: 'View Messages', 
    description: 'Check customer messages', 
    icon: '💬',
    action: () => handleTabChange('messages')
  },
  { 
    title: 'Add Maintenance Record', 
    description: 'Log completed work', 
    icon: '📝',
    action: () => handleTabChange('maintenance')
  },
  { 
    title: 'Generate Report', 
    description: 'Create income report', 
    icon: '📊',
    action: () => handleTabChange('stats')
  },
  { 
    title: 'Manage Profile', 
    description: 'Update your information', 
    icon: '👤',
    action: () => handleTabChange('profile')
  }
];
