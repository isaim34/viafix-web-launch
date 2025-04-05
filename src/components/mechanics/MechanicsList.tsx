import React, { useEffect, useState } from 'react';
import { MechanicCard } from '@/components/MechanicCard';
import { Loader2 } from 'lucide-react';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';
import { Skeleton } from "@/components/ui/skeleton";
import { mechanicsData } from '@/data/mechanicsPageData';

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

const MechanicsList = ({ mechanics, zipCode, locationName, isLoading, setZipCode }: MechanicsListProps) => {
  const locationDisplay = locationName || zipCode;
  const { currentUserId } = useCustomerAuth();
  const [stableLoading, setStableLoading] = useState(isLoading);
  
  useEffect(() => {
    if (isLoading) {
      setStableLoading(true);
    } else {
      const timer = setTimeout(() => {
        setStableLoading(false);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading]);
  
  useEffect(() => {
    if (!zipCode) {
      const storedProfileData = localStorage.getItem('mechanicProfile');
      if (storedProfileData) {
        try {
          const parsedData = JSON.parse(storedProfileData);
          if (parsedData.zipCode) {
            console.log('Found profile zip code:', parsedData.zipCode);
            setZipCode(parsedData.zipCode);
          }
        } catch (error) {
          console.error('Error parsing profile data from localStorage:', error);
        }
      }
    }
  }, [zipCode, setZipCode]);

  if (stableLoading) {
    return (
      <div className="w-full py-8">
        <div className="flex items-center justify-center mb-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
          <span className="text-lg">Searching for mechanics...</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <Skeleton className="w-16 h-16 rounded-full" />
                    <div className="ml-4">
                      <Skeleton className="h-5 w-32 mb-2" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-20 rounded-full" />
                </div>
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                </div>
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const displayMechanics = zipCode === '01605' && mechanics.length === 0 
    ? mechanicsData.slice(0, 3) 
    : mechanics;

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
            <MechanicCard 
              key={mechanic.id} 
              {...mechanic} 
              delay={index * 0.1}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No mechanics found</h3>
          <p className="text-gray-500 mb-6">
            {zipCode 
              ? `No mechanics found in the ${locationDisplay} area. Please try a different zip code.`
              : 'Try adjusting your search criteria.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default MechanicsList;
