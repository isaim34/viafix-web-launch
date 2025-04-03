
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from 'lucide-react';

interface SafetyItemCardProps {
  title: string;
  description: string;
  content: {
    label: string;
    value: string;
  }[];
  date?: string;
  itemId: string;
  itemType: 'recall' | 'complaint' | 'investigation';
  onExternalLink: (type: string, id: string) => void;
}

const SafetyItemCard = ({
  title,
  description,
  content,
  date,
  itemId,
  itemType,
  onExternalLink
}: SafetyItemCardProps) => {
  return (
    <Card className={itemType === 'recall' ? 'border-red-100' : ''}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        {date && (
          <CardDescription>
            {date}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {content.map((item, index) => (
          <div key={index}>
            <h4 className="font-semibold text-sm">{item.label}</h4>
            <p className="mt-1">{item.value || "Not specified"}</p>
          </div>
        ))}
        
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-4"
          onClick={() => onExternalLink(itemType, itemId)}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          View on NHTSA Website
        </Button>
      </CardContent>
    </Card>
  );
};

export default SafetyItemCard;
