import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import ReportMechanicDialog from './ReportMechanicDialog';

interface MechanicProfileActionsProps {
  mechanicId: string;
  mechanicName: string; 
  isCustomerLoggedIn: boolean;
  onContact: () => void;
}

export const MechanicProfileActions: React.FC<MechanicProfileActionsProps> = ({
  mechanicId,
  mechanicName,
  isCustomerLoggedIn,
  onContact
}) => {
  const { 
    handleBookService, 
    handleContact, 
    handleReportMechanic,
    isReportDialogOpen,
    setIsReportDialogOpen
  } = useMechanicProfileActions({
    mechanicId,
    mechanicName,
    isCustomerLoggedIn,
    onContact
  });

  return (
    <>
      <div className="mechanic-actions">
        {/* Action buttons would go here */}
      </div>
      <ReportMechanicDialog
        mechanicId={mechanicId}
        mechanicName={mechanicName}
        isOpen={isReportDialogOpen}
        onOpenChange={setIsReportDialogOpen}
      />
    </>
  );
};

export const useMechanicProfileActions = ({
  mechanicId,
  mechanicName,
  isCustomerLoggedIn,
  onContact
}: MechanicProfileActionsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

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
    
    toast({
      title: "Booking Request Sent",
      description: `Your booking request has been sent to ${mechanicName}.`,
      variant: "default",
    });
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
          redirectTo: `/mechanics/${mechanicId}`,
          action: 'contact'
        } 
      });
      return;
    }
    
    onContact();
  };

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
    
    setIsReportDialogOpen(true);
  };

  return {
    handleBookService,
    handleContact,
    handleReportMechanic,
    isReportDialogOpen,
    setIsReportDialogOpen,
  };
};
