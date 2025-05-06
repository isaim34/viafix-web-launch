
import React from 'react';
import { MechanicProfileLeftColumn } from '@/components/mechanic/MechanicProfileLeftColumn';
import { MechanicProfileRightColumn } from '@/components/mechanic/MechanicProfileRightColumn';
import { MechanicProfileDialogs } from '@/components/mechanic/MechanicProfileDialogs';
import { Layout } from '@/components/Layout';

interface MechanicProfileContentProps {
  profileData: ReturnType<typeof import('@/hooks/useMechanicProfilePage').useMechanicProfilePage>;
}

export const MechanicProfileContent: React.FC<MechanicProfileContentProps> = ({ profileData }) => {
  const {
    mechanic,
    id,
    isCustomerLoggedIn,
    selectedService,
    isReporting,
    setIsReporting,
    isBookServiceOpen,
    setIsBookServiceOpen,
    isChatOpen,
    chatMessages,
    isChatLoading,
    closeChat,
    handleSendMessage,
    threadId,
    isCustomOfferOpen,
    setIsCustomOfferOpen,
    handleSubmitCustomOffer,
    handleSelectService,
    handleReportMechanic,
    handleBookService,
    handleContact,
    handleCustomOffer,
    user,
    refreshMechanicData
  } = profileData;

  const currentUserId = user?.id || 'anonymous';
  const currentUserName = user?.user_metadata?.full_name || user?.email || 'Customer';

  return (
    <Layout>
      <div className="container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <MechanicProfileLeftColumn
            mechanic={mechanic}
            isCustomerLoggedIn={isCustomerLoggedIn}
            onSelectService={handleSelectService}
            onReportMechanic={handleReportMechanic}
            onReviewAdded={refreshMechanicData}
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
        <MechanicProfileDialogs
          mechanic={mechanic}
          isReporting={isReporting}
          setIsReporting={setIsReporting}
          isBookServiceOpen={isBookServiceOpen}
          setIsBookServiceOpen={setIsBookServiceOpen}
          selectedService={selectedService}
          isChatOpen={isChatOpen}
          closeChat={closeChat}
          chatMessages={chatMessages}
          handleSendMessage={handleSendMessage}
          isChatLoading={isChatLoading}
          threadId={threadId}
          currentUserId={currentUserId}
          currentUserName={currentUserName}
          isCustomOfferOpen={isCustomOfferOpen}
          setIsCustomOfferOpen={setIsCustomOfferOpen}
          handleSubmitCustomOffer={handleSubmitCustomOffer}
        />
      </div>
    </Layout>
  );
};
