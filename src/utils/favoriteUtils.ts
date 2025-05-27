
import { FavoriteMechanic } from '@/types/mechanic';

// Get all favorite mechanics for the current user
export const getFavoriteMechanics = (): FavoriteMechanic[] => {
  const favorites = localStorage.getItem('favoriteMechanics');
  return favorites ? JSON.parse(favorites) : [];
};

// Check if a mechanic is in favorites
export const isMechanicFavorite = (mechanicId: string): boolean => {
  const favorites = getFavoriteMechanics();
  return favorites.some(fav => fav.id === mechanicId);
};

// Add a mechanic to favorites
export const addMechanicToFavorites = (mechanic: {
  id: string;
  name: string;
  avatar: string;
  location: string;
  rating: number;
  hourlyRate: number;
}): void => {
  const favorites = getFavoriteMechanics();
  
  // Check if mechanic is already in favorites
  if (!favorites.some(fav => fav.id === mechanic.id)) {
    const favoriteMechanic: FavoriteMechanic = {
      ...mechanic,
      addedAt: new Date().toISOString()
    };
    
    favorites.push(favoriteMechanic);
    localStorage.setItem('favoriteMechanics', JSON.stringify(favorites));
  }
};

// Remove a mechanic from favorites
export const removeMechanicFromFavorites = (mechanicId: string): void => {
  const favorites = getFavoriteMechanics();
  const updatedFavorites = favorites.filter(fav => fav.id !== mechanicId);
  localStorage.setItem('favoriteMechanics', JSON.stringify(updatedFavorites));
};

// Toggle a mechanic in favorites (add if not present, remove if present)
export const toggleMechanicFavorite = (mechanic: {
  id: string;
  name: string;
  avatar: string;
  location: string;
  rating: number;
  hourlyRate: number;
}): boolean => {
  const isFavorite = isMechanicFavorite(mechanic.id);
  
  if (isFavorite) {
    removeMechanicFromFavorites(mechanic.id);
    return false;
  } else {
    addMechanicToFavorites(mechanic);
    return true;
  }
};
