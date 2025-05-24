
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { CustomOffer } from './types';
import { OfferCard } from './OfferCard';

interface CustomOfferFiltersProps {
  offers: CustomOffer[];
  onUpdateStatus: (offerId: string, status: 'accepted' | 'declined') => void;
  onCompleteOffer: (offer: CustomOffer) => void;
}

export const CustomOfferFilters = ({ offers, onUpdateStatus, onCompleteOffer }: CustomOfferFiltersProps) => {
  const filterOffersByStatus = (status: string) => {
    if (status === 'all') return offers;
    return offers.filter(offer => offer.status === status);
  };

  const EmptyState = () => (
    <Card>
      <CardContent className="text-center py-20">
        <FileText className="mx-auto h-12 w-12 text-gray-300 mb-3" />
        <p className="text-muted-foreground">No custom service requests yet</p>
        <p className="text-sm text-muted-foreground mt-2">
          Custom requests from customers will appear here
        </p>
      </CardContent>
    </Card>
  );

  const OffersList = ({ statusOffers }: { statusOffers: CustomOffer[] }) => (
    <div>
      {statusOffers.map(offer => (
        <OfferCard 
          key={offer.id} 
          offer={offer} 
          onUpdateStatus={onUpdateStatus}
          onCompleteOffer={onCompleteOffer}
        />
      ))}
    </div>
  );

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList>
        <TabsTrigger value="all">
          All ({offers.length})
        </TabsTrigger>
        <TabsTrigger value="pending">
          Pending ({filterOffersByStatus('pending').length})
        </TabsTrigger>
        <TabsTrigger value="accepted">
          Accepted ({filterOffersByStatus('accepted').length})
        </TabsTrigger>
        <TabsTrigger value="completed">
          Completed ({filterOffersByStatus('completed').length})
        </TabsTrigger>
        <TabsTrigger value="declined">
          Declined ({filterOffersByStatus('declined').length})
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="mt-6">
        {offers.length === 0 ? (
          <EmptyState />
        ) : (
          <OffersList statusOffers={offers} />
        )}
      </TabsContent>
      
      <TabsContent value="pending" className="mt-6">
        <OffersList statusOffers={filterOffersByStatus('pending')} />
      </TabsContent>
      
      <TabsContent value="accepted" className="mt-6">
        <OffersList statusOffers={filterOffersByStatus('accepted')} />
      </TabsContent>
      
      <TabsContent value="completed" className="mt-6">
        <OffersList statusOffers={filterOffersByStatus('completed')} />
      </TabsContent>
      
      <TabsContent value="declined" className="mt-6">
        <OffersList statusOffers={filterOffersByStatus('declined')} />
      </TabsContent>
    </Tabs>
  );
};
