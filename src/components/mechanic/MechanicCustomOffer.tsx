
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Service, MechanicDetail } from '@/types/mechanic';
import { CustomOfferDialog, CustomOfferDetails } from '@/components/mechanic/CustomOfferDialog';

interface MechanicCustomOfferProps {
  isCustomerLoggedIn: boolean;
  mechanic: MechanicDetail;
  selectedService: Service | null;
  openChat: () => void;
  handleSendMessage: (message: string) => void;
}

export const MechanicCustomOffer = ({
  isCustomerLoggedIn,
  mechanic,
  selectedService,
  openChat,
  handleSendMessage
}: MechanicCustomOfferProps) => {
  const [isCustomOfferOpen, setIsCustomOfferOpen] = useState(false);
  const { toast } = useToast();

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
    <>
      <CustomOfferDialog
        open={isCustomOfferOpen}
        onOpenChange={setIsCustomOfferOpen}
        mechanicName={mechanic.name}
        selectedService={selectedService}
        onSubmit={handleSubmitCustomOffer}
      />
    </>
  );
};

export const useCustomOffer = ({
  isCustomerLoggedIn,
  mechanic,
  selectedService,
  openChat,
  handleSendMessage
}: MechanicCustomOfferProps) => {
  const [isCustomOfferOpen, setIsCustomOfferOpen] = useState(false);
  const { toast } = useToast();

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

  return {
    isCustomOfferOpen,
    setIsCustomOfferOpen,
    handleCustomOffer,
    handleSubmitCustomOffer
  };
};
