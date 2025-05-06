
import React from 'react';
import { MechanicDetail, Service } from '@/types/mechanic';
import { MechanicProfileHeader } from './MechanicProfileHeader';
import { MechanicAbout } from './MechanicAbout';
import { MechanicServices } from './MechanicServices';
import { MechanicReviews } from './MechanicReviews';
import { MechanicGallery } from './MechanicGallery';
import { FavoriteButton } from './FavoriteButton';

interface MechanicProfileLeftColumnProps {
  mechanic: MechanicDetail | null;
  isCustomerLoggedIn: boolean;
  onSelectService: (service: Service | null) => void;
  onReportMechanic: () => void;
  onReviewAdded?: () => void;
}

export const MechanicProfileLeftColumn = ({ 
  mechanic, 
  isCustomerLoggedIn,
  onSelectService,
  onReportMechanic,
  onReviewAdded
}: MechanicProfileLeftColumnProps) => {
  if (!mechanic) return null;
  
  return (
    <div className="col-span-2 space-y-6">
      <div className="flex justify-between items-start">
        <MechanicProfileHeader 
          mechanic={mechanic} 
          isCustomerLoggedIn={isCustomerLoggedIn}
        />
        
        <div className="flex space-x-2">
          <FavoriteButton 
            mechanicId={mechanic.id}
            mechanicName={mechanic.name}
            isCustomerLoggedIn={isCustomerLoggedIn}
            mechanicData={{
              id: mechanic.id,
              name: mechanic.name,
              avatar: mechanic.avatar,
              location: mechanic.location,
              rating: mechanic.rating,
              hourlyRate: mechanic.hourlyRate
            }}
          />
        </div>
      </div>
      
      <MechanicAbout 
        about={mechanic.about} 
        specialties={mechanic.specialties}
        delay={0.1}
      />
      
      <MechanicServices 
        services={mechanic.services} 
        onSelectService={onSelectService}
        delay={0.2}
      />
      
      <MechanicReviews 
        reviews={mechanic.reviews} 
        rating={mechanic.rating}
        reviewCount={mechanic.reviewCount}
        delay={0.3}
        mechanicId={mechanic.id}
        mechanicName={mechanic.name}
        isCustomerLoggedIn={isCustomerLoggedIn}
        onReviewAdded={onReviewAdded}
      />
      
      {mechanic.galleryImages && mechanic.galleryImages.length > 0 && (
        <MechanicGallery 
          images={mechanic.galleryImages} 
          delay={0.4} 
        />
      )}
    </div>
  );
};
