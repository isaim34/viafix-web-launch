
import React from 'react';
import { FilePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PlannerHeaderProps {
  weekTitle: string;
  onAddClick: () => void;
}

const PlannerHeader: React.FC<PlannerHeaderProps> = ({ weekTitle, onAddClick }) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-semibold">{weekTitle}</h2>
      <Button 
        onClick={onAddClick}
        className="flex items-center gap-2"
      >
        <FilePlus size={16} />
        Add Job
      </Button>
    </div>
  );
};

export default PlannerHeader;
