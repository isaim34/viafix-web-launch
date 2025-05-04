
import React from 'react';
import { Link } from 'react-router-dom';
import { MechanicCard } from '@/components/MechanicCard';
import { MechanicProfile } from '@/hooks/useMechanics';

interface MechanicCardWrapperProps {
  mechanic: MechanicProfile;
}

export const MechanicCardWrapper: React.FC<MechanicCardWrapperProps> = ({ mechanic }) => {
  return (
    <Link to={`/mechanics/${mechanic.id}`} className="block transition-transform hover:-translate-y-1">
      <MechanicCard
        id={mechanic.id}
        name={mechanic.name || 'Unknown Mechanic'}  
        avatar={mechanic.avatar || ''}
        specialties={Array.isArray(mechanic.specialties) ? mechanic.specialties : 
                     typeof mechanic.specialties === 'string' ? [mechanic.specialties] : 
                     ['General Repairs']}
        rating={mechanic.rating || 0}
        reviewCount={mechanic.reviewCount || 0}
        location={mechanic.location || 'Location unknown'}
        hourlyRate={mechanic.hourlyRate || 0}
      />
    </Link>
  );
};
