
import React from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/Button';
import { useNavigate } from 'react-router-dom';

export const MechanicProfileNotFound = () => {
  const navigate = useNavigate();
  
  return (
    <Layout>
      <div className="container py-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Mechanic Not Found</h2>
          <p className="mb-6">Sorry, we couldn't find the mechanic you're looking for.</p>
          <Button onClick={() => navigate('/mechanics')}>
            Browse All Mechanics
          </Button>
        </div>
      </div>
    </Layout>
  );
};
