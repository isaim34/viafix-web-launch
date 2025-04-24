
import React from 'react';
import { useProfileDisplay } from '@/hooks/useProfileDisplay';

interface UserGreetingProps {
  isMobile?: boolean;
}

export const UserGreeting: React.FC<UserGreetingProps> = ({ isMobile }) => {
  const { getDisplayName } = useProfileDisplay();
  const userRole = localStorage.getItem('userRole');
  const displayName = getDisplayName();

  if (isMobile) {
    return (
      <div className="pb-2">
        <p className="font-medium">Hello, {displayName}</p>
        <p className="text-muted-foreground capitalize">{userRole}</p>
      </div>
    );
  }

  return (
    <p className="hidden md:block text-right mr-2">
      Hello, <span className="font-medium">{displayName}</span>
    </p>
  );
};
