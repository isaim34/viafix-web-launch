
import React from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { cn } from '@/lib/utils';

interface NotificationBadgeProps {
  className?: string;
  showIcon?: boolean;
}

export function NotificationBadge({ className, showIcon = true }: NotificationBadgeProps) {
  const { unreadCount } = useNotifications();

  // Debug logging to help track the notification count
  console.log('NotificationBadge - Current unread count:', unreadCount);

  if (unreadCount === 0) {
    return showIcon ? <Bell className={cn("h-5 w-5", className)} /> : null;
  }

  return (
    <div className={cn("relative", className)}>
      {showIcon && <Bell className="h-5 w-5" />}
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center font-medium px-1 animate-pulse">
        {unreadCount > 99 ? '99+' : unreadCount}
      </span>
    </div>
  );
}
