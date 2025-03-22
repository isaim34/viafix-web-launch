
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import GigCard from './GigCard';
import GigForm from './GigForm';

// Sample data for demonstration
const sampleGigs = [
  {
    id: '1',
    title: 'Full Car Inspection',
    description: 'Complete inspection of all major systems including engine, transmission, brakes, and suspension.',
    price: 75,
    duration: '1 hour',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    status: 'active'
  },
  {
    id: '2',
    title: 'Oil Change Service',
    description: 'Complete oil change with filter replacement. Premium synthetic oil included.',
    price: 65,
    duration: '30 min',
    image: 'https://images.unsplash.com/photo-1599256879960-6ead7c9d1ae4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    status: 'active'
  }
];

const GigManagement = () => {
  const [gigs, setGigs] = useState(sampleGigs);
  const [isCreating, setIsCreating] = useState(false);
  const [editingGig, setEditingGig] = useState<typeof sampleGigs[0] | null>(null);

  const handleCreateGig = (newGig: Omit<typeof sampleGigs[0], 'id' | 'status'>) => {
    const gigToAdd = {
      ...newGig,
      id: Date.now().toString(),
      status: 'active'
    };
    
    setGigs([...gigs, gigToAdd]);
    setIsCreating(false);
  };

  const handleEditGig = (updatedGig: typeof sampleGigs[0]) => {
    setGigs(gigs.map(gig => gig.id === updatedGig.id ? updatedGig : gig));
    setEditingGig(null);
  };

  const handleDeleteGig = (id: string) => {
    setGigs(gigs.filter(gig => gig.id !== id));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold">My Service Gigs</h2>
        <Button 
          onClick={() => setIsCreating(true)} 
          className="flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          Add New Gig
        </Button>
      </div>

      {(isCreating || editingGig) && (
        <div className="mb-8">
          <GigForm 
            gig={editingGig} 
            onSubmit={editingGig ? handleEditGig : handleCreateGig} 
            onCancel={() => {
              setIsCreating(false);
              setEditingGig(null);
            }} 
          />
        </div>
      )}

      {gigs.length === 0 && !isCreating ? (
        <div className="text-center py-20 border border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">You haven't created any service gigs yet</p>
          <Button 
            onClick={() => setIsCreating(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Create Your First Gig
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {gigs.map((gig) => (
            <GigCard 
              key={gig.id} 
              gig={gig}
              onEdit={() => setEditingGig(gig)}
              onDelete={() => handleDeleteGig(gig.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default GigManagement;
