
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
      console.log('useUnreadCount - User not logged in, setting count to 0');
      setUnreadCount(0);
      return;
    }

    const currentUserId = getCurrentUserId();
    if (currentUserId === 'anonymous') {
      console.log('useUnreadCount - Anonymous user, setting count to 0');
      setUnreadCount(0);
      return;
    }

    try {
      console.log('useUnreadCount - Fetching threads for user:', currentUserId);
      const threads = await getChatThreads(currentUserId);
      console.log('useUnreadCount - Fetched threads:', threads);
      
      const totalUnread = threads.reduce((sum: number, thread: ChatThread) => {
        const threadUnread = thread.unreadCount || 0;
        console.log(`useUnreadCount - Thread ${thread.id} has ${threadUnread} unread messages`);
        return sum + threadUnread;
      }, 0);
      
      console.log('useUnreadCount - Total unread count calculated:', totalUnread);
      setUnreadCount(totalUnread);
    } catch (error) {
      console.error('useUnreadCount - Error refreshing unread count:', error);
      setUnreadCount(0);
    }
  }, [isLoggedIn, getCurrentUserId]);

  // Mark specific thread as read and update count
  const markAsRead = useCallback((threadId: string) => {
    console.log('useUnreadCount - Marking thread as read:', threadId);
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
