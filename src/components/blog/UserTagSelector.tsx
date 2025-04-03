
import React from 'react';
import { Command, CommandGroup, CommandItem } from '@/components/ui/command';
import { User } from 'lucide-react';

interface UserTagSelectorProps {
  users: Array<{ id: string; name: string }>;
  position: { top: number; left: number };
  onSelectUser: (userId: string, userName: string) => void;
}

export const UserTagSelector = ({ 
  users, 
  position, 
  onSelectUser 
}: UserTagSelectorProps) => {
  return (
    <div 
      className="absolute z-50 bg-white rounded-md shadow-lg border border-gray-200 w-64"
      style={{ 
        top: `${position.top}px`, 
        left: `${position.left}px` 
      }}
    >
      <Command className="rounded-lg border shadow-md">
        <CommandGroup heading="Tag a user">
          {users.length > 0 ? (
            users.map(user => (
              <CommandItem
                key={user.id}
                onSelect={() => onSelectUser(user.id, user.name)}
                className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <span>{user.name}</span>
              </CommandItem>
            ))
          ) : (
            <div className="p-2 text-sm text-gray-500">No users found</div>
          )}
        </CommandGroup>
      </Command>
    </div>
  );
};
