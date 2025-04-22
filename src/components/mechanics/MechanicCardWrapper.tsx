
import React from 'react';
import { Link } from 'react-router-dom';
import { MechanicCard } from '@/components/MechanicCard';

interface MechanicCardWrapperProps {
  mechanic: any;
  index: number;
  isLoggedInMechanic: boolean;
}

export const MechanicCardWrapper = ({
  mechanic,
  index,
  isLoggedInMechanic
}: MechanicCardWrapperProps) => {
  const isCurrentMechanic = mechanic.id === 'local-mechanic';

  // Link to dashboard if it's the current mechanic and they're logged in
  if (isCurrentMechanic && isLoggedInMechanic) {
    return (
      <Link to="/mechanic-dashboard" className="block h-full" key={mechanic.id}>
        <MechanicCard {...mechanic} delay={index * 0.1} />
      </Link>
    );
  }
  // Standard MechanicCard
  return (
    <MechanicCard {...mechanic} key={mechanic.id} delay={index * 0.1} />
  );
};
