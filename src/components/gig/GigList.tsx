
import React from 'react';
import GigCard from '@/components/GigCard';
import { Gig } from './types';

interface GigListProps {
  gigs: Gig[];
  onEdit: (gig: Gig) => void;
  onDelete: (id: string) => void;
}

const GigList = ({ gigs, onEdit, onDelete }: GigListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {gigs.map((gig) => (
        <GigCard 
          key={gig.id} 
          gig={gig}
          onEdit={() => onEdit(gig)}
          onDelete={() => onDelete(gig.id)}
        />
      ))}
    </div>
  );
};

export default GigList;
