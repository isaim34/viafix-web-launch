
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, Clock, DollarSign, MessageCircle, User, CheckCircle, XCircle, FileText, Check } from 'lucide-react';
import { CustomOffer } from './types';

interface OfferCardProps {
  offer: CustomOffer;
  onUpdateStatus: (offerId: string, status: 'accepted' | 'declined') => void;
  onCompleteOffer: (offer: CustomOffer) => void;
}

export const OfferCard = ({ offer, onUpdateStatus, onCompleteOffer }: OfferCardProps) => {
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
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Request
            </CardTitle>
            <CardDescription>
              Submitted {formatDate(offer.created_at)}
            </CardDescription>
          </div>
          <Badge variant="outline" className={getStatusColor(offer.status)}>
            {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
          </Badge>
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
        
        {offer.status === 'pending' && (
          <div className="flex gap-2 pt-2">
            <Button 
              onClick={() => onUpdateStatus(offer.id, 'accepted')}
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Accept
            </Button>
            <Button 
              variant="outline"
              onClick={() => onUpdateStatus(offer.id, 'declined')}
              className="flex items-center gap-2"
            >
              <XCircle className="h-4 w-4" />
              Decline
            </Button>
            <Button 
              variant="ghost"
              className="flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Message Customer
            </Button>
          </div>
        )}

        {offer.status === 'accepted' && (
          <div className="flex gap-2 pt-2">
            <Button 
              onClick={() => onCompleteOffer(offer)}
              className="flex items-center gap-2"
            >
              <Check className="h-4 w-4" />
              Complete Service
            </Button>
            <Button 
              variant="ghost"
              className="flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Message Customer
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
