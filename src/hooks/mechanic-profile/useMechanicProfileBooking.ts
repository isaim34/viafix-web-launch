
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Service } from '@/types/mechanic';

export const useMechanicProfileBooking = (mechanicId: string, isCustomerLoggedIn: boolean) => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isBookServiceOpen, setIsBookServiceOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSelectService = (service: Service | null) => {
    setSelectedService(service);
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
          redirectTo: `/mechanics/${mechanicId}`,
          action: 'book'
        } 
      });
      return;
    }
    
    setIsBookServiceOpen(true);
  };

  return {
    selectedService,
    isBookServiceOpen,
    setIsBookServiceOpen,
    handleSelectService,
    handleBookService
  };
};
