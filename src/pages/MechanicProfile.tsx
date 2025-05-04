
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { ChatBox } from '@/components/chat/ChatBox';
import { Service } from '@/types/mechanic';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';
import { useMechanicChat } from '@/hooks/useMechanicChat';
import { useMechanicProfileActions } from '@/components/mechanic/MechanicProfileActions';
import ReportMechanicDialog from '@/components/mechanic/ReportMechanicDialog';
import { useMechanicData } from '@/hooks/useMechanicData';
import { MechanicProfileLeftColumn } from '@/components/mechanic/MechanicProfileLeftColumn';
import { MechanicProfileRightColumn } from '@/components/mechanic/MechanicProfileRightColumn';
import { useCustomOffer } from '@/components/mechanic/MechanicCustomOffer';
import { CustomOfferDialog } from '@/components/mechanic/CustomOfferDialog';

const MechanicProfile = () => {
  const { isCustomerLoggedIn, currentUserId, currentUserName } = useCustomerAuth();
  const { mechanic, id } = useMechanicData();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  
  const { 
    isChatOpen, 
    chatMessages, 
    openChat, 
    closeChat, 
    handleSendMessage 
  } = useMechanicChat(
    mechanic.id, 
    mechanic.name, 
    currentUserId, 
    currentUserName
  );

  const { 
    handleBookService, 
    handleContact, 
    handleReportMechanic,
    isReportDialogOpen,
    setIsReportDialogOpen
  } = useMechanicProfileActions({
    mechanicId: mechanic.id,
    mechanicName: mechanic.name,
    isCustomerLoggedIn,
    onContact: openChat
  });

  const {
    isCustomOfferOpen,
    setIsCustomOfferOpen,
    handleCustomOffer,
    handleSubmitCustomOffer
  } = useCustomOffer({
    isCustomerLoggedIn,
    mechanic,
    selectedService,
    openChat,
    handleSendMessage
  });

  const handleSelectService = (service: Service | null) => {
    setSelectedService(service);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Profile */}
          <MechanicProfileLeftColumn
            mechanic={mechanic}
            isCustomerLoggedIn={isCustomerLoggedIn}
            onSelectService={handleSelectService}
            onReportMechanic={handleReportMechanic}
          />
          
          {/* Right Column - Booking */}
          <MechanicProfileRightColumn
            mechanic={mechanic}
            isCustomerLoggedIn={isCustomerLoggedIn}
            id={id}
            onBookService={handleBookService}
            onContact={handleContact}
            onCustomOffer={handleCustomOffer}
          />
        </div>
      </div>
      
      {/* Chat component - only shown if customer is logged in */}
      {isCustomerLoggedIn && (
        <ChatBox 
          isOpen={isChatOpen}
          onClose={closeChat}
          recipientId={`mechanic-${mechanic.id}`}
          recipientName={mechanic.name}
          currentUserId={currentUserId}
          currentUserName={currentUserName}
          messages={chatMessages}
          onSendMessage={handleSendMessage}
        />
      )}
      
      {/* Report Dialog */}
      <ReportMechanicDialog
        mechanicId={mechanic.id}
        mechanicName={mechanic.name}
        isOpen={isReportDialogOpen}
        onOpenChange={setIsReportDialogOpen}
      />
      
      {/* Custom Offer Dialog */}
      <CustomOfferDialog
        open={isCustomOfferOpen}
        onOpenChange={setIsCustomOfferOpen}
        mechanicName={mechanic.name}
        selectedService={selectedService}
        onSubmit={handleSubmitCustomOffer}
      />
    </Layout>
  );
};

export default MechanicProfile;
