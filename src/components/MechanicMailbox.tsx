import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Mail, MessageCircle, CheckCircle, XCircle, Star, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Message, MechanicStats } from '@/types/mechanic';
import { StatsCard } from './mechanic/StatsCard';
import { MessageItem } from './mechanic/MessageItem';
import { MessageDetail } from './mechanic/MessageDetail';

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
const sampleStats: MechanicStats = {
  completed: 42,
  cancelled: 7,
  ongoing: 3,
  totalEarnings: 4250,
  averageRating: 4.8,
  responseRate: 97
};

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
        <StatsCard 
          title="Completed Gigs" 
          value={stats.completed}
          icon={<CheckCircle size={18} />}
          color="bg-green-100 text-green-600"
        />
        <StatsCard 
          title="Cancelled Gigs" 
          value={stats.cancelled}
          icon={<XCircle size={18} />}
          color="bg-red-100 text-red-600"
        />
        <StatsCard 
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
