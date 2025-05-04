
import React, { useState, useRef, useEffect } from 'react';
import { Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ChatMessage } from '@/types/mechanic';
import { supabase } from '@/integrations/supabase/client';

interface ChatBoxProps {
  isOpen: boolean;
  onClose: () => void;
  recipientId: string;
  recipientName: string;
  currentUserId: string;
  currentUserName: string;
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
  threadId?: string;
}

export const ChatBox = ({
  isOpen,
  onClose,
  recipientId,
  recipientName,
  currentUserId,
  currentUserName,
  messages,
  onSendMessage,
  isLoading = false,
  threadId,
}: ChatBoxProps) => {
  const [messageText, setMessageText] = useState('');
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Initialize localMessages with the incoming messages prop
  useEffect(() => {
    setLocalMessages(messages);
  }, [messages]);

  // Set up realtime subscription if threadId is available
  useEffect(() => {
    if (isOpen && threadId) {
      const channel = supabase
        .channel(`chat_box_${threadId}`)
        .on(
          'postgres_changes',
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'chat_messages',
            filter: `thread_id=eq.${threadId}`
          },
          (payload) => {
            console.log('ChatBox: New message received:', payload);
            const newMessage = payload.new as any;
            
            // Format the message
            const formattedMessage: ChatMessage = {
              id: newMessage.id,
              senderId: newMessage.sender_id,
              senderName: newMessage.sender_name,
              receiverId: newMessage.receiver_id,
              content: newMessage.content,
              timestamp: newMessage.timestamp,
              isRead: newMessage.is_read
            };
            
            // Only add if not already in our list and not from current user
            if (!localMessages.some(msg => msg.id === formattedMessage.id)) {
              setLocalMessages(prev => [...prev, formattedMessage]);
            }
          }
        )
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isOpen, threadId, localMessages]);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [localMessages, isOpen]);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      onSendMessage(messageText);
      setMessageText('');
    } else {
      toast({
        title: "Can't send empty message",
        description: "Please type a message before sending",
        variant: "destructive",
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-5 right-5 w-80 md:w-96 h-[500px] bg-white rounded-lg shadow-xl flex flex-col border border-gray-200 z-50">
      <div className="flex justify-between items-center p-3 border-b">
        <h3 className="font-medium text-gray-800">{recipientName}</h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : localMessages.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p>Start a conversation with {recipientName}</p>
          </div>
        ) : (
          localMessages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[70%] rounded-lg p-3 ${
                  msg.senderId === currentUserId 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <span className="text-xs opacity-70 block mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-3 border-t">
        <div className="flex">
          <Textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="min-h-[60px] resize-none"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage}
            className="ml-2 h-[60px]"
            disabled={isLoading}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
