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
  const [visibleState, setVisibleState] = useState<'loading' | 'results' | 'none'>('none');
  const animationRef = useRef<number | null>(null);
  const animationStartTimeRef = useRef<number>(0);
  
  // Control visible state to prevent flickering
  useEffect(() => {
    if (isLoading) {
      setVisibleState('loading');
    } else {
      // When loading completes, keep loading visible briefly before showing results
      const timer = setTimeout(() => {
        setVisibleState('results');
      }, 600); // Ensure loading animation has time to finish
      
      return () => clearTimeout(timer);
    }
  }, [isLoading]);
  
  // Handle loading animation with guaranteed completion
  useEffect(() => {
    // Reset state when loading starts
    if (isLoading) {
      setLoadingProgress(0);
      animationStartTimeRef.current = performance.now();
      
      // Define the animation function - ensure it always reaches 100%
      const animate = (timestamp: number) => {
        const elapsed = timestamp - animationStartTimeRef.current;
        
        // If loading for more than 10 seconds, force to complete
        if (elapsed > 10000) {
          setLoadingProgress(100);
          return;
        }
        
        // Use easing function to start fast and slow down approaching 95%
        // This ensures visible progress that doesn't stall visually
        const progress = Math.min(95, 100 * (1 - Math.exp(-elapsed / 2000)));
        
        setLoadingProgress(progress);
        
        // Continue animation while loading
        if (visibleState === 'loading') {
          animationRef.current = requestAnimationFrame(animate);
        }
      };
      
      // Start the animation
      animationRef.current = requestAnimationFrame(animate);
    } else {
      // When loading ends, immediately set to 100%
      setLoadingProgress(100);
    }
    
    // Cleanup animation on unmount
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isLoading, visibleState]);
  
  // Render loading skeletons
  if (visibleState === 'loading') {
    return (
      <div className="flex flex-col items-center w-full">
        <div className="w-full mb-6">
          <Progress 
            value={loadingProgress} 
            className="h-2 transition-opacity duration-300"
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
  
  // Render results (only when visibleState is 'results')
  if (visibleState === 'results') {
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
        
        {mechanics.length === 0 && (
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
  }
  
  // Initial state (no content)
  return null;
};

export default MechanicsList;
