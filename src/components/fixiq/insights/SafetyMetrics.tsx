
import React from 'react';
import SafetyMetricCard from './SafetyMetricCard';

interface SafetyMetricsProps {
  recallCount: number;
  complaintCount: number;
  investigationCount: number;
}

const SafetyMetrics = ({ recallCount, complaintCount, investigationCount }: SafetyMetricsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <SafetyMetricCard
        title="Recalls"
        count={recallCount}
        description={recallCount > 0 
          ? "Safety recalls require immediate attention" 
          : "No open safety recalls found"}
        highlightThreshold={0}
        highlightClass="border-red-300"
        badgeVariant="destructive"
      />
      
      <SafetyMetricCard
        title="Complaints"
        count={complaintCount}
        description={complaintCount > 0 
          ? `${complaintCount} complaints reported by owners` 
          : "No owner complaints found"}
        highlightThreshold={5}
        badgeVariant="default"
      />
      
      <SafetyMetricCard
        title="Investigations"
        count={investigationCount}
        description={investigationCount > 0 
          ? "Active safety investigations" 
          : "No active investigations"}
        highlightThreshold={0}
        badgeVariant="default"
      />
    </div>
  );
};

export default SafetyMetrics;
