
import React from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to ViaFix</h1>
        <p className="text-xl text-muted-foreground mb-12">
          Find trusted mechanics or offer your services with ease
        </p>
        
        <div className="flex justify-center space-x-4">
          <Button 
            onClick={() => navigate('/signin')}
            className="px-8 py-3 text-lg"
          >
            Sign In
          </Button>
          <Button 
            onClick={() => navigate('/signup')}
            variant="outline"
            className="px-8 py-3 text-lg"
          >
            Sign Up
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
