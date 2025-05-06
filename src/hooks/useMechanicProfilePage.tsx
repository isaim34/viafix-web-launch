
import { useState } from 'react';
import { useMechanicData } from '@/hooks/useMechanicData';
import { useMechanicProfileChat } from './mechanic-profile/useMechanicProfileChat';
import { useMechanicProfileBooking } from './mechanic-profile/useMechanicProfileBooking';
import { useMechanicProfileReporting } from './mechanic-profile/useMechanicProfileReporting';
import { useMechanicProfileCustomOffer } from './mechanic-profile/useMechanicProfileCustomOffer';

export const useMechanicProfilePage = () => {
  // Track if we need to refresh mechanic data (e.g., after a review is added)
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Get mechanic data
  const { mechanic, loading, id, refetchMechanic } = useMechanicData(refreshTrigger);
  
  // Add console log to debug mechanic data
  console.log("MechanicProfile data:", { mechanic, loading, id });
  
  // Get chat functionality
  const chatHook = useMechanicProfileChat(mechanic);
  
  // Get booking functionality
  const bookingHook = useMechanicProfileBooking(
    mechanic?.id || 'default', 
    chatHook.isCustomerLoggedIn
  );
  
  // Get reporting functionality
  const reportingHook = useMechanicProfileReporting(
    mechanic?.id || 'default', 
    chatHook.isCustomerLoggedIn
  );
  
  // Get custom offer functionality
  const customOfferHook = useMechanicProfileCustomOffer(
    mechanic,
    bookingHook.selectedService,
    chatHook.openChat,
    chatHook.handleSendMessage
  );
  
  // Function to handle when a review is added
  const handleReviewAdded = () => {
    setRefreshTrigger(prev => prev + 1);
    refetchMechanic();
  };
  
  return {
    // Mechanic data
    mechanic,
    loading,
    id,
    isCustomerLoggedIn: chatHook.isCustomerLoggedIn,
    user: chatHook.user,
    
    // Booking functionality
    ...bookingHook,
    
    // Chat functionality
    ...chatHook,
    
    // Reporting functionality
    ...reportingHook,
    
    // Custom offer functionality
    ...customOfferHook,
    
    // Review functionality
    handleReviewAdded
  };
};
