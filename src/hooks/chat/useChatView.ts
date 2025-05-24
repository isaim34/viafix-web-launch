
import { useEffect, useMemo } from 'react';
import { ChatThread } from '@/types/mechanic';
import { useChatMessages } from './useChatMessages';
import { useChatSubscription } from './useChatSubscription';
import { useNotifications } from '@/contexts/NotificationContext';

interface UseChatViewProps {
  thread: ChatThread;
  currentUserId: string;
  onNewMessage: (threadId: string) => void;
}

export function useChatView({ thread, currentUserId, onNewMessage }: UseChatViewProps) {
  const { markAsRead } = useNotifications();
  
  // Get the other participant (not the current user)
  const otherParticipantId = useMemo(() => 
    thread.participants.find(p => p !== currentUserId) || '', 
    [thread.participants, currentUserId]
  );
  
  const otherParticipantName = useMemo(() => 
    thread.participantNames[otherParticipantId] || 'Unknown User',
    [thread.participantNames, otherParticipantId]
  );
  
  // Logging thread details for debugging
  useEffect(() => {
    console.log('ChatView initialized with:', {
      threadId: thread.id,
      currentUserId,
      participants: thread.participants,
      participantNames: thread.participantNames,
      otherParticipantId,
      otherParticipantName
    });
  }, [thread, currentUserId, otherParticipantId, otherParticipantName]);

  const {
    messages,
    isLoading,
    isSending,
    error,
    loadMessages,
    handleSendMessage: sendMessage,
    addMessage,
    setError
  } = useChatMessages({
    threadId: thread.id,
    currentUserId,
    onNewMessage
  });

  // Set up real-time subscription
  useChatSubscription({
    threadId: thread.id,
    currentUserId,
    onMessageReceived: addMessage
  });

  // Load messages when component mounts and mark as read
  useEffect(() => {
    loadMessages();
    
    // Mark thread as read when viewing it
    if (thread.unreadCount > 0) {
      console.log('ChatView - Marking thread as read:', thread.id);
      markAsRead(thread.id);
    }
  }, [loadMessages, thread.id, thread.unreadCount, markAsRead]);

  const handleSendMessage = (messageText: string) => {
    return sendMessage(messageText, otherParticipantId, thread.participantNames);
  };

  return {
    messages,
    isLoading,
    isSending,
    error,
    otherParticipantName,
    handleSendMessage,
    loadMessages,
    setError
  };
}
