
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

export const ChatInput = ({ onSendMessage, isLoading }: ChatInputProps) => {
  const [messageText, setMessageText] = useState('');
  
  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    onSendMessage(messageText);
    setMessageText('');
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="p-4 border-t">
      <div className="flex">
        <Textarea
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="min-h-[80px] resize-none"
          disabled={isLoading}
        />
        <Button 
          onClick={handleSendMessage}
          className="ml-2 h-20"
          disabled={isLoading}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
