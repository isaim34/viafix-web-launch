
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatHeaderProps {
  participantName: string;
  onBack: () => void;
}

export const ChatHeader = ({ participantName, onBack }: ChatHeaderProps) => {
  return (
    <div className="p-4 border-b flex items-center gap-2">
      <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden">
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <h3 className="font-medium">{participantName}</h3>
    </div>
  );
};
