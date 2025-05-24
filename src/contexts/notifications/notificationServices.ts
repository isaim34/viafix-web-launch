
import { toast } from 'sonner';

export const playNotificationSound = () => {
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

export const showBrowserNotification = (senderName: string, content: string) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(`New message from ${senderName}`, {
      body: content.length > 100 ? content.substring(0, 100) + '...' : content,
      icon: '/favicon.ico',
      tag: 'viafix-message',
      requireInteraction: false
    });
  }
};

export const showToastNotification = (senderName: string, content: string) => {
  toast.success(`New message from ${senderName}`, {
    description: content.length > 50 
      ? content.substring(0, 50) + '...' 
      : content,
    action: {
      label: "View",
      onClick: () => window.location.href = '/messages'
    }
  });
};
