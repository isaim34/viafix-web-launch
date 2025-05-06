
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FavoriteMechanic } from '@/types/mechanic';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Heart, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getFavoriteMechanics, removeMechanicFromFavorites } from '@/utils/favoriteUtils';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export const FavoritesList = () => {
  const [favorites, setFavorites] = useState<FavoriteMechanic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const favoriteMechanics = getFavoriteMechanics();
    setFavorites(favoriteMechanics);
    setIsLoading(false);
  };

  const handleRemoveFavorite = (mechanicId: string, mechanicName: string) => {
    removeMechanicFromFavorites(mechanicId);
    setFavorites(favorites.filter(fav => fav.id !== mechanicId));
    
    toast({
      title: "Removed from Favorites",
      description: `${mechanicName} has been removed from your favorites.`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-pulse">Loading favorites...</div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-20">
        <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-semibold mb-2">No Favorites Yet</h2>
        <p className="text-muted-foreground mb-6">
          You haven't added any mechanics to your favorites list.
        </p>
        <Button asChild>
          <Link to="/mechanics">Find Mechanics</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {favorites.map((mechanic, index) => (
        <motion.div
          key={mechanic.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row">
                <Link to={`/mechanics/${mechanic.id}`} className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                  <img
                    src={mechanic.avatar}
                    alt={mechanic.name}
                    className="w-full sm:w-24 h-24 rounded-lg object-cover"
                  />
                </Link>
                <div className="flex-1">
                  <div className="flex flex-wrap justify-between items-start">
                    <div>
                      <Link 
                        to={`/mechanics/${mechanic.id}`} 
                        className="text-lg font-semibold hover:text-primary transition-colors"
                      >
                        {mechanic.name}
                      </Link>
                      <div className="flex items-center mt-1 mb-2">
                        <Star className="w-4 h-4 mr-1 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm">{mechanic.rating.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mb-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{mechanic.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>Added {formatDistanceToNow(new Date(mechanic.addedAt), { addSuffix: true })}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <div className="text-lg font-semibold">${mechanic.hourlyRate}/hr</div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-500 border-red-200 hover:bg-red-50"
                        onClick={() => handleRemoveFavorite(mechanic.id, mechanic.name)}
                      >
                        <Heart className="w-4 h-4 mr-1 fill-red-500" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
