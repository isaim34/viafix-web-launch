
import { useState } from 'react';
import { toast } from 'sonner';
import { Gig, GigFormValues } from '@/components/gig/types';

// Sample data for demonstration
const sampleGigs = [
  {
    id: '1',
    title: 'Full Car Inspection',
    description: 'Complete inspection of all major systems including engine, transmission, brakes, and suspension.',
    price: 75,
    duration: '1 hour',
    image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', // Car inspection image
    status: 'active'
  },
  {
    id: '2',
    title: 'Oil Change Service',
    description: 'Complete oil change with filter replacement. Premium synthetic oil included.',
    price: 65,
    duration: '30 min',
    image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', // Oil change image
    status: 'active'
  }
];

export function useGigManagement() {
  // Initialize gigs from localStorage or use sample data if none exists
  const getInitialGigs = (): Gig[] => {
    try {
      const savedGigs = localStorage.getItem('mechanic-gigs');
      return savedGigs ? JSON.parse(savedGigs) : sampleGigs;
    } catch (error) {
      console.error('Error loading gigs from localStorage:', error);
      return sampleGigs;
    }
  };

  const [gigs, setGigs] = useState<Gig[]>(getInitialGigs());
  const [isCreating, setIsCreating] = useState(false);
  const [editingGig, setEditingGig] = useState<Gig | null>(null);

  // Save gigs to localStorage whenever they change
  const saveGigsToLocalStorage = (updatedGigs: Gig[]) => {
    try {
      localStorage.setItem('mechanic-gigs', JSON.stringify(updatedGigs));
    } catch (error) {
      console.error('Error saving gigs to localStorage:', error);
    }
  };

  // Reset editing state when a new gig is selected for editing
  const handleSetEditingGig = (gig: Gig | null) => {
    // Clear creating state when editing
    if (gig !== null) {
      setIsCreating(false);
    }
    // Update the editing gig state
    setEditingGig(gig);
  };

  // Mock function to simulate image upload
  const uploadImage = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        const reader = new FileReader();
        reader.onloadend = () => {
          // This returns a data URL representing the image
          // In a real app, you'd return the URL from your server/storage
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      }, 500);
    });
  };

  const handleCreateGig = async (newGig: GigFormValues & { id?: string; status?: string }) => {
    try {
      // Handle file upload if image is a File object
      let imageUrl = newGig.image;
      
      if (newGig.image instanceof File) {
        imageUrl = await uploadImage(newGig.image);
      }
      
      const gigToAdd = {
        ...newGig,
        // Use placeholder image if no image is provided
        image: imageUrl || 'https://images.unsplash.com/photo-1599256879960-6ead7c9d1ae4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        id: Date.now().toString(),
        status: 'active'
      } as Gig;
      
      const updatedGigs = [...gigs, gigToAdd];
      setGigs(updatedGigs);
      saveGigsToLocalStorage(updatedGigs);
      setIsCreating(false);
      toast.success('Gig created successfully');
    } catch (error) {
      console.error('Error creating gig:', error);
      toast.error('Failed to create gig. Please try again.');
    }
  };

  const handleEditGig = async (updatedGig: GigFormValues & { id?: string; status?: string }) => {
    try {
      if (!updatedGig.id) {
        throw new Error('Gig ID is missing');
      }
      
      // Handle file upload if image is a File object
      let imageUrl = updatedGig.image;
      
      if (updatedGig.image instanceof File) {
        imageUrl = await uploadImage(updatedGig.image);
      }
      
      const finalUpdatedGig = {
        ...updatedGig,
        image: imageUrl || updatedGig.image // Keep existing image if no new one
      } as Gig;
      
      const updatedGigs = gigs.map(gig => 
        gig.id === updatedGig.id ? finalUpdatedGig : gig
      );
      
      setGigs(updatedGigs);
      saveGigsToLocalStorage(updatedGigs);
      setEditingGig(null);
      toast.success('Gig updated successfully');
    } catch (error) {
      console.error('Error updating gig:', error);
      toast.error('Failed to update gig. Please try again.');
    }
  };

  const handleDeleteGig = (id: string) => {
    const updatedGigs = gigs.filter(gig => gig.id !== id);
    setGigs(updatedGigs);
    saveGigsToLocalStorage(updatedGigs);
    toast.success('Gig deleted successfully');
  };

  return {
    gigs,
    isCreating,
    editingGig,
    setIsCreating,
    setEditingGig: handleSetEditingGig,
    handleCreateGig,
    handleEditGig,
    handleDeleteGig
  };
}
