
import React from 'react';
import { useSupabaseGigManagement } from '@/hooks/useSupabaseGigManagement';
import { TrialAwareGigHeader } from '@/components/mechanic/dashboard/TrialAwareGigHeader';
import GigList from '@/components/gig/GigList';
import EmptyGigState from '@/components/gig/EmptyGigState';
import SupabaseGigForm from '@/components/gig/SupabaseGigForm';
import { Loader2 } from 'lucide-react';

const GigManagement = () => {
  const {
    gigs,
    isLoading,
    isCreating,
    editingGig,
    setIsCreating,
    setEditingGig,
    handleCreateGig,
    handleEditGig,
    handleDeleteGig
  } = useSupabaseGigManagement();

  const handleCancel = () => {
    setIsCreating(false);
    setEditingGig(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading services...</span>
      </div>
    );
  }

  return (
    <div>
      <TrialAwareGigHeader 
        onAddGig={() => setIsCreating(true)} 
        gigCount={gigs.length}
      />

      {(isCreating || editingGig) && (
        <div className="mb-8">
          <SupabaseGigForm 
            gig={editingGig} 
            onSubmit={editingGig ? handleEditGig : handleCreateGig} 
            onCancel={handleCancel} 
          />
        </div>
      )}

      {gigs.length === 0 && !isCreating ? (
        <EmptyGigState onCreateClick={() => setIsCreating(true)} />
      ) : (
        <GigList 
          gigs={gigs.map(gig => ({
            id: gig.id,
            title: gig.name,
            description: gig.description,
            price: gig.price,
            duration: gig.duration,
            image: gig.image_url || 'https://images.unsplash.com/photo-1599256879960-6ead7c9d1ae4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            status: gig.status
          }))}
          onEdit={(gig) => {
            const supabaseGig = gigs.find(g => g.id === gig.id);
            if (supabaseGig) {
              setEditingGig(supabaseGig);
            }
          }} 
          onDelete={(id) => handleDeleteGig(id)} 
        />
      )}
    </div>
  );
};

export default GigManagement;
