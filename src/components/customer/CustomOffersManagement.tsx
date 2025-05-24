

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { CalendarDays, Clock, DollarSign, MessageCircle, Wrench, FileText } from 'lucide-react';
import { useMechanicChat } from '@/hooks/useMechanicChat';

interface CustomOffer {
  id: string;
  mechanic_id: string;
  description: string;
  budget: string;
  timeframe: string;
  preferred_date: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
}

const CustomOffersManagement = () => {
  const [offers, setOffers] = useState<CustomOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const getCurrentUserId = () => {
    const supabaseUserId = user?.id;
    const localStorageUserId = localStorage.getItem('userId');
    return localStorageUserId || supabaseUserId || null;
  };

  const customerId = getCurrentUserId();

  useEffect(() => {
    if (customerId) {
      fetchOffers();
    }
  }, [customerId]);

  const fetchOffers = async () => {
    if (!customerId) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('custom_offers')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type cast the data to ensure status field matches our interface
      const typedOffers: CustomOffer[] = (data || []).map(offer => ({
        ...offer,
        status: offer.status as 'pending' | 'accepted' | 'declined'
      }));
      
      setOffers(typedOffers);
    } catch (error) {
      console.error('Error fetching custom offers:', error);
      toast({
        title: "Error",
        description: "Failed to load your custom requests. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'declined':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Waiting for mechanic response';
      case 'accepted':
        return 'Accepted by mechanic';
      case 'declined':
        return 'Declined by mechanic';
      default:
        return '';
    }
  };

  // Create a chat component for each offer
  const OfferChatButton = ({ mechanicId, offer }: { mechanicId: string; offer: CustomOffer }) => {
    const {
      openChat,
      handleSendMessage,
    } = useMechanicChat(mechanicId, 'Mechanic');

    const handleMessageMechanic = () => {
      openChat();
      // Send a well-formatted contextual message about the custom offer
      setTimeout(() => {
        const message = `Hi! I wanted to follow up on my custom service request.

📋 **Service Details:**
• Description: ${offer.description}
${offer.budget ? `• Budget: ${offer.budget}` : ''}
${offer.timeframe ? `• Timeframe: ${offer.timeframe}` : ''}
${offer.preferred_date ? `• Preferred Date: ${offer.preferred_date}` : ''}

Please let me know if you have any questions or need additional information.`;
        
        handleSendMessage(message);
      }, 500);
    };

    return (
      <Button 
        variant="outline"
        className="flex items-center gap-2"
        onClick={handleMessageMechanic}
      >
        <MessageCircle className="h-4 w-4" />
        Message Mechanic
      </Button>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">My Custom Requests</h2>
        <p className="text-muted-foreground">
          Track your custom service requests to mechanics
        </p>
      </div>
      
      {offers.length === 0 ? (
        <Card>
          <CardContent className="text-center py-20">
            <FileText className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <p className="text-muted-foreground">No custom requests yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Visit a mechanic's profile to request custom services
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {offers.map(offer => (
            <Card key={offer.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Wrench className="h-5 w-5" />
                      Custom Service Request
                    </CardTitle>
                    <CardDescription>
                      Submitted {formatDate(offer.created_at)}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className={getStatusColor(offer.status)}>
                      {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1">
                      {getStatusMessage(offer.status)}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground mt-1" />
                    <div>
                      <p className="font-medium text-sm">Service Description</p>
                      <p className="text-sm text-muted-foreground">{offer.description}</p>
                    </div>
                  </div>
                  
                  {offer.budget && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="font-medium text-sm">Budget: </span>
                        <span className="text-sm">{offer.budget}</span>
                      </div>
                    </div>
                  )}
                  
                  {offer.timeframe && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="font-medium text-sm">Timeframe: </span>
                        <span className="text-sm">{offer.timeframe}</span>
                      </div>
                    </div>
                  )}
                  
                  {offer.preferred_date && (
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="font-medium text-sm">Preferred Date: </span>
                        <span className="text-sm">{offer.preferred_date}</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 pt-2">
                  <OfferChatButton mechanicId={offer.mechanic_id} offer={offer} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomOffersManagement;

