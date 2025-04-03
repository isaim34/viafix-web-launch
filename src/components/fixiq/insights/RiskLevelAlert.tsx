
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield } from "lucide-react";

export interface RiskLevel {
  level: "high" | "medium" | "low";
  label: string;
  description: string;
  color: string;
}

interface RiskLevelAlertProps {
  riskLevel: RiskLevel;
}

const RiskLevelAlert = ({ riskLevel }: RiskLevelAlertProps) => {
  return (
    <Alert className={riskLevel.color}>
      <Shield className="h-4 w-4" />
      <AlertTitle>Risk Level: {riskLevel.label}</AlertTitle>
      <AlertDescription>
        {riskLevel.description}
      </AlertDescription>
    </Alert>
  );
};

export default RiskLevelAlert;
