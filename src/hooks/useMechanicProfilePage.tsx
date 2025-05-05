
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMechanicData } from '@/hooks/useMechanicData';
import { useAuth } from '@/hooks/useAuth';
import { useMechanicChat } from '@/hooks/useMechanicChat';
import { useToast } from '@/hooks/use-toast';
import { useCustomOffer } from '@/components/mechanic/MechanicCustomOffer';
import { Service } from '@/types/mechanic';

export const useMechanicProfilePage = () => {
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

  return {
    mechanic,
    loading,
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
    openChat,
    closeChat,
    handleSendMessage,
    threadId,
    isCustomOfferOpen,
    setIsCustomOfferOpen,
    handleCustomOffer,
    handleSubmitCustomOffer,
    handleSelectService,
    handleReportMechanic,
    handleBookService,
    handleContact,
    user
  };
};
