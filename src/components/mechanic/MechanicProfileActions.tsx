import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import ReportMechanicDialog from './ReportMechanicDialog';
import { Button } from '@/components/Button';
import { MessageCircle, BookOpen, Flag } from 'lucide-react';

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
      <div className="mechanic-actions flex flex-col gap-3 md:flex-row">
        <Button 
          className="w-full" 
          onClick={handleBookService}
          icon={<BookOpen className="w-4 h-4" />}
        >
          Book Service
        </Button>
        <Button 
          variant="outline" 
          className="w-full" 
          icon={<MessageCircle className="w-4 h-4" />} 
          onClick={handleContact}
        >
          Contact
        </Button>
        <Button 
          variant="outline"
          className="w-full text-destructive border-destructive hover:bg-destructive/10" 
          icon={<Flag className="w-4 h-4" />} 
          onClick={handleReportMechanic}
        >
          Report
        </Button>
      </div>
      <ReportMechanicDialog
        mechanicId={mechanicId}
        mechanicName={mechanicName}
        open={isReportDialogOpen}
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
