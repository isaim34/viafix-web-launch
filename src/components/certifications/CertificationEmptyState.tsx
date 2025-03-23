
import React from 'react';
import { Button } from '@/components/ui/button';
import { Award, PlusCircle } from 'lucide-react';

interface CertificationEmptyStateProps {
  onAddClick: () => void;
}

const CertificationEmptyState: React.FC<CertificationEmptyStateProps> = ({ onAddClick }) => {
  return (
    <div className="text-center py-12 border border-dashed rounded-lg">
      <Award className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
      <p className="text-muted-foreground mb-4">You haven't added any certifications yet</p>
      <Button 
        onClick={onAddClick}
        variant="outline"
        className="flex items-center gap-2 mx-auto"
      >
        <PlusCircle className="w-4 h-4" />
        Add Your First Certification
      </Button>
    </div>
  );
};

export default CertificationEmptyState;
