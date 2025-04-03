
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from 'lucide-react';

interface EmptyTabContentProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const EmptyTabContent = ({ icon: Icon, title, description }: EmptyTabContentProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center py-6">
          <Icon className="mx-auto h-12 w-12 mb-4 text-muted-foreground/70" />
          <h3 className="text-lg font-medium mb-2">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyTabContent;
