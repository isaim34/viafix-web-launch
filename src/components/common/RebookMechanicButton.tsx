
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface RebookMechanicButtonProps {
  mechanicId: string;
  mechanicName: string;
  lastServiceType: string;
  lastServiceDate: string;
  className?: string;
}

export const RebookMechanicButton: React.FC<RebookMechanicButtonProps> = ({
  mechanicId,
  mechanicName,
  lastServiceType,
  lastServiceDate,
  className
}) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleRebook = () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to rebook a service.",
        variant: "destructive"
      });
      return;
    }

    // Navigate to mechanic profile with pre-filled booking data
    const url = `/mechanic/${mechanicId}?rebook=true&service=${encodeURIComponent(lastServiceType)}`;
    window.location.href = url;
    
    toast({
      title: "Redirecting to booking",
      description: `Taking you to ${mechanicName}'s profile to rebook your ${lastServiceType}.`,
    });
  };

  return (
    <Button 
      onClick={handleRebook}
      variant="outline"
      size="sm"
      className={className}
    >
      <RefreshCw className="h-3 w-3 mr-1" />
      Rebook {mechanicName}
    </Button>
  );
};
