
import React from 'react';
import { FilePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyPlannerStateProps {
  onAddClick: () => void;
}

const EmptyPlannerState: React.FC<EmptyPlannerStateProps> = ({ onAddClick }) => {
  return (
    <div className="text-center py-12 border rounded-md bg-muted/20">
      <h3 className="text-lg font-medium mb-2">No jobs scheduled yet</h3>
      <p className="text-muted-foreground mb-6">
        Start planning your week by adding jobs to your schedule
      </p>
      <Button onClick={onAddClick}>
        <FilePlus className="mr-2 h-4 w-4" />
        Add Job
      </Button>
    </div>
  );
};

export default EmptyPlannerState;
