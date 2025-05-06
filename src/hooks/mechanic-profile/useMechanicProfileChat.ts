
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useMechanicChat } from '@/hooks/useMechanicChat';
import { useAuth } from '@/hooks/useAuth';
import { MechanicDetail } from '@/types/mechanic';

export const useMechanicProfileChat = (mechanic: MechanicDetail | null) => {
  const { user, currentUserRole, isLoggedIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Fix: Use a more comprehensive authentication check that considers both Supabase auth and localStorage
  const isCustomerLoggedIn = isLoggedIn && currentUserRole === 'customer';
  
  // Initialize the chat hook with default values that will be updated when mechanic loads
  const mechanicId = mechanic?.id || 'default';
  const mechanicName = mechanic?.name || 'Mechanic';
  
  const {
    isChatOpen,
    chatMessages,
    isLoading: isChatLoading,
    openChat,
    closeChat,
    handleSendMessage,
    threadId
  } = useMechanicChat(mechanicId, mechanicName);

  const handleContact = () => {
    if (!isCustomerLoggedIn) {
      toast({
        title: "Authentication Required",
        description: "Please sign in as a customer to contact mechanics.",
        variant: "destructive",
      });
      
      navigate('/signin', { 
        state: { 
          redirectTo: `/mechanics/${mechanic?.id}`,
          action: 'contact'
        } 
      });
      return;
    }
    
    openChat();
  };

  return {
    isChatOpen,
    chatMessages,
    isChatLoading,
    openChat,
    closeChat,
    handleSendMessage,
    threadId,
    handleContact,
    isCustomerLoggedIn,
    user
  };
};
