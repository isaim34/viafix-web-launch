
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useProfileDisplay } from '@/hooks/useProfileDisplay';

export const UserAvatar = () => {
  const { getProfileImage, getDisplayName } = useProfileDisplay();
  const profileImage = getProfileImage();
  const displayName = getDisplayName();

  return (
    <Avatar className="h-8 w-8">
      <AvatarImage src={profileImage} alt={displayName} />
      <AvatarFallback className="bg-primary text-primary-foreground">
        {displayName ? displayName.charAt(0).toUpperCase() : 'U'}
      </AvatarFallback>
    </Avatar>
  );
};
