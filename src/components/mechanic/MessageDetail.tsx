
import { ChevronLeft } from 'lucide-react';
import { Message } from '@/types/mechanic';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MessageDetailProps {
  message: Message;
  onClose: () => void;
}

export const MessageDetail = ({ message, onClose }: MessageDetailProps) => {
  const formattedDate = new Date(message.date).toLocaleString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  });
  
  return (
    <div className="p-4">
      <Button variant="outline" size="sm" onClick={onClose} className="mb-4">
        <ChevronLeft size={16} className="mr-1" /> Back to inbox
      </Button>
      
      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold">{message.subject}</h3>
          <Badge variant={message.type === 'booking' ? 'default' : 'secondary'}>
            {message.type === 'booking' ? 'Booking Request' : 'Contact Message'}
          </Badge>
        </div>
        
        <div className="flex justify-between items-center mb-6 text-sm text-gray-500">
          <div>From: <span className="font-medium text-gray-700">{message.from}</span></div>
          <div>{formattedDate}</div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <p className="text-gray-800">{message.message}</p>
        </div>
        
        <div className="flex gap-3 justify-end">
          {message.type === 'booking' ? (
            <>
              <Button variant="outline">Decline</Button>
              <Button>Accept Booking</Button>
            </>
          ) : (
            <Button>Reply</Button>
          )}
        </div>
      </div>
    </div>
  );
};
