
import { useMechanicData } from '@/hooks/useMechanicData';
import { useMechanicProfileChat } from './mechanic-profile/useMechanicProfileChat';
import { useMechanicProfileBooking } from './mechanic-profile/useMechanicProfileBooking';
import { useMechanicProfileReporting } from './mechanic-profile/useMechanicProfileReporting';
import { useMechanicProfileCustomOffer } from './mechanic-profile/useMechanicProfileCustomOffer';

export const useMechanicProfilePage = () => {
  // Get mechanic data
  const { mechanic, loading, id, refreshData } = useMechanicData();
  
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
  
  return {
    // Mechanic data
    mechanic,
    loading,
    id,
    isCustomerLoggedIn: chatHook.isCustomerLoggedIn,
    user: chatHook.user,
    refreshMechanicData: refreshData,
    
    // Booking functionality
    ...bookingHook,
    
    // Chat functionality
    ...chatHook,
    
    // Reporting functionality
    ...reportingHook,
    
    // Custom offer functionality
    ...customOfferHook
  };
};
