
import { useState, useEffect } from 'react';

export function useNotificationSettings() {
  const [showNotifications, setShowNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [browserNotificationsEnabled, setBrowserNotificationsEnabled] = useState(false);

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

  return {
    showNotifications,
    soundEnabled,
    browserNotificationsEnabled,
    toggleNotifications,
    toggleSound,
    toggleBrowserNotifications,
    requestNotificationPermission
  };
}
