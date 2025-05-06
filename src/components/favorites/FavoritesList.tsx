
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FavoriteMechanic } from '@/types/mechanic';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Heart } from 'lucide-react';
import { getFavoriteMechanics, removeMechanicFromFavorites } from '@/utils/favoriteUtils';
import { useToast } from '@/hooks/use-toast';

export const FavoritesList = () => {
  const [favorites, setFavorites] = useState<FavoriteMechanic[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    try {
      const favoriteMechanics = getFavoriteMechanics();
      setFavorites(favoriteMechanics);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = (mechanicId: string, mechanicName: string) => {
    removeMechanicFromFavorites(mechanicId);
    setFavorites(prevFavorites => prevFavorites.filter(fav => fav.id !== mechanicId));
    
    toast({
      title: "Removed from Favorites",
      description: `${mechanicName} has been removed from your favorites.`,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="mx-auto h-12 w-12 text-gray-300" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">No Favorites Yet</h3>
        <p className="mt-2 text-sm text-gray-500">
          You haven't added any mechanics to your favorites list.
        </p>
        <Button asChild className="mt-4">
          <Link to="/mechanics">Browse Mechanics</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {favorites.map((mechanic) => (
        <Card key={mechanic.id} className="overflow-hidden">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                {mechanic.avatar ? (
                  <img 
                    src={mechanic.avatar} 
                    alt={mechanic.name} 
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    {mechanic.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-medium">{mechanic.name}</h3>
                  <p className="text-sm text-gray-500">{mechanic.location}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveFavorite(mechanic.id, mechanic.name)}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <Heart className="h-5 w-5 fill-current" />
              </Button>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <span className="ml-1 text-sm font-medium">{mechanic.rating.toFixed(1)}</span>
              </div>
              <div className="text-sm font-medium">
                ${mechanic.hourlyRate}/hr
              </div>
            </div>
            
            <div className="mt-4 text-xs text-gray-500">
              Added on {new Date(mechanic.addedAt).toLocaleDateString()}
            </div>
            
            <Button asChild className="w-full mt-4">
              <Link to={`/mechanics/${mechanic.id}`}>
                View Profile
              </Link>
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};
