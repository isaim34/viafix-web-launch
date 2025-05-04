
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Service, MechanicDetail } from '@/types/mechanic';
import { CustomOfferDialog, CustomOfferDetails } from '@/components/mechanic/CustomOfferDialog';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface MechanicCustomOfferProps {
  mechanic: MechanicDetail;
  selectedService: Service | null;
  openChat: () => void;
  handleSendMessage: (message: string) => void;
}

export const MechanicCustomOffer = ({
  mechanic,
  selectedService,
  openChat,
  handleSendMessage
}: MechanicCustomOfferProps) => {
  const [isCustomOfferOpen, setIsCustomOfferOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isCustomerLoggedIn = !!user;

  const handleCustomOffer = () => {
    if (!isCustomerLoggedIn) {
      toast({
        title: "Sign in required",
        description: "Please sign in to request a custom offer",
        variant: "destructive"
      });
      
      navigate('/signin', { 
        state: { 
          redirectTo: `/mechanics/${mechanic.id}`,
          action: 'custom-offer'
        } 
      });
      return;
    }
    setIsCustomOfferOpen(true);
  };

  const handleSubmitCustomOffer = (offerDetails: CustomOfferDetails) => {
    // Show success toast - actual saving is handled in CustomOfferDialog
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
    <>
      <CustomOfferDialog
        open={isCustomOfferOpen}
        onOpenChange={setIsCustomOfferOpen}
        mechanicId={mechanic.id}
        mechanicName={mechanic.name}
        selectedService={selectedService}
        onSubmit={handleSubmitCustomOffer}
      />
    </>
  );
};

export const useCustomOffer = ({
  mechanic,
  selectedService,
  openChat,
  handleSendMessage
}: MechanicCustomOfferProps) => {
  const [isCustomOfferOpen, setIsCustomOfferOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isCustomerLoggedIn = !!user;

  const handleCustomOffer = () => {
    if (!isCustomerLoggedIn) {
      toast({
        title: "Sign in required",
        description: "Please sign in to request a custom offer",
        variant: "destructive"
      });
      
      navigate('/signin', { 
        state: { 
          redirectTo: `/mechanics/${mechanic.id}`,
          action: 'custom-offer'
        } 
      });
      return;
    }
    setIsCustomOfferOpen(true);
  };

  const handleSubmitCustomOffer = (offerDetails: CustomOfferDetails) => {
    // Show success toast - actual saving is handled in CustomOfferDialog
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

  return {
    isCustomOfferOpen,
    setIsCustomOfferOpen,
    handleCustomOffer,
    handleSubmitCustomOffer
  };
};
