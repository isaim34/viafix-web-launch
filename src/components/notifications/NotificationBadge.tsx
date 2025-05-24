
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

  if (unreadCount === 0) {
    return showIcon ? <Bell className={cn("h-5 w-5", className)} /> : null;
  }

  return (
    <div className={cn("relative", className)}>
      {showIcon && <Bell className="h-5 w-5" />}
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
        {unreadCount > 99 ? '99+' : unreadCount}
      </span>
    </div>
  );
}
