
import { useState, useEffect } from 'react';
import { ChatMessage } from '@/types/mechanic';

interface UseChatBoxStateProps {
  messages: ChatMessage[];
  isOpen: boolean;
}

export function useChatBoxState({ messages, isOpen }: UseChatBoxStateProps) {
  const [messageText, setMessageText] = useState('');
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);

  // Initialize localMessages with the incoming messages prop
  useEffect(() => {
    setLocalMessages(messages);
  }, [messages]);

  const clearMessageText = () => setMessageText('');

  return {
    messageText,
    setMessageText,
    localMessages,
    setLocalMessages,
    sending,
    setSending,
    clearMessageText
  };
}
