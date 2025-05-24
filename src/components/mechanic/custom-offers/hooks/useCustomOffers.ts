
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { CustomOffer } from '../types';

export const useCustomOffers = () => {
  const [offers, setOffers] = useState<CustomOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const getCurrentUserId = () => {
    const supabaseUserId = user?.id;
    const localStorageUserId = localStorage.getItem('userId');
    return localStorageUserId || supabaseUserId || null;
  };

  const mechanicId = getCurrentUserId();

  useEffect(() => {
    if (mechanicId) {
      fetchOffers();
    }
  }, [mechanicId]);

  const fetchOffers = async () => {
    if (!mechanicId) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('custom_offers')
        .select('*')
        .eq('mechanic_id', mechanicId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const typedOffers: CustomOffer[] = (data || []).map(offer => ({
        ...offer,
        status: offer.status as 'pending' | 'accepted' | 'declined' | 'completed'
      }));
      
      setOffers(typedOffers);
    } catch (error) {
      console.error('Error fetching custom offers:', error);
      toast({
        title: "Error",
        description: "Failed to load custom offers. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateOfferStatus = async (offerId: string, status: 'accepted' | 'declined' | 'completed') => {
    try {
      const updateData: any = { status };
      
      if (status === 'completed') {
        updateData.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('custom_offers')
        .update(updateData)
        .eq('id', offerId);

      if (error) throw error;

      setOffers(prev => prev.map(offer => 
        offer.id === offerId ? { ...offer, status } : offer
      ));

      const statusText = status === 'accepted' ? 'Accepted' : status === 'declined' ? 'Declined' : 'Completed';
      toast({
        title: `Offer ${statusText}`,
        description: `You have ${status} the custom service request.`,
      });
    } catch (error) {
      console.error('Error updating offer status:', error);
      toast({
        title: "Error",
        description: "Failed to update offer status. Please try again.",
        variant: "destructive"
      });
    }
  };

  return {
    offers,
    isLoading,
    mechanicId,
    updateOfferStatus,
    fetchOffers
  };
};
