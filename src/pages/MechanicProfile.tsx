
import React from 'react';
import { Layout } from '@/components/Layout';
import { useParams } from 'react-router-dom';
import { ChatBox } from '@/components/chat/ChatBox';
import { MechanicProfileHeader } from '@/components/mechanic/MechanicProfileHeader';
import { MechanicAbout } from '@/components/mechanic/MechanicAbout';
import { MechanicServices } from '@/components/mechanic/MechanicServices';
import { MechanicReviews } from '@/components/mechanic/MechanicReviews';
import { BookingCard } from '@/components/mechanic/BookingCard';
import { mechanicsDetailedData } from '@/data/mechanicsData';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';
import { useMechanicChat } from '@/hooks/useMechanicChat';
import { MechanicProfileActions } from '@/components/mechanic/MechanicProfileActions';

const MechanicProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { isCustomerLoggedIn, currentUserId, currentUserName } = useCustomerAuth();
  
  // Default to first mechanic if ID not found (for demo purposes)
  const mechanic = id && mechanicsDetailedData[id] 
    ? mechanicsDetailedData[id]
    : mechanicsDetailedData['1'];

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

  const { handleBookService, handleContact } = MechanicProfileActions({
    mechanicId: mechanic.id,
    mechanicName: mechanic.name,
    isCustomerLoggedIn,
    onContact: openChat
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile */}
          <div className="col-span-2">
            <MechanicProfileHeader 
              mechanic={mechanic} 
              isCustomerLoggedIn={isCustomerLoggedIn} 
            />
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
          onClose={closeChat}
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
