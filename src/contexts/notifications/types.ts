
export interface NotificationContextType {
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

export interface NotificationProviderProps {
  children: React.ReactNode;
}
