
import React from 'react';
import { Layout } from '@/components/Layout';
import { FavoritesList } from '@/components/favorites/FavoritesList';
import { Helmet } from 'react-helmet-async';

const Favorites = () => {
  return (
    <Layout>
      <Helmet>
        <title>My Favorite Mechanics | ViaFix</title>
        <meta name="description" content="View and manage your favorite mechanics in ViaFix" />
      </Helmet>
      
      <div className="container py-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">My Favorite Mechanics</h1>
          <p className="text-gray-600 mt-2">
            View and manage the mechanics you've saved to your favorites.
          </p>
        </div>
        
        <FavoritesList />
      </div>
    </Layout>
  );
};

export default Favorites;
