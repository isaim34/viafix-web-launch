
// Production-ready file with no sample data
export const recentActivityData: any[] = [];
export const todaysScheduleData: any[] = [];
export const performanceData = {
  totalJobs: 0,
  completedJobs: 0,
  pendingJobs: 0,
  totalEarnings: 0,
  averageRating: 0,
  responseTime: "N/A"
};

// Provide empty implementations for the functions that are still being imported
export const getTodaysSchedule = () => [];
export const getRecentActivity = () => [];
export const getQuickActions = (onTabChange: (tabValue: string) => void) => [
  {
    title: "View Schedule",
    description: "Check your appointments",
    icon: "Calendar",
    onClick: () => onTabChange('planner')
  },
  {
    title: "View Messages",
    description: "Check customer messages",
    icon: "MessageSquare",
    onClick: () => onTabChange('messages')
  }
];
