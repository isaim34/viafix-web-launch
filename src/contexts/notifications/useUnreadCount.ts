
import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getChatThreads } from '@/services/chat/threadService';
import { ChatThread } from '@/types/mechanic';

export function useUnreadCount() {
  const { user, isLoggedIn } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  // Get current user ID
  const getCurrentUserId = useCallback(() => {
    const supabaseUserId = user?.id;
    const localStorageUserId = localStorage.getItem('userId');
    return localStorageUserId || supabaseUserId || 'anonymous';
  }, [user?.id]);

  // Calculate total unread count from threads
  const refreshUnreadCount = useCallback(async () => {
    if (!isLoggedIn) {
      setUnreadCount(0);
      return;
    }

    const currentUserId = getCurrentUserId();
    if (currentUserId === 'anonymous') {
      setUnreadCount(0);
      return;
    }

    try {
      const threads = await getChatThreads(currentUserId);
      const totalUnread = threads.reduce((sum: number, thread: ChatThread) => sum + (thread.unreadCount || 0), 0);
      console.log('NotificationContext - Total unread count:', totalUnread);
      setUnreadCount(totalUnread);
    } catch (error) {
      console.error('Error refreshing unread count:', error);
    }
  }, [isLoggedIn, getCurrentUserId]);

  // Mark specific thread as read and update count
  const markAsRead = useCallback((threadId: string) => {
    console.log('NotificationContext - Marking thread as read:', threadId);
    // Trigger a refresh of the unread count after a short delay
    // to allow the database to update
    setTimeout(() => {
      refreshUnreadCount();
    }, 500);
  }, [refreshUnreadCount]);

  return {
    unreadCount,
    refreshUnreadCount,
    markAsRead,
    getCurrentUserId
  };
}
