
import React from 'react';
import { MechanicDetail, Service, ChatMessage } from '@/types/mechanic';
import ReportMechanicDialog from '@/components/mechanic/ReportMechanicDialog';
import { BookServiceDialog } from '@/components/mechanic/BookServiceDialog';
import { ChatBox } from '@/components/chat/ChatBox';
import { CustomOfferDialog } from '@/components/mechanic/CustomOfferDialog';

interface MechanicProfileDialogsProps {
  mechanic: MechanicDetail;
  isReporting: boolean;
  setIsReporting: (isReporting: boolean) => void;
  isBookServiceOpen: boolean;
  setIsBookServiceOpen: (isOpen: boolean) => void;
  selectedService: Service | null;
  isChatOpen: boolean;
  closeChat: () => void;
  chatMessages: ChatMessage[];
  handleSendMessage: (message: string) => void;
  isChatLoading: boolean;
  threadId: string | null;
  currentUserId: string;
  currentUserName: string;
  isCustomOfferOpen: boolean;
  setIsCustomOfferOpen: (isOpen: boolean) => void;
  handleSubmitCustomOffer: (offerDetails: any) => void;
}

export const MechanicProfileDialogs: React.FC<MechanicProfileDialogsProps> = ({
  mechanic,
  isReporting,
  setIsReporting,
  isBookServiceOpen,
  setIsBookServiceOpen,
  selectedService,
  isChatOpen,
  closeChat,
  chatMessages,
  handleSendMessage,
  isChatLoading,
  threadId,
  currentUserId,
  currentUserName,
  isCustomOfferOpen,
  setIsCustomOfferOpen,
  handleSubmitCustomOffer
}) => {
  return (
    <>
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
        currentUserId={currentUserId}
        currentUserName={currentUserName}
        messages={chatMessages}
        onSendMessage={handleSendMessage}
        isLoading={isChatLoading}
        threadId={threadId || undefined}
      />
      
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
