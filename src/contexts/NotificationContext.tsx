
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getChatThreads } from '@/services/chat/threadService';
import { ChatThread } from '@/types/mechanic';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface NotificationContextType {
  unreadCount: number;
  showNotifications: boolean;
  soundEnabled: boolean;
  browserNotificationsEnabled: boolean;
  toggleNotifications: () => void;
  toggleSound: () => void;
  toggleBrowserNotifications: () => void;
  refreshUnreadCount: () => void;
  requestNotificationPermission: () => Promise<boolean>;
  markAsRead: (threadId: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

interface NotificationProviderProps {
  children: React.ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const { user, isLoggedIn } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [browserNotificationsEnabled, setBrowserNotificationsEnabled] = useState(false);

  // Get current user ID
  const getCurrentUserId = useCallback(() => {
    const supabaseUserId = user?.id;
    const localStorageUserId = localStorage.getItem('userId');
    return localStorageUserId || supabaseUserId || 'anonymous';
  }, [user?.id]);

  // Load preferences from localStorage
  useEffect(() => {
    const savedShowNotifications = localStorage.getItem('showNotifications');
    const savedSoundEnabled = localStorage.getItem('soundEnabled');
    const savedBrowserNotifications = localStorage.getItem('browserNotificationsEnabled');
    
    if (savedShowNotifications !== null) {
      setShowNotifications(JSON.parse(savedShowNotifications));
    }
    if (savedSoundEnabled !== null) {
      setSoundEnabled(JSON.parse(savedSoundEnabled));
    }
    if (savedBrowserNotifications !== null) {
      setBrowserNotificationsEnabled(JSON.parse(savedBrowserNotifications));
    }
  }, []);

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

  // Set up real-time subscription for unread count updates
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
              toast.success(`New message from ${newMessage.sender_name}`, {
                description: newMessage.content.length > 50 
                  ? newMessage.content.substring(0, 50) + '...' 
                  : newMessage.content,
                action: {
                  label: "View",
                  onClick: () => window.location.href = '/messages'
                }
              });
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
          const updatedThread = payload.new as any;
          
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

  // Initial load of unread count
  useEffect(() => {
    refreshUnreadCount();
  }, [refreshUnreadCount]);

  const playNotificationSound = () => {
    // Create a subtle notification sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.warn('Could not play notification sound:', error);
    }
  };

  const showBrowserNotification = (senderName: string, content: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`New message from ${senderName}`, {
        body: content.length > 100 ? content.substring(0, 100) + '...' : content,
        icon: '/favicon.ico',
        tag: 'viafix-message',
        requireInteraction: false
      });
    }
  };

  const requestNotificationPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.warn('Browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  };

  const toggleNotifications = () => {
    const newValue = !showNotifications;
    setShowNotifications(newValue);
    localStorage.setItem('showNotifications', JSON.stringify(newValue));
  };

  const toggleSound = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    localStorage.setItem('soundEnabled', JSON.stringify(newValue));
  };

  const toggleBrowserNotifications = async () => {
    if (!browserNotificationsEnabled) {
      const granted = await requestNotificationPermission();
      if (granted) {
        setBrowserNotificationsEnabled(true);
        localStorage.setItem('browserNotificationsEnabled', 'true');
      }
    } else {
      setBrowserNotificationsEnabled(false);
      localStorage.setItem('browserNotificationsEnabled', 'false');
    }
  };

  const value = {
    unreadCount,
    showNotifications,
    soundEnabled,
    browserNotificationsEnabled,
    toggleNotifications,
    toggleSound,
    toggleBrowserNotifications,
    refreshUnreadCount,
    requestNotificationPermission,
    markAsRead
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
