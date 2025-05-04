
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
  const { user, currentUserRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isCustomerLoggedIn = !!user && currentUserRole === 'customer';
  
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isReporting, setIsReporting] = useState(false);
  const [isBookServiceOpen, setIsBookServiceOpen] = useState(false);

  // Initialize the chat hook
  const {
    isChatOpen,
    chatMessages,
    isLoading: isChatLoading,
    openChat,
    closeChat,
    handleSendMessage,
    threadId
  } = useMechanicChat(mechanic.id, mechanic.name);

  // Initialize the custom offer hook
  const {
    isCustomOfferOpen,
    setIsCustomOfferOpen,
    handleCustomOffer,
    handleSubmitCustomOffer
  } = useCustomOffer({
    mechanic,
    selectedService,
    openChat,
    handleSendMessage
  });

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

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

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
