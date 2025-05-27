
import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { isMechanicFavorite, toggleMechanicFavorite } from '@/utils/favoriteUtils';

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
  
  useEffect(() => {
    // Check if this mechanic is already a favorite
    if (isCustomerLoggedIn) {
      setIsFavorite(isMechanicFavorite(mechanicId));
    }
  }, [mechanicId, isCustomerLoggedIn]);
  
  const handleToggleFavorite = () => {
    if (!isCustomerLoggedIn) {
      // Notify user they need to sign in
      toast({
        title: "Authentication Required",
        description: "Please sign in as a customer to save favorite mechanics.",
        variant: "destructive",
      });
      return;
    }
    
    // Toggle favorite status
    const newFavoriteStatus = toggleMechanicFavorite(mechanicData);
    
    setIsFavorite(newFavoriteStatus);
    
    // Show toast notification
    toast({
      title: newFavoriteStatus ? "Added to Favorites" : "Removed from Favorites",
      description: newFavoriteStatus 
        ? `${mechanicName} has been added to your favorites.` 
        : `${mechanicName} has been removed from your favorites.`,
    });
  };

  return (
    <button 
      onClick={handleToggleFavorite}
      className={`p-2 rounded-full transition-all ${
        isFavorite 
          ? 'bg-red-50 text-red-500 hover:bg-red-100' 
          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
      }`}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500' : ''}`} />
    </button>
  );
};
