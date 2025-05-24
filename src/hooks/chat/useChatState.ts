
import { useState } from 'react';
import { ChatMessage } from '@/types/mechanic';

export function useChatState() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return {
    isChatOpen,
    setIsChatOpen,
    chatMessages,
    setChatMessages,
    threadId,
    setThreadId,
    isLoading,
    setIsLoading,
  };
}
