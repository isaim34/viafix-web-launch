
import { supabase } from '@/integrations/supabase/client';
import { FavoriteMechanic } from '@/types/mechanic';

// Migration function to move localStorage favorites to Supabase
export const migrateFavoritesToSupabase = async (): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Get existing favorites from localStorage
    const localFavorites = localStorage.getItem('favoriteMechanics');
    if (!localFavorites) return;

    const favorites: FavoriteMechanic[] = JSON.parse(localFavorites);
    if (favorites.length === 0) return;

    console.log('Migrating', favorites.length, 'favorites to Supabase...');

    // Insert favorites into Supabase
    const favoritesToInsert = favorites.map(fav => ({
      user_id: user.id,
      mechanic_id: fav.id,
      mechanic_name: fav.name,
      mechanic_avatar: fav.avatar,
      mechanic_location: fav.location,
      mechanic_rating: fav.rating,
      mechanic_hourly_rate: fav.hourlyRate
    }));

    const { error } = await supabase
      .from('user_favorites')
      .insert(favoritesToInsert);

    if (error) {
      console.error('Error migrating favorites:', error);
      return;
    }

    // Clear localStorage after successful migration
    localStorage.removeItem('favoriteMechanics');
    console.log('Successfully migrated favorites to Supabase');
  } catch (error) {
    console.error('Error during migration:', error);
  }
};

// Get all favorite mechanics for the current user from Supabase
export const getFavoriteMechanics = async (): Promise<FavoriteMechanic[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('user_favorites')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching favorites:', error);
      return [];
    }

    return data?.map(fav => ({
      id: fav.mechanic_id,
      name: fav.mechanic_name,
      avatar: fav.mechanic_avatar,
      location: fav.mechanic_location,
      rating: fav.mechanic_rating,
      hourlyRate: fav.mechanic_hourly_rate,
      addedAt: fav.created_at
    })) || [];
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }
};

// Check if a mechanic is in favorites
export const isMechanicFavorite = async (mechanicId: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('mechanic_id', mechanicId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error checking favorite status:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
};

// Add a mechanic to favorites
export const addMechanicToFavorites = async (mechanic: {
  id: string;
  name: string;
  avatar: string;
  location: string;
  rating: number;
  hourlyRate: number;
}): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('user_favorites')
      .insert({
        user_id: user.id,
        mechanic_id: mechanic.id,
        mechanic_name: mechanic.name,
        mechanic_avatar: mechanic.avatar,
        mechanic_location: mechanic.location,
        mechanic_rating: mechanic.rating,
        mechanic_hourly_rate: mechanic.hourlyRate
      });

    if (error) {
      console.error('Error adding favorite:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error adding favorite:', error);
    return false;
  }
};

// Remove a mechanic from favorites
export const removeMechanicFromFavorites = async (mechanicId: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('mechanic_id', mechanicId);

    if (error) {
      console.error('Error removing favorite:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error removing favorite:', error);
    return false;
  }
};

// Toggle a mechanic in favorites (add if not present, remove if present)
export const toggleMechanicFavorite = async (mechanic: {
  id: string;
  name: string;
  avatar: string;
  location: string;
  rating: number;
  hourlyRate: number;
}): Promise<boolean> => {
  try {
    const isFavorite = await isMechanicFavorite(mechanic.id);
    
    if (isFavorite) {
      const success = await removeMechanicFromFavorites(mechanic.id);
      return success ? false : true; // Return new favorite status
    } else {
      const success = await addMechanicToFavorites(mechanic);
      return success ? true : false; // Return new favorite status
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return false;
  }
};
