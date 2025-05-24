
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { playNotificationSound, showBrowserNotification, showToastNotification } from './notificationServices';

interface UseRealtimeSubscriptionProps {
  getCurrentUserId: () => string;
  refreshUnreadCount: () => void;
  showNotifications: boolean;
  soundEnabled: boolean;
  browserNotificationsEnabled: boolean;
}

export function useRealtimeSubscription({
  getCurrentUserId,
  refreshUnreadCount,
  showNotifications,
  soundEnabled,
  browserNotificationsEnabled
}: UseRealtimeSubscriptionProps) {
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) return;

    const currentUserId = getCurrentUserId();
    if (currentUserId === 'anonymous') return;

    // Subscribe to chat messages to update unread count in real-time
    const channel = supabase
      .channel('notification_updates')
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'chat_messages'
        },
        (payload) => {
          const newMessage = payload.new as any;
          
          // Only update if this message is for the current user
          if (newMessage.receiver_id === currentUserId) {
            console.log('New message received for notification system:', newMessage);
            
            // Play sound if enabled
            if (soundEnabled && showNotifications) {
              playNotificationSound();
            }
            
            // Show browser notification if enabled
            if (browserNotificationsEnabled && showNotifications) {
              showBrowserNotification(newMessage.sender_name, newMessage.content);
            }
            
            // Show toast notification
            if (showNotifications) {
              showToastNotification(newMessage.sender_name, newMessage.content);
            }
            
            // Refresh unread count
            refreshUnreadCount();
          }
        }
      )
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'chat_messages'
        },
        (payload) => {
          const updatedMessage = payload.new as any;
          
          // If a message was marked as read, refresh unread count
          if (updatedMessage.is_read && updatedMessage.receiver_id === currentUserId) {
            console.log('Message marked as read, refreshing unread count');
            refreshUnreadCount();
          }
        }
      )
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'chat_threads'
        },
        (payload) => {
          // If thread unread count changed, refresh our count
          console.log('Thread updated, refreshing unread count');
          refreshUnreadCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isLoggedIn, getCurrentUserId, soundEnabled, browserNotificationsEnabled, showNotifications, refreshUnreadCount]);
}
