
import React from 'react';
import { MechanicDetail } from '@/types/mechanic';
import { BookingCard } from './BookingCard';

interface MechanicProfileRightColumnProps {
  mechanic: MechanicDetail;
  isCustomerLoggedIn: boolean;
  id: string | undefined;
  onBookService: () => void;
  onContact: () => void;
  onCustomOffer: () => void;
}

export const MechanicProfileRightColumn = ({
  mechanic,
  isCustomerLoggedIn,
  id,
  onBookService,
  onContact,
  onCustomOffer
}: MechanicProfileRightColumnProps) => {
  return (
    <div className="col-span-1">
      <div className="sticky top-20">
        <BookingCard 
          mechanicId={mechanic.id}
          mechanicName={mechanic.name}
          hourlyRate={mechanic.hourlyRate}
          responseTime={mechanic.responseTime}
          isCustomerLoggedIn={isCustomerLoggedIn}
          redirectTo={`/mechanics/${id}`}
          redirectAction={null}
          onBookService={onBookService}
          onContact={onContact}
          onCustomOffer={onCustomOffer}
        />
      </div>
    </div>
  );
};
