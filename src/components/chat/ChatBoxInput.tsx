
import React from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ChatBoxInputProps {
  messageText: string;
  setMessageText: (text: string) => void;
  onSendMessage: () => void;
  isLoading: boolean;
  sending: boolean;
}

export const ChatBoxInput = ({ 
  messageText, 
  setMessageText, 
  onSendMessage, 
  isLoading, 
  sending 
}: ChatBoxInputProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="p-3 border-t">
      <div className="flex">
        <Textarea
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="min-h-[60px] resize-none"
          disabled={isLoading || sending}
        />
        <Button 
          onClick={onSendMessage}
          className="ml-2 h-[60px]"
          disabled={isLoading || sending}
        >
          <Send className="h-5 w-5" />
          {sending && <span className="ml-2 animate-pulse">...</span>}
        </Button>
      </div>
    </div>
  );
};
