
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Bell, Volume2, Monitor } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';

export function NotificationSettings() {
  const {
    showNotifications,
    soundEnabled,
    browserNotificationsEnabled,
    toggleNotifications,
    toggleSound,
    toggleBrowserNotifications,
    requestNotificationPermission
  } = useNotifications();

  const handleBrowserNotificationToggle = async () => {
    if (!browserNotificationsEnabled) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        alert('Please enable notifications in your browser settings to use this feature.');
        return;
      }
    }
    toggleBrowserNotifications();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Settings
        </CardTitle>
        <CardDescription>
          Manage how you receive notifications for new messages
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="show-notifications" className="font-medium">
              Enable Notifications
            </Label>
            <p className="text-sm text-muted-foreground">
              Turn on/off all notification types
            </p>
          </div>
          <Switch
            id="show-notifications"
            checked={showNotifications}
            onCheckedChange={toggleNotifications}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="sound-notifications" className="font-medium flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              Sound Notifications
            </Label>
            <p className="text-sm text-muted-foreground">
              Play a sound when new messages arrive
            </p>
          </div>
          <Switch
            id="sound-notifications"
            checked={soundEnabled}
            onCheckedChange={toggleSound}
            disabled={!showNotifications}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="browser-notifications" className="font-medium flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              Browser Notifications
            </Label>
            <p className="text-sm text-muted-foreground">
              Show desktop notifications even when ViaFix is in the background
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!browserNotificationsEnabled && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleBrowserNotificationToggle}
                disabled={!showNotifications}
              >
                Enable
              </Button>
            )}
            <Switch
              id="browser-notifications"
              checked={browserNotificationsEnabled}
              onCheckedChange={handleBrowserNotificationToggle}
              disabled={!showNotifications}
            />
          </div>
        </div>

        {browserNotificationsEnabled && (
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <p className="text-sm text-green-700">
              ✓ Browser notifications are enabled. You'll receive notifications even when ViaFix is not the active tab.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
