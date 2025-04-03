
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface EmptyGigStateProps {
  onCreateClick: () => void;
}

const EmptyGigState = ({ onCreateClick }: EmptyGigStateProps) => {
  return (
    <div className="text-center py-20 border border-dashed rounded-lg">
      <p className="text-muted-foreground mb-4">You haven't created any service gigs yet</p>
      <Button 
        onClick={onCreateClick}
        variant="outline"
        className="flex items-center gap-2"
      >
        <PlusCircle className="w-4 h-4" />
        Create Your First Gig
      </Button>
    </div>
  );
};

export default EmptyGigState;
