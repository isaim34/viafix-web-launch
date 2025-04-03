
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export interface Recommendation {
  title: string;
  description: string;
  urgent: boolean;
}

interface MaintenanceRecommendationsProps {
  recommendations: Recommendation[];
}

const MaintenanceRecommendations = ({ recommendations }: MaintenanceRecommendationsProps) => {
  if (recommendations.length === 0) {
    return null;
  }
  
  return (
    <div>
      <h3 className="text-lg font-medium mb-3">FixIQ Recommendations</h3>
      <div className="space-y-3">
        {recommendations.map((rec, index) => (
          <Alert key={index} variant={rec.urgent ? "destructive" : "default"}>
            <Info className="h-4 w-4" />
            <AlertTitle>{rec.title}</AlertTitle>
            <AlertDescription>{rec.description}</AlertDescription>
          </Alert>
        ))}
      </div>
    </div>
  );
};

export default MaintenanceRecommendations;
