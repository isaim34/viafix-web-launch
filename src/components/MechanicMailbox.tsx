import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, CheckCircle, XCircle, Clock, ChevronRight, ChevronDown, Search, Star, ChevronLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Define the Message type with a proper union type for 'type'
type Message = {
  id: string;
  from: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
  type: 'booking' | 'contact';
};

// Sample message data with explicit 'booking' or 'contact' types
const sampleMessages: Message[] = [
  {
    id: "msg1",
    from: "John Smith",
    subject: "Service Booking Request",
    message: "Hi, I need help with my car's AC. It's not cooling properly. Can you help me diagnose the issue? I'm available this weekend.",
    date: "2023-06-15T09:30:00",
    read: false,
    type: "booking"
  },
  {
    id: "msg2",
    from: "Sarah Wilson",
    subject: "Question about Oil Change",
    message: "Hello, I was wondering if you could do an oil change on my Toyota Camry. What type of oil do you recommend for a 2019 model?",
    date: "2023-06-14T15:45:00",
    read: true,
    type: "contact"
  },
  {
    id: "msg3",
    from: "Michael Brown",
    subject: "Brake Pad Replacement",
    message: "I need my brake pads replaced on my Honda Civic. What would be the cost and how long would it take?",
    date: "2023-06-13T11:20:00",
    read: false,
    type: "booking"
  },
  {
    id: "msg4",
    from: "Emily Johnson",
    subject: "Engine Diagnostic",
    message: "My check engine light is on. Could you help diagnose the issue? I'm located in downtown.",
    date: "2023-06-12T14:10:00",
    read: true,
    type: "contact"
  }
];

// Sample statistics data
const sampleStats = {
  completed: 42,
  cancelled: 7,
  ongoing: 3,
  totalEarnings: 4250,
  averageRating: 4.8,
  responseRate: 97
};

const MessageItem = ({ message, onOpen }: { message: Message, onOpen: (id: string) => void }) => {
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

const MessageDetail = ({ message, onClose }: { message: Message, onClose: () => void }) => {
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

const StatCard = ({ title, value, icon, color }: { title: string, value: number | string, icon: React.ReactNode, color: string }) => (
  <div className="bg-white rounded-lg border p-4">
    <div className="flex items-center gap-3">
      <div className={`rounded-full p-2 ${color}`}>
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  </div>
);

const MechanicMailbox = () => {
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [stats] = useState(sampleStats);
  const { toast } = useToast();
  
  const handleOpenMessage = (id: string) => {
    const message = messages.find(m => m.id === id);
    if (message) {
      setSelectedMessage(message);
      
      // Mark as read
      if (!message.read) {
        setMessages(messages.map(m => 
          m.id === id ? { ...m, read: true } : m
        ));
      }
    }
  };
  
  const handleCloseMessage = () => {
    setSelectedMessage(null);
  };
  
  const unreadCount = messages.filter(m => !m.read).length;
  const bookingCount = messages.filter(m => m.type === 'booking').length;
  const contactCount = messages.filter(m => m.type === 'contact').length;
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Completed Gigs" 
          value={stats.completed}
          icon={<CheckCircle size={18} />}
          color="bg-green-100 text-green-600"
        />
        <StatCard 
          title="Cancelled Gigs" 
          value={stats.cancelled}
          icon={<XCircle size={18} />}
          color="bg-red-100 text-red-600"
        />
        <StatCard 
          title="Average Rating" 
          value={`${stats.averageRating}/5.0`}
          icon={<Star size={18} className="fill-yellow-400 text-yellow-400" />}
          color="bg-yellow-100 text-yellow-600"
        />
      </div>
      
      <div className="bg-white rounded-lg border">
        <Tabs defaultValue="all" className="w-full">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Mail className="h-5 w-5" /> Inbox
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {unreadCount} new
                </Badge>
              )}
            </h2>
            <TabsList>
              <TabsTrigger value="all">
                All ({messages.length})
              </TabsTrigger>
              <TabsTrigger value="bookings">
                Bookings ({bookingCount})
              </TabsTrigger>
              <TabsTrigger value="contact">
                Contact ({contactCount})
              </TabsTrigger>
            </TabsList>
          </div>
          
          {selectedMessage ? (
            <MessageDetail message={selectedMessage} onClose={handleCloseMessage} />
          ) : (
            <>
              <div className="relative p-4 border-b">
                <Search className="absolute left-8 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input 
                  type="text" 
                  placeholder="Search messages" 
                  className="w-full pl-10 pr-4 py-2 border rounded-md"
                />
              </div>
              
              <TabsContent value="all" className="p-0 divide-y">
                {messages.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Mail className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No messages in your inbox</p>
                  </div>
                ) : (
                  messages.map(message => (
                    <MessageItem 
                      key={message.id} 
                      message={message} 
                      onOpen={handleOpenMessage}
                    />
                  ))
                )}
              </TabsContent>
              
              <TabsContent value="bookings" className="p-0 divide-y">
                {messages.filter(m => m.type === 'booking').map(message => (
                  <MessageItem 
                    key={message.id} 
                    message={message} 
                    onOpen={handleOpenMessage}
                  />
                ))}
              </TabsContent>
              
              <TabsContent value="contact" className="p-0 divide-y">
                {messages.filter(m => m.type === 'contact').map(message => (
                  <MessageItem 
                    key={message.id} 
                    message={message} 
                    onOpen={handleOpenMessage}
                  />
                ))}
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default MechanicMailbox;
