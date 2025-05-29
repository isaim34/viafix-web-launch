
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface QuickAction {
  title: string;
  description: string;
  icon: string;
  action: () => void;
}

interface QuickActionsProps {
  onTabChange: (tabValue: string) => void;
}

export const QuickActions = ({ onTabChange }: QuickActionsProps) => {
  const actions: QuickAction[] = [
    {
      title: 'Add Service',
      description: 'Create new service',
      icon: '🔧',
      action: () => onTabChange('services')
    },
    {
      title: 'View Calendar',
      description: 'Check schedule',
      icon: '📅',
      action: () => onTabChange('calendar')
    },
    {
      title: 'Messages',
      description: 'Check messages',
      icon: '💬',
      action: () => onTabChange('messages')
    },
    {
      title: 'Analytics',
      description: 'View reports',
      icon: '📊',
      action: () => onTabChange('analytics')
    },
    {
      title: 'Profile',
      description: 'Edit profile',
      icon: '👤',
      action: () => onTabChange('profile')
    },
    {
      title: 'Settings',
      description: 'Account settings',
      icon: '⚙️',
      action: () => onTabChange('settings')
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Frequently used features</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-gray-50"
              onClick={() => {
                console.log('Quick action button clicked:', action.title);
                action.action();
              }}
            >
              <span className="text-2xl">{action.icon}</span>
              <div className="text-center">
                <p className="font-medium text-sm">{action.title}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
