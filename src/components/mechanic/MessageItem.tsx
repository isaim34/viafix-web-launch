
import { Clock, MessageCircle } from 'lucide-react';
import { Message } from '@/types/mechanic';

interface MessageItemProps {
  message: Message;
  onOpen: (id: string) => void;
}

export const MessageItem = ({ message, onOpen }: MessageItemProps) => {
  const formattedDate = new Date(message.date).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric'
  });
  
  return (
    <div 
      onClick={() => onOpen(message.id)}
      className={`p-4 border-b cursor-pointer transition-colors ${message.read ? 'bg-white' : 'bg-blue-50'} hover:bg-gray-50`}
    >
      <div className="flex items-center gap-3">
        <div className={`rounded-full p-2 ${message.type === 'booking' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
          {message.type === 'booking' ? <Clock size={16} /> : <MessageCircle size={16} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-1">
            <h4 className={`text-sm font-medium truncate ${!message.read ? 'font-semibold' : ''}`}>{message.from}</h4>
            <span className="text-xs text-gray-500">{formattedDate}</span>
          </div>
          <p className={`text-sm ${!message.read ? 'font-medium' : 'text-gray-700'} truncate`}>
            {message.subject}
          </p>
        </div>
      </div>
    </div>
  );
};
