
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ChatMessage, ChatThread } from '@/types/mechanic';
import { getChatMessages, sendChatMessage, markThreadAsRead } from '@/services/chatService';

interface ChatViewProps {
  thread: ChatThread;
  currentUserId: string;
  onBack: () => void;
  onNewMessage: (threadId: string) => void;
}

export const ChatView = ({
  thread,
  currentUserId,
  onBack,
  onNewMessage
}: ChatViewProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Get the other participant (not the current user)
  const otherParticipantId = thread.participants.find(p => p !== currentUserId) || '';
  const otherParticipantName = thread.participantNames[otherParticipantId] || 'Unknown User';
  
  useEffect(() => {
    // Load messages for this thread
    const loadMessages = async () => {
      setIsLoading(true);
      try {
        const chatMessages = await getChatMessages(thread.id);
        setMessages(chatMessages);
        
        // Mark messages as read
        await markThreadAsRead(thread.id, currentUserId);
        
      } catch (error) {
        console.error("Error loading messages:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMessages();
    
    // Scroll to bottom
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [thread.id, currentUserId]);
  
  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    
    try {
      // Send message
      const newMessageData = {
        senderId: currentUserId,
        senderName: thread.participantNames[currentUserId] || 'Me',
        receiverId: otherParticipantId,
        content: messageText,
        timestamp: new Date().toISOString(),
        isRead: false
      };
      
      const newMessage = await sendChatMessage(thread.id, newMessageData);
      
      // Update local state with the returned message that has an ID
      setMessages(prev => [...prev, newMessage]);
      setMessageText('');
      
      // Notify parent
      onNewMessage(thread.id);
      
      // Scroll to bottom
      setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h3 className="font-medium">{otherParticipantName}</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p>No messages yet. Start a conversation!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.senderId === currentUserId 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p>{msg.content}</p>
                <span className="text-xs opacity-70 block mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true
                  })}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
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
    </div>
  );
};
