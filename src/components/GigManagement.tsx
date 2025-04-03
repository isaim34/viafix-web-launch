
import React from 'react';
import GigForm from './GigForm';
import { useGigManagement } from '@/hooks/useGigManagement';
import GigManagementHeader from '@/components/gig/GigManagementHeader';
import GigList from '@/components/gig/GigList';
import EmptyGigState from '@/components/gig/EmptyGigState';

const GigManagement = () => {
  const {
    gigs,
    isCreating,
    editingGig,
    setIsCreating,
    setEditingGig,
    handleCreateGig,
    handleEditGig,
    handleDeleteGig
  } = useGigManagement();

  return (
    <div>
      <GigManagementHeader onAddClick={() => setIsCreating(true)} />

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
        <EmptyGigState onCreateClick={() => setIsCreating(true)} />
      ) : (
        <GigList 
          gigs={gigs} 
          onEdit={setEditingGig} 
          onDelete={handleDeleteGig} 
        />
      )}
    </div>
  );
};

export default GigManagement;
