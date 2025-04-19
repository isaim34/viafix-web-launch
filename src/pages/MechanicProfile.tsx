
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { useParams, useNavigate } from 'react-router-dom';
import { ChatBox } from '@/components/chat/ChatBox';
import { MechanicProfileHeader } from '@/components/mechanic/MechanicProfileHeader';
import { MechanicAbout } from '@/components/mechanic/MechanicAbout';
import { MechanicServices } from '@/components/mechanic/MechanicServices';
import { MechanicReviews } from '@/components/mechanic/MechanicReviews';
import { MechanicGallery } from '@/components/mechanic/MechanicGallery';
import { BookingCard } from '@/components/mechanic/BookingCard';
import { mechanicsDetailedData } from '@/data/mechanicsData';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';
import { useMechanicChat } from '@/hooks/useMechanicChat';
import { useMechanicProfileActions } from '@/components/mechanic/MechanicProfileActions';
import ReportMechanicDialog from '@/components/mechanic/ReportMechanicDialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/Button';
import { Flag } from 'lucide-react';
import { CustomOfferDialog, CustomOfferDetails } from '@/components/mechanic/CustomOfferDialog';
import { Service } from '@/types/mechanic';
import { useToast } from '@/hooks/use-toast';

const MechanicProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { isCustomerLoggedIn, currentUserId, currentUserName } = useCustomerAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Check if user is logged in as a mechanic
  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    const isLoggedInMechanic = userRole === 'mechanic';
    
    // If the user is a mechanic and trying to view a mechanic profile,
    // redirect them to their dashboard if it's their own profile (local-mechanic)
    if (isLoggedInMechanic && id === 'local-mechanic') {
      navigate('/mechanic-dashboard');
      return;
    }
  }, [id, navigate]);
  
  // Default to first mechanic if ID not found (for demo purposes)
  const mechanic = id && mechanicsDetailedData[id] 
    ? mechanicsDetailedData[id]
    : mechanicsDetailedData['1'];

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isCustomOfferOpen, setIsCustomOfferOpen] = useState(false);

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

  const handleSelectService = (service: Service | null) => {
    setSelectedService(service);
  };

  const handleCustomOffer = () => {
    if (!isCustomerLoggedIn) {
      toast({
        title: "Sign in required",
        description: "Please sign in to request a custom offer",
        variant: "destructive"
      });
      return;
    }
    setIsCustomOfferOpen(true);
  };

  const handleSubmitCustomOffer = (offerDetails: CustomOfferDetails) => {
    // In a real app, this would send the offer to the backend
    toast({
      title: "Custom offer sent!",
      description: `Your request has been sent to ${mechanic.name} and is pending approval.`,
    });
    
    // Open the chat with a prefilled message
    openChat();
    const serviceInfo = selectedService ? `for ${selectedService.name}` : '';
    const message = `Hi ${mechanic.name}, I've sent you a custom service request ${serviceInfo} with the following details:\n\n🔹 Description: ${offerDetails.description}\n🔹 Budget: $${offerDetails.budget}\n🔹 Timeframe: ${offerDetails.timeframe}\n🔹 Preferred date: ${offerDetails.preferredDate}\n\nPlease let me know if you can provide this service.`;
    
    setTimeout(() => {
      handleSendMessage(message);
    }, 500);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Profile */}
          <div className="col-span-1 lg:col-span-2 space-y-6">
            <MechanicProfileHeader 
              mechanic={mechanic} 
              isCustomerLoggedIn={isCustomerLoggedIn} 
            />
            <MechanicAbout about={mechanic.about} />
            {mechanic.galleryImages && <MechanicGallery images={mechanic.galleryImages} />}
            <MechanicServices 
              services={mechanic.services} 
              onSelectService={handleSelectService} 
            />
            <MechanicReviews 
              reviews={mechanic.reviews} 
              rating={mechanic.rating} 
              reviewCount={mechanic.reviewCount} 
            />
            
            {/* Report Mechanic Card */}
            <Card className="border-muted">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-medium">Have an issue with this mechanic?</h3>
                    <p className="text-sm text-muted-foreground">
                      If you've experienced unprofessional behavior or poor service, let us know.
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="text-destructive border-destructive hover:bg-destructive/10 w-full sm:w-auto"
                    icon={<Flag className="w-4 h-4" />}
                    onClick={handleReportMechanic}
                  >
                    Report Mechanic
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Column - Booking */}
          <div className="col-span-1">
            <div className="sticky top-20">
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
                onCustomOffer={handleCustomOffer}
              />
            </div>
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
