
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SafetyMetricCardProps {
  title: string;
  count: number;
  description: string;
  highlightThreshold: number;
  highlightClass?: string;
  badgeVariant?: "destructive" | "default" | "outline" | "secondary" | null;
}

const SafetyMetricCard = ({ 
  title, 
  count, 
  description, 
  highlightThreshold, 
  highlightClass = "border-yellow-300",
  badgeVariant
}: SafetyMetricCardProps) => {
  const showHighlight = count > highlightThreshold;
  const cardClassName = showHighlight ? highlightClass : "";
  
  return (
    <Card className={cardClassName}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex justify-between">
          {title}
          <Badge variant={showHighlight ? badgeVariant : "outline"}>
            {count}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

export default SafetyMetricCard;
