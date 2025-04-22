
import React, { useEffect, useState } from 'react';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';
import { toast } from '@/components/ui/use-toast';
import { MechanicCardWrapper } from './MechanicCardWrapper';
import { useDisplayedMechanics } from './useDisplayedMechanics';

interface Mechanic {
  id: string;
  name: string;
  avatar: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  location: string;
  hourlyRate: number;
  galleryImages?: string[];
  zipCode?: string;
}

interface MechanicsListProps {
  mechanics: Mechanic[];
  zipCode: string;
  locationName?: string;
  isLoading?: boolean;
  setZipCode: (zipCode: string) => void;
}

const MechanicsList = ({ mechanics, zipCode, locationName, setZipCode }: MechanicsListProps) => {
  const locationDisplay = locationName || zipCode;
  const { currentUserId, currentUserRole, currentUserName } = useCustomerAuth();
  const [localProfile, setLocalProfile] = useState<any>(null);

  // Log info for debugging, plus save customer name for vendor display
  useEffect(() => {
    console.log('MechanicsList - Current user info:', {
      role: currentUserRole,
      name: currentUserName,
      id: currentUserId
    });
    console.log('MechanicsList - Mechanics provided:', mechanics.length, mechanics.map(m => m.id));
    console.log('MechanicsList - Current zip code:', zipCode);

    const storedProfile = localStorage.getItem('mechanicProfile');
    if (storedProfile) {
      try {
        const profile = JSON.parse(storedProfile);
        setLocalProfile(profile);
      } catch (error) {
        console.error('Error parsing mechanic profile:', error);
      }
    }

    if (currentUserRole === 'customer' && currentUserName) {
      localStorage.setItem('lastCustomerName', currentUserName);
    }
  }, [currentUserRole, mechanics, zipCode, currentUserName, currentUserId]);

  // Auto-populate zip for mechanics
  useEffect(() => {
    const shouldAutoPopulate = () => {
      if (zipCode) return false;
      if (sessionStorage.getItem('zipCodeManuallyCleared') === 'true') return false;
      return true;
    };
    if (shouldAutoPopulate() && currentUserRole === 'mechanic') {
      const storedProfileData = localStorage.getItem('mechanicProfile');
      if (storedProfileData) {
        try {
          const parsedData = JSON.parse(storedProfileData);
          if (parsedData.zipCode) setZipCode(parsedData.zipCode);
        } catch (error) {
          console.error('Error parsing profile data from localStorage:', error);
        }
      }
    }
  }, [zipCode, setZipCode, currentUserRole]);

  // Suggest clearing zipcode for customers if no results
  useEffect(() => {
    if (currentUserRole === 'customer' && mechanics.length === 0 && zipCode) {
      if (!sessionStorage.getItem('zipCodeSuggestionShown')) {
        toast({
          title: "No mechanics found in this area",
          description: "Try clearing the zip code to see all available mechanics.",
          duration: 5000
        });
        sessionStorage.setItem('zipCodeSuggestionShown', 'true');
      }
    }
  }, [mechanics.length, zipCode, currentUserRole]);

  // Use refactored hook for display list
  const displayMechanics = useDisplayedMechanics(mechanics, zipCode, currentUserRole);
  const isLoggedInMechanic = currentUserRole === 'mechanic';

  return (
    <div className="w-full">
      <p className="text-gray-500 mb-6">
        {zipCode ?
          `Showing ${displayMechanics.length} mechanics near ${locationDisplay}` :
          `Showing ${displayMechanics.length} mechanics`
        }
      </p>

      {displayMechanics.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayMechanics.map((mechanic, index) => (
            <MechanicCardWrapper
              mechanic={mechanic}
              index={index}
              key={mechanic.id}
              isLoggedInMechanic={isLoggedInMechanic}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No mechanics found</h3>
          <p className="text-gray-500 mb-6">
            {zipCode
              ? `No mechanics found in the ${locationDisplay} area. Please try a different zip code or clear the zip code to see all mechanics.`
              : 'Try adjusting your search criteria.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default MechanicsList;
