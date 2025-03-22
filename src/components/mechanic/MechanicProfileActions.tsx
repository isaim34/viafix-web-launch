
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface MechanicProfileActionsProps {
  mechanicId: string;
  mechanicName: string; 
  isCustomerLoggedIn: boolean;
  onContact: () => void;
}

export const MechanicProfileActions = ({
  mechanicId,
  mechanicName,
  isCustomerLoggedIn,
  onContact
}: MechanicProfileActionsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleBookService = () => {
    if (!isCustomerLoggedIn) {
      // Redirect to login if not logged in
      toast({
        title: "Authentication Required",
        description: "Please sign in as a customer to book services.",
        variant: "destructive",
      });
      
      navigate('/signin', { 
        state: { 
          redirectTo: `/mechanics/${mechanicId}`,
          action: 'book'
        } 
      });
      return;
    }
    
    // In a real app, this would create a booking in the database
    // For now, just show a toast message
    toast({
      title: "Booking Request Sent",
      description: `Your booking request has been sent to ${mechanicName}.`,
      variant: "default",
    });
  };

  const handleContact = () => {
    if (!isCustomerLoggedIn) {
      // Redirect to login if not logged in
      toast({
        title: "Authentication Required",
        description: "Please sign in as a customer to contact mechanics.",
        variant: "destructive",
      });
      
      navigate('/signin', { 
        state: { 
          redirectTo: `/mechanics/${mechanicId}`,
          action: 'contact'
        } 
      });
      return;
    }
    
    // Open chat if logged in
    onContact();
  };

  return {
    handleBookService,
    handleContact
  };
};
