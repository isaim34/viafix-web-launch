
import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { isMechanicFavorite, toggleMechanicFavorite, migrateFavoritesToSupabase } from '@/utils/favoriteUtils';

interface FavoriteButtonProps {
  mechanicId: string;
  mechanicName: string;
  isCustomerLoggedIn: boolean;
  mechanicData: {
    id: string;
    name: string;
    avatar: string;
    location: string;
    rating: number;
    hourlyRate: number;
  };
}

export const FavoriteButton = ({ 
  mechanicId, 
  mechanicName,
  isCustomerLoggedIn,
  mechanicData
}: FavoriteButtonProps) => {
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (isCustomerLoggedIn) {
        setIsLoading(true);
        try {
          // Run migration first (only happens once if there are localStorage favorites)
          await migrateFavoritesToSupabase();
          
          // Check if this mechanic is a favorite
          const favoriteStatus = await isMechanicFavorite(mechanicId);
          setIsFavorite(favoriteStatus);
        } catch (error) {
          console.error('Error checking favorite status:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    checkFavoriteStatus();
  }, [mechanicId, isCustomerLoggedIn]);
  
  const handleToggleFavorite = async () => {
    if (!isCustomerLoggedIn) {
      toast({
        title: "Authentication Required",
        description: "Please sign in as a customer to save favorite mechanics.",
        variant: "destructive",
      });
      return;
    }
    
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      const newFavoriteStatus = await toggleMechanicFavorite(mechanicData);
      setIsFavorite(newFavoriteStatus);
      
      toast({
        title: newFavoriteStatus ? "Added to Favorites" : "Removed from Favorites",
        description: newFavoriteStatus 
          ? `${mechanicName} has been added to your favorites.` 
          : `${mechanicName} has been removed from your favorites.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`p-2 rounded-full transition-all ${
        isFavorite 
          ? 'bg-red-50 text-red-500 hover:bg-red-100' 
          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500' : ''}`} />
    </button>
  );
};
