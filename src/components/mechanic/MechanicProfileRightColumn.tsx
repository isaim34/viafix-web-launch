
import React from 'react';
import { MechanicDetail, Service } from '@/types/mechanic';
import { BookingCard } from './BookingCard';

interface MechanicProfileRightColumnProps {
  mechanic: MechanicDetail;
  isCustomerLoggedIn: boolean;
  selectedService: Service | null;
  onBookService?: () => void;
  onContact?: () => void;
  onCustomOffer?: () => void;
  id?: string;
}

export const MechanicProfileRightColumn = ({
  mechanic,
  isCustomerLoggedIn,
  selectedService,
  id,
  onBookService = () => {},
  onContact = () => {},
  onCustomOffer = () => {}
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
