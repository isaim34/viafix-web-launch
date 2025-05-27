
import React from 'react';
import { Card } from '@/components/ui/card';
import SupabaseWeeklyPlanner from '@/components/mechanic/SupabaseWeeklyPlanner';

const WeeklyPlannerTab = () => {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Weekly Planner</h2>
      <p className="text-muted-foreground mb-8">
        Plan your week by scheduling jobs with customers. Keep track of dates, service types, and estimated time for each job.
      </p>
      
      <SupabaseWeeklyPlanner />
    </Card>
  );
};

export default WeeklyPlannerTab;
