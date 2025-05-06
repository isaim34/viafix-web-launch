
import React from 'react';
import { MechanicDetail, Service } from '@/types/mechanic';
import { MechanicProfileHeader } from './MechanicProfileHeader';
import { MechanicAbout } from './MechanicAbout';
import { MechanicGallery } from './MechanicGallery';
import { MechanicServices } from './MechanicServices';
import { MechanicReviews } from './MechanicReviews';
import { MechanicReportCard } from './MechanicReportCard';

interface MechanicProfileLeftColumnProps {
  mechanic: MechanicDetail;
  isCustomerLoggedIn: boolean;
  onSelectService: (service: Service | null) => void;
  onReportMechanic: () => void;
}

export const MechanicProfileLeftColumn = ({
  mechanic,
  isCustomerLoggedIn,
  onSelectService,
  onReportMechanic
}: MechanicProfileLeftColumnProps) => {
  return (
    <div className="col-span-1 lg:col-span-2 space-y-6">
      <MechanicProfileHeader 
        mechanic={mechanic} 
        isCustomerLoggedIn={isCustomerLoggedIn} 
      />
      <MechanicAbout about={mechanic.about} />
      {mechanic.galleryImages && <MechanicGallery images={mechanic.galleryImages} />}
      <MechanicServices 
        services={mechanic.services} 
        onSelectService={onSelectService} 
      />
      <MechanicReviews 
        reviews={mechanic.reviews} 
        rating={mechanic.rating} 
        reviewCount={mechanic.reviewCount} 
      />
      
      {/* Report Mechanic Card */}
      <MechanicReportCard onReportMechanic={onReportMechanic} />
    </div>
  );
};
