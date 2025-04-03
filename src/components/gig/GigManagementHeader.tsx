
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface GigManagementHeaderProps {
  onAddClick: () => void;
}

const GigManagementHeader = ({ onAddClick }: GigManagementHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-2xl font-semibold">My Service Gigs</h2>
      <Button 
        onClick={onAddClick} 
        className="flex items-center gap-2"
      >
        <PlusCircle className="w-4 h-4" />
        Add New Gig
      </Button>
    </div>
  );
};

export default GigManagementHeader;
