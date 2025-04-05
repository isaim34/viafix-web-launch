
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
  const visibleStateRef = useRef(visibleState);
  
  // Sync the ref with the state to avoid stale closures in animation frames
  useEffect(() => {
    visibleStateRef.current = visibleState;
  }, [visibleState]);
  
  // Control visible state to prevent flickering
  useEffect(() => {
    if (isLoading) {
      // Immediately show loading when loading starts
      setVisibleState('loading');
    } else if (visibleState === 'loading') {
      // Only transition to results if currently showing loading
      // Use a timeout to ensure loading animation completes
      const timer = setTimeout(() => {
        setVisibleState('results');
      }, 500);
      
      return () => clearTimeout(timer);
    } else if (visibleState === 'none') {
      // Initial state - directly show results if we have data and aren't loading
      setVisibleState('results');
    }
  }, [isLoading, visibleState]);
  
  // Handle loading animation with guaranteed completion
  useEffect(() => {
    const cleanupAnimation = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
    
    // Reset and start animation when loading begins
    if (isLoading && visibleState === 'loading') {
      // Clean up any existing animation
      cleanupAnimation();
      
      // Reset progress
      setLoadingProgress(0);
      animationStartTimeRef.current = performance.now();
      
      // Define animation that ensures completion
      const animate = (timestamp: number) => {
        if (visibleStateRef.current !== 'loading') {
          // If we're no longer in loading state, finish the animation
          setLoadingProgress(100);
          return;
        }
        
        const elapsed = timestamp - animationStartTimeRef.current;
        
        // If loading for more than 10 seconds, force to complete
        if (elapsed > 10000) {
          setLoadingProgress(100);
          return;
        }
        
        // Logarithmic progress that starts fast and slows down approaching 95%
        // This ensures visible progress that doesn't stall visually
        const progress = Math.min(95, 100 * (1 - Math.exp(-elapsed / 3000)));
        
        setLoadingProgress(progress);
        
        // Continue animation
        animationRef.current = requestAnimationFrame(animate);
      };
      
      // Start animation
      animationRef.current = requestAnimationFrame(animate);
    } else if (!isLoading && visibleState === 'results') {
      // When transitioning to results, ensure progress completes
      setLoadingProgress(100);
      cleanupAnimation();
    }
    
    // Cleanup on unmount
    return cleanupAnimation;
  }, [isLoading, visibleState]);
  
  const renderLoading = () => (
    <div className="flex flex-col items-center w-full space-y-6">
      <div className="w-full mb-2">
        <Progress 
          value={loadingProgress} 
          className="h-2"
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
  
  const renderResults = () => (
    <div className="w-full transition-opacity duration-300">
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
    </div>
  );
  
  // Render the appropriate content based on visibleState
  if (visibleState === 'loading') {
    return renderLoading();
  }
  
  if (visibleState === 'results') {
    return renderResults();
  }
  
  // Initial state or fallback (shouldn't normally be visible)
  return null;
};

export default MechanicsList;
