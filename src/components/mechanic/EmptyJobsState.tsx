
import React from 'react';
import { ImageIcon, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyJobsStateProps {
  onAddJobClick: () => void;
}

export const EmptyJobsState = ({ onAddJobClick }: EmptyJobsStateProps) => {
  return (
    <div className="text-center py-8 border border-dashed rounded-lg">
      <ImageIcon className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
      <p className="text-muted-foreground">No completed jobs yet</p>
      <p className="text-sm text-muted-foreground mb-4">Showcase your best work to attract more customers</p>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onAddJobClick}
        className="flex items-center gap-2 mx-auto"
      >
        <PlusCircle className="h-4 w-4" />
        Add Your First Job
      </Button>
    </div>
  );
};
