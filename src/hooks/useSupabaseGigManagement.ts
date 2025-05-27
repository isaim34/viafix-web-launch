
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface SupabaseGig {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  image_url?: string;
  status: string;
  created_at: string;
}

export interface GigFormValues {
  name: string;
  description: string;
  price: number;
  duration: string;
  image?: File | string;
}

export function useSupabaseGigManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [gigs, setGigs] = useState<SupabaseGig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingGig, setEditingGig] = useState<SupabaseGig | null>(null);

  const mechanicId = user?.id;

  useEffect(() => {
    if (mechanicId) {
      fetchGigs();
    }
  }, [mechanicId]);

  const fetchGigs = async () => {
    if (!mechanicId) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('mechanic_services')
        .select('*')
        .eq('mechanic_id', mechanicId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setGigs(data || []);
    } catch (error) {
      console.error('Error fetching gigs:', error);
      toast({
        title: "Error loading services",
        description: "Failed to load your services",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    if (!mechanicId) throw new Error('No mechanic ID');

    const fileExt = file.name.split('.').pop();
    const fileName = `${mechanicId}/${Date.now()}.${fileExt}`;

    // For now, we'll use a placeholder URL since storage isn't set up yet
    // In a real implementation, you'd upload to Supabase Storage
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  };

  const handleCreateGig = async (gigData: GigFormValues) => {
    if (!mechanicId) return;

    try {
      let imageUrl = null;
      
      if (gigData.image instanceof File) {
        imageUrl = await uploadImage(gigData.image);
      }

      const { error } = await supabase
        .from('mechanic_services')
        .insert({
          mechanic_id: mechanicId,
          name: gigData.name,
          description: gigData.description,
          price: gigData.price,
          duration: gigData.duration,
          image_url: imageUrl,
          status: 'active'
        });

      if (error) throw error;

      await fetchGigs();
      setIsCreating(false);
      toast({
        title: "Service created",
        description: "Your service has been created successfully"
      });
    } catch (error) {
      console.error('Error creating gig:', error);
      toast({
        title: "Error creating service",
        description: "Failed to create service",
        variant: "destructive"
      });
    }
  };

  const handleEditGig = async (gigData: GigFormValues & { id: string }) => {
    try {
      let imageUrl = gigData.image;
      
      if (gigData.image instanceof File) {
        imageUrl = await uploadImage(gigData.image);
      }

      const { error } = await supabase
        .from('mechanic_services')
        .update({
          name: gigData.name,
          description: gigData.description,
          price: gigData.price,
          duration: gigData.duration,
          image_url: imageUrl as string
        })
        .eq('id', gigData.id);

      if (error) throw error;

      await fetchGigs();
      setEditingGig(null);
      toast({
        title: "Service updated",
        description: "Your service has been updated successfully"
      });
    } catch (error) {
      console.error('Error updating gig:', error);
      toast({
        title: "Error updating service",
        description: "Failed to update service",
        variant: "destructive"
      });
    }
  };

  const handleDeleteGig = async (id: string) => {
    try {
      const { error } = await supabase
        .from('mechanic_services')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchGigs();
      toast({
        title: "Service deleted",
        description: "Your service has been deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting gig:', error);
      toast({
        title: "Error deleting service",
        description: "Failed to delete service",
        variant: "destructive"
      });
    }
  };

  return {
    gigs,
    isLoading,
    isCreating,
    setIsCreating,
    editingGig,
    setEditingGig,
    handleCreateGig,
    handleEditGig,
    handleDeleteGig,
    refreshGigs: fetchGigs
  };
}
