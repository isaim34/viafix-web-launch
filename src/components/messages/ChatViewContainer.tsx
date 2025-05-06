
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import MechanicChat from '@/components/MechanicChat';

interface ChatViewContainerProps {
  selectedThreadId: string;
  handleBackToList: () => void;
}

const ChatViewContainer = ({ selectedThreadId, handleBackToList }: ChatViewContainerProps) => {
  return (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        onClick={handleBackToList} 
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Messages
      </Button>
      
      <div className="bg-white rounded-lg border shadow-sm h-[600px]">
        <MechanicChat 
          initialThreadId={selectedThreadId}
          onBack={handleBackToList}
        />
      </div>
    </div>
  );
};

export default ChatViewContainer;
