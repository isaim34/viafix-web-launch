
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/Layout';
import { FavoritesList } from '@/components/mechanic/FavoritesList';

const Favorites = () => {
  return (
    <Layout>
      <Helmet>
        <title>My Favorite Mechanics | ViaFix</title>
        <meta 
          name="description" 
          content="Manage your favorite mechanics on ViaFix - easily find and connect with your preferred automotive professionals." 
        />
      </Helmet>
      
      <div className="container py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Favorite Mechanics</h1>
          <p className="text-muted-foreground">
            Manage and quickly access your favorite mechanics from one place.
          </p>
        </div>

        <FavoritesList />
      </div>
    </Layout>
  );
};

export default Favorites;
