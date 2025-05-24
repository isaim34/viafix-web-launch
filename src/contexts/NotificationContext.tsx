
import React, { createContext, useContext, useEffect } from 'react';
import { NotificationContextType, NotificationProviderProps } from './notifications/types';
import { useNotificationSettings } from './notifications/useNotificationSettings';
import { useUnreadCount } from './notifications/useUnreadCount';
import { useRealtimeSubscription } from './notifications/useRealtimeSubscription';

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const {
    showNotifications,
    soundEnabled,
    browserNotificationsEnabled,
    toggleNotifications,
    toggleSound,
    toggleBrowserNotifications,
    requestNotificationPermission
  } = useNotificationSettings();

  const {
    unreadCount,
    refreshUnreadCount,
    markAsRead,
    getCurrentUserId
  } = useUnreadCount();

  // Set up real-time subscription for unread count updates
  useRealtimeSubscription({
    getCurrentUserId,
    refreshUnreadCount,
    showNotifications,
    soundEnabled,
    browserNotificationsEnabled
  });

  // Initial load of unread count
  useEffect(() => {
    refreshUnreadCount();
  }, [refreshUnreadCount]);

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
