
import React from 'react';
import { Button } from '@/components/ui/button';
import { GraduationCap, PlusCircle } from 'lucide-react';

interface EducationEmptyStateProps {
  onAddClick: () => void;
}

const EducationEmptyState: React.FC<EducationEmptyStateProps> = ({ onAddClick }) => {
  return (
    <div className="text-center py-12 border border-dashed rounded-lg">
      <GraduationCap className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
      <p className="text-muted-foreground mb-4">You haven't added any education or training yet</p>
      <Button 
        onClick={onAddClick}
        variant="outline"
        className="flex items-center gap-2 mx-auto"
      >
        <PlusCircle className="w-4 h-4" />
        Add Your First Education Entry
      </Button>
    </div>
  );
};

export default EducationEmptyState;
