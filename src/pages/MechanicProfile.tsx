
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { useMechanicData } from '@/hooks/useMechanicData';
import { MechanicProfileLeftColumn } from '@/components/mechanic/MechanicProfileLeftColumn';
import { MechanicProfileRightColumn } from '@/components/mechanic/MechanicProfileRightColumn';
import { useAuth } from '@/hooks/useAuth';
import { Service } from '@/types/mechanic';
import { Loader2 } from 'lucide-react';
import ReportMechanicDialog from '@/components/mechanic/ReportMechanicDialog';
import { useMechanicChat } from '@/hooks/useMechanicChat';
import { ChatBox } from '@/components/chat/ChatBox';
import { BookServiceDialog } from '@/components/mechanic/BookServiceDialog';
import { useCustomOffer } from '@/components/mechanic/MechanicCustomOffer';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const MechanicProfile = () => {
  const { mechanic, loading, id } = useMechanicData();
  const { user, currentUserRole, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Add console log to debug auth state
  console.log("MechanicProfile auth state:", { user, currentUserRole, isLoggedIn });
  
  // Fix: Use a more comprehensive authentication check that considers both Supabase auth and localStorage
  const isCustomerLoggedIn = isLoggedIn && currentUserRole === 'customer';
  console.log("isCustomerLoggedIn:", isCustomerLoggedIn);
  
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isReporting, setIsReporting] = useState(false);
  const [isBookServiceOpen, setIsBookServiceOpen] = useState(false);

  // Always initialize chat hooks with default values to ensure hooks are called in consistent order
  const mechanicId = mechanic?.id || 'default';
  const mechanicName = mechanic?.name || 'Mechanic';
  
  // Initialize the chat hook with default values that will be updated when mechanic loads
  const {
    isChatOpen,
    chatMessages,
    isLoading: isChatLoading,
    openChat,
    closeChat,
    handleSendMessage,
    threadId
  } = useMechanicChat(mechanicId, mechanicName);

  // Initialize the custom offer hook
  const {
    isCustomOfferOpen,
    setIsCustomOfferOpen,
    handleCustomOffer,
    handleSubmitCustomOffer
  } = useCustomOffer({
    mechanic: mechanic || {
      id: 'default',
      name: 'Mechanic',
      avatar: '',
      specialties: [],
      rating: 0,
      reviewCount: 0,
      location: '',
      hourlyRate: 0,
      yearsExperience: 0,
      about: '',
      responseTime: '',
      services: [],
      reviews: [],
      galleryImages: []
    },
    selectedService,
    openChat,
    handleSendMessage
  });

  // If loading, show a loading indicator
  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }
  
  // Check if mechanic data is available
  if (!mechanic) {
    return (
      <Layout>
        <div className="container py-10">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Mechanic Not Found</h2>
            <p className="mb-6">Sorry, we couldn't find the mechanic you're looking for.</p>
            <button 
              onClick={() => navigate('/mechanics')}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
            >
              Browse All Mechanics
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const handleSelectService = (service: Service | null) => {
    setSelectedService(service);
  };

  const handleReportMechanic = () => {
    setIsReporting(true);
  };

  const handleBookService = () => {
    if (!isCustomerLoggedIn) {
      toast({
        title: "Authentication Required",
        description: "Please sign in as a customer to book services.",
        variant: "destructive",
      });
      
      navigate('/signin', { 
        state: { 
          redirectTo: `/mechanics/${mechanic.id}`,
          action: 'book'
        } 
      });
      return;
    }
    
    setIsBookServiceOpen(true);
  };

  const handleContact = () => {
    if (!isCustomerLoggedIn) {
      toast({
        title: "Authentication Required",
        description: "Please sign in as a customer to contact mechanics.",
        variant: "destructive",
      });
      
      navigate('/signin', { 
        state: { 
          redirectTo: `/mechanics/${mechanic.id}`,
          action: 'contact'
        } 
      });
      return;
    }
    
    openChat();
  };

  return (
    <Layout>
      <div className="container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <MechanicProfileLeftColumn
            mechanic={mechanic}
            isCustomerLoggedIn={isCustomerLoggedIn}
            onSelectService={handleSelectService}
            onReportMechanic={handleReportMechanic}
          />
          
          <MechanicProfileRightColumn 
            mechanic={mechanic}
            isCustomerLoggedIn={isCustomerLoggedIn}
            selectedService={selectedService}
            id={id}
            onBookService={handleBookService}
            onContact={handleContact}
            onCustomOffer={handleCustomOffer}
          />
        </div>
        
        {/* Dialogs and Modals */}
        <ReportMechanicDialog
          open={isReporting}
          onOpenChange={setIsReporting}
          mechanicName={mechanic.name}
          mechanicId={mechanic.id}
        />

        <BookServiceDialog
          open={isBookServiceOpen}
          onOpenChange={setIsBookServiceOpen}
          mechanic={mechanic}
          selectedService={selectedService}
        />

        <ChatBox
          isOpen={isChatOpen}
          onClose={closeChat}
          recipientId={mechanic.id}
          recipientName={mechanic.name}
          currentUserId={user?.id || 'anonymous'}
          currentUserName={user?.user_metadata?.full_name || user?.email || 'Customer'}
          messages={chatMessages}
          onSendMessage={handleSendMessage}
          isLoading={isChatLoading}
          threadId={threadId || undefined}
        />
      </div>
    </Layout>
  );
};

export default MechanicProfile;
