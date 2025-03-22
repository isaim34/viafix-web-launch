
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ChatBox } from '@/components/chat/ChatBox';
import { findOrCreateChatThread, sendChatMessage, getChatMessages } from '@/services/chatService';
import { ChatMessage, MechanicDetail } from '@/types/mechanic';
import { MechanicProfileHeader } from '@/components/mechanic/MechanicProfileHeader';
import { MechanicAbout } from '@/components/mechanic/MechanicAbout';
import { MechanicServices } from '@/components/mechanic/MechanicServices';
import { MechanicReviews } from '@/components/mechanic/MechanicReviews';
import { BookingCard } from '@/components/mechanic/BookingCard';

// Sample mechanic detailed data
const mechanicsDetailedData = {
  '1': {
    id: '1',
    name: 'Alex Johnson',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
    specialties: ['Engine Repair', 'Diagnostics', 'Oil Changes', 'Brake Replacement'],
    rating: 4.8,
    reviewCount: 127,
    location: 'Los Angeles, CA',
    hourlyRate: 85,
    yearsExperience: 8,
    about: "Certified master mechanic with over 8 years of experience specializing in German and Japanese vehicles. I take pride in providing honest, high-quality service at fair prices. My mobile setup allows me to perform most repairs and maintenance directly at your location.",
    responseTime: "Under 1 hour",
    services: [
      { name: "Diagnostic Scan", price: 75 },
      { name: "Oil Change", price: 65 },
      { name: "Brake Pad Replacement", price: 150 },
      { name: "Engine Tune-Up", price: 120 },
      { name: "Battery Replacement", price: 90 }
    ],
    reviews: [
      { author: "Michael T.", rating: 5, text: "Alex was prompt, professional and very knowledgeable. Fixed my BMW's electrical issue quickly. Highly recommend!" },
      { author: "Sarah L.", rating: 4, text: "Great service. Came out same day and fixed my AC issue. Fair pricing and no unnecessary upsells." },
      { author: "David K.", rating: 5, text: "The convenience of having my car fixed in my own driveway was amazing. Alex is extremely skilled and efficient." }
    ]
  },
  '2': {
    id: '2',
    name: 'Sarah Martinez',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
    specialties: ['Electrical Systems', 'AC Repair', 'Computer Diagnostics'],
    rating: 4.7,
    reviewCount: 94,
    location: 'Chicago, IL',
    hourlyRate: 75,
    yearsExperience: 6,
    about: "ASE certified with specialization in electrical systems and diagnostics. I bring dealership-level diagnostic equipment to your location. With expertise in both domestic and foreign vehicles, I can handle most electrical and computer-related issues on site.",
    responseTime: "2-3 hours",
    services: [
      { name: "Electrical Diagnostic", price: 80 },
      { name: "AC System Repair", price: 120 },
      { name: "Computer Reset/Programming", price: 95 },
      { name: "Alternator Replacement", price: 180 },
      { name: "Starter Replacement", price: 160 }
    ],
    reviews: [
      { author: "Jennifer M.", rating: 5, text: "Sarah diagnosed and fixed an electrical issue that two shops couldn't figure out. Saved me hundreds!" },
      { author: "Robert P.", rating: 4, text: "Very knowledgeable about AC systems. Fixed my car's AC just in time for summer." },
      { author: "Thomas G.", rating: 5, text: "Professional, punctual, and extremely skilled. Will definitely use her services again." }
    ]
  }
};

const MechanicProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(false);
  
  // Simulate checking if user is logged in as a customer
  useEffect(() => {
    // In a real app, this would check localStorage, cookies, or a state management store
    // For demo purposes, we'll assume the user is not logged in initially
    const checkUserAuth = () => {
      // Check if user is logged in and is a customer (not a mechanic)
      const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
      const userRole = localStorage.getItem('userRole');
      
      setIsCustomerLoggedIn(userLoggedIn && userRole === 'customer');
    };
    
    checkUserAuth();
  }, []);
  
  // For demo purposes - in a real app, this would come from auth
  const currentUserId = 'customer-123';
  const currentUserName = 'Current Customer';
  
  // Default to first mechanic if ID not found (for demo purposes)
  const mechanic = id && mechanicsDetailedData[id as keyof typeof mechanicsDetailedData] 
    ? mechanicsDetailedData[id as keyof typeof mechanicsDetailedData]
    : mechanicsDetailedData['1'];

  const handleBookService = () => {
    if (!isCustomerLoggedIn) {
      // Redirect to login if not logged in
      toast({
        title: "Authentication Required",
        description: "Please sign in as a customer to book services.",
        variant: "destructive",
      });
      
      navigate('/signin', { 
        state: { 
          redirectTo: `/mechanics/${id}`,
          action: 'book'
        } 
      });
      return;
    }
    
    // In a real app, this would create a booking in the database
    // For now, just show a toast message
    toast({
      title: "Booking Request Sent",
      description: `Your booking request has been sent to ${mechanic.name}.`,
      variant: "default",
    });
  };

  const handleContact = () => {
    if (!isCustomerLoggedIn) {
      // Redirect to login if not logged in
      toast({
        title: "Authentication Required",
        description: "Please sign in as a customer to contact mechanics.",
        variant: "destructive",
      });
      
      navigate('/signin', { 
        state: { 
          redirectTo: `/mechanics/${id}`,
          action: 'contact'
        } 
      });
      return;
    }
    
    // Open chat if logged in
    openChat();
  };
  
  const openChat = () => {
    // Find or create a chat thread between customer and mechanic
    const threadId = findOrCreateChatThread(
      currentUserId,
      currentUserName,
      `mechanic-${mechanic.id}`,
      mechanic.name
    ).id;
    
    // Get messages for this thread
    const messages = getChatMessages(threadId);
    setChatMessages(messages);
    setIsChatOpen(true);
  };
  
  const handleSendMessage = (content: string) => {
    // Find or create thread
    const thread = findOrCreateChatThread(
      currentUserId,
      currentUserName,
      `mechanic-${mechanic.id}`,
      mechanic.name
    );
    
    // Send message
    const newMessage = sendChatMessage(thread.id, {
      senderId: currentUserId,
      senderName: currentUserName,
      receiverId: `mechanic-${mechanic.id}`,
      content,
      timestamp: new Date().toISOString(),
      isRead: false
    });
    
    // Update local state
    setChatMessages(prev => [...prev, newMessage]);
    
    // Show toast for demo purposes
    toast({
      title: "Message Sent",
      description: `Your message has been sent to ${mechanic.name}.`,
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile */}
          <div className="col-span-2">
            <MechanicProfileHeader mechanic={mechanic} />
            <MechanicAbout about={mechanic.about} />
            <MechanicServices services={mechanic.services} />
            <MechanicReviews 
              reviews={mechanic.reviews} 
              rating={mechanic.rating} 
              reviewCount={mechanic.reviewCount} 
            />
          </div>
          
          {/* Right Column - Booking */}
          <div className="col-span-1">
            <BookingCard 
              mechanicId={mechanic.id}
              mechanicName={mechanic.name}
              hourlyRate={mechanic.hourlyRate}
              responseTime={mechanic.responseTime}
              isCustomerLoggedIn={isCustomerLoggedIn}
              redirectTo={`/mechanics/${id}`}
              redirectAction={null}
              onBookService={handleBookService}
              onContact={handleContact}
            />
          </div>
        </div>
      </div>
      
      {/* Chat component - only shown if customer is logged in */}
      {isCustomerLoggedIn && (
        <ChatBox 
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          recipientId={`mechanic-${mechanic.id}`}
          recipientName={mechanic.name}
          currentUserId={currentUserId}
          currentUserName={currentUserName}
          messages={chatMessages}
          onSendMessage={handleSendMessage}
        />
      )}
    </Layout>
  );
};

export default MechanicProfile;
