
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatBoxHeaderProps {
  recipientName: string;
  onClose: () => void;
}

export const ChatBoxHeader = ({ recipientName, onClose }: ChatBoxHeaderProps) => {
  return (
    <div className="flex justify-between items-center p-3 border-b">
      <h3 className="font-medium text-gray-800">{recipientName}</h3>
      <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};
