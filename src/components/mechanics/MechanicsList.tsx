
import React, { useEffect, useState, useRef } from 'react';
import { MechanicCard } from '@/components/MechanicCard';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';

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
}

const MechanicsList = ({ mechanics, zipCode, locationName, isLoading }: MechanicsListProps) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Stable loading animation without flickering
  useEffect(() => {
    // Clear any existing interval when effect runs
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
    
    if (isLoading) {
      // Reset progress to 0
      setLoadingProgress(0);
      
      // Use a reference to store the interval id
      progressTimerRef.current = setInterval(() => {
        setLoadingProgress(prev => {
          // Slower, more predictable progress
          const newValue = prev + 1;
          return newValue <= 90 ? newValue : 90;
        });
      }, 100);
    } else {
      // Complete the progress bar when loading is done
      setLoadingProgress(100);
    }
    
    // Cleanup function
    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
    };
  }, [isLoading]);
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center w-full">
        <div className="w-full mb-6">
          <Progress value={loadingProgress} className="h-2" />
          <p className="text-center text-gray-500 mt-2">
            Looking for mechanics near {zipCode}...
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex justify-between">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <>
      <p className="text-gray-500 mb-6">
        {zipCode ? 
          `Showing ${mechanics.length} mechanics near ${zipCode}${locationName ? ` (${locationName})` : ''}` : 
          `Showing ${mechanics.length} mechanics`
        }
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mechanics.map((mechanic, index) => (
          <MechanicCard 
            key={mechanic.id} 
            {...mechanic} 
            delay={0.05 * index}
          />
        ))}
      </div>
      
      {mechanics.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No mechanics found</h3>
          <p className="text-gray-500 mb-6">
            {zipCode 
              ? `We couldn't find any mechanics near ${zipCode}. Try a different zip code or expand your search criteria.`
              : 'Try adjusting your search criteria.'}
          </p>
        </div>
      )}
    </>
  );
};

export default MechanicsList;
