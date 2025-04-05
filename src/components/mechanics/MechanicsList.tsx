import React, { useEffect, useState, useRef } from 'react';
import { MechanicCard } from '@/components/MechanicCard';
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
  const [progressComplete, setProgressComplete] = useState(false);
  const animationRef = useRef<number | null>(null);
  
  // Handle loading animation with reliable completion
  useEffect(() => {
    // Cleanup function to prevent memory leaks
    const cleanup = () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
    
    // Reset animation state when loading changes
    if (isLoading) {
      cleanup();
      setProgressComplete(false);
      setLoadingProgress(0);
      
      let startTime = performance.now();
      
      // Define the animation function
      const animate = (time: number) => {
        // Calculate elapsed time
        const elapsed = time - startTime;
        
        // Use a logarithmic curve to approach 90% but never reach it
        // This creates a natural slowing effect as it approaches 90%
        const progress = Math.min(90, 75 * (1 - Math.exp(-elapsed / 2000)));
        
        setLoadingProgress(progress);
        
        // Keep animating until we're not loading anymore
        if (isLoading && progress < 90) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };
      
      // Start the animation
      animationRef.current = requestAnimationFrame(animate);
    } else {
      // When loading completes, go to 100% immediately
      cleanup();
      setLoadingProgress(100);
      
      // Set a flag after a short delay to properly handle transitions
      const completeTimer = setTimeout(() => {
        setProgressComplete(true);
      }, 400);
      
      return () => {
        cleanup();
        clearTimeout(completeTimer);
      };
    }
    
    return cleanup;
  }, [isLoading]);
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center w-full">
        <div className="w-full mb-6">
          <Progress 
            value={loadingProgress} 
            className={`h-2 transition-opacity duration-300 ${progressComplete ? 'opacity-0' : 'opacity-100'}`}
          />
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
