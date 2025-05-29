
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Clock, User, Wrench, X } from 'lucide-react';
import { useSmartReminders } from './useSmartReminders';

export const SmartReminders = () => {
  const { reminders, loading, dismissReminder } = useSmartReminders();

  if (loading || reminders.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {reminders.map((reminder) => (
        <Card key={reminder.id} className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 rounded-full p-2">
                  {reminder.type === 'mechanic_inactive' && <User className="h-4 w-4 text-blue-600" />}
                  {reminder.type === 'service_due' && <Wrench className="h-4 w-4 text-blue-600" />}
                  {reminder.type === 'follow_up' && <Clock className="h-4 w-4 text-blue-600" />}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm mb-1">{reminder.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{reminder.message}</p>
                  {reminder.actionText && (
                    <Button size="sm" variant="outline">
                      {reminder.actionText}
                    </Button>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dismissReminder(reminder.id)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
