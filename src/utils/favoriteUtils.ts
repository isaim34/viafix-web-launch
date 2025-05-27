
import { FavoriteMechanic } from '@/types/mechanic';

// Get all favorite mechanics for the current user
export const getFavoriteMechanics = (): FavoriteMechanic[] => {
  try {
    const favorites = localStorage.getItem('favoriteMechanics');
    const parsed = favorites ? JSON.parse(favorites) : [];
    console.log('Loading favorites from localStorage:', parsed);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error loading favorites from localStorage:', error);
    return [];
  }
};

// Check if a mechanic is in favorites
export const isMechanicFavorite = (mechanicId: string): boolean => {
  const favorites = getFavoriteMechanics();
  const isFavorite = favorites.some(fav => fav.id === mechanicId);
  console.log(`Checking if mechanic ${mechanicId} is favorite:`, isFavorite);
  return isFavorite;
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
    console.log('Added mechanic to favorites:', favoriteMechanic);
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('favoritesUpdated', { detail: favorites }));
  } else {
    console.log('Mechanic already in favorites:', mechanic.id);
  }
};

// Remove a mechanic from favorites
export const removeMechanicFromFavorites = (mechanicId: string): void => {
  const favorites = getFavoriteMechanics();
  const updatedFavorites = favorites.filter(fav => fav.id !== mechanicId);
  localStorage.setItem('favoriteMechanics', JSON.stringify(updatedFavorites));
  console.log('Removed mechanic from favorites:', mechanicId);
  console.log('Updated favorites list:', updatedFavorites);
  
  // Dispatch custom event to notify other components
  window.dispatchEvent(new CustomEvent('favoritesUpdated', { detail: updatedFavorites }));
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
