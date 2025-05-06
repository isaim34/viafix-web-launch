
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const useMechanicProfileReporting = (mechanicId: string, isCustomerLoggedIn: boolean) => {
  const [isReporting, setIsReporting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleReportMechanic = () => {
    if (!isCustomerLoggedIn) {
      toast({
        title: "Authentication Required",
        description: "Please sign in as a customer to report mechanics.",
        variant: "destructive",
      });
      
      navigate('/signin', { 
        state: { 
          redirectTo: `/mechanics/${mechanicId}`,
          action: 'report'
        } 
      });
      return;
    }
    
    setIsReporting(true);
  };

  return {
    isReporting,
    setIsReporting,
    handleReportMechanic
  };
};
