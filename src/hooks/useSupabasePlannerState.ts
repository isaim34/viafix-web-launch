
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PlannerEntry {
  id: string;
  date: string;
  customer_name: string;
  service_type: string;
  estimated_time: string;
  notes: string;
}

export interface FilterOptions {
  startDate: string | undefined;
  endDate: string | undefined;
  serviceType: string | undefined;
}

export const useSupabasePlannerState = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [entries, setEntries] = useState<PlannerEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<PlannerEntry | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    startDate: '',
    endDate: '',
    serviceType: ''
  });

  const mechanicId = user?.id;

  const defaultNewEntry: Omit<PlannerEntry, 'id'> = {
    date: new Date().toISOString().split('T')[0],
    customer_name: '',
    service_type: '',
    estimated_time: '1h',
    notes: ''
  };

  const [newEntry, setNewEntry] = useState<Omit<PlannerEntry, 'id'>>(defaultNewEntry);

  useEffect(() => {
    if (mechanicId) {
      fetchEntries();
    }
  }, [mechanicId]);

  const fetchEntries = async () => {
    if (!mechanicId) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('planner_entries')
        .select('*')
        .eq('mechanic_id', mechanicId)
        .order('date', { ascending: true });

      if (error) throw error;

      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching planner entries:', error);
      toast({
        title: "Error loading planner",
        description: "Failed to load your planner entries",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEntry = useCallback(async (entry: Omit<PlannerEntry, 'id'>) => {
    if (!mechanicId) return;

    try {
      const { error } = await supabase
        .from('planner_entries')
        .insert({
          mechanic_id: mechanicId,
          date: entry.date,
          customer_name: entry.customer_name,
          service_type: entry.service_type,
          estimated_time: entry.estimated_time,
          notes: entry.notes
        });

      if (error) throw error;

      await fetchEntries();
      setIsAddDialogOpen(false);
      setNewEntry(defaultNewEntry);
      toast({
        title: "Entry added",
        description: "Planner entry has been added successfully"
      });
    } catch (error) {
      console.error('Error adding planner entry:', error);
      toast({
        title: "Error adding entry",
        description: "Failed to add planner entry",
        variant: "destructive"
      });
    }
  }, [mechanicId, defaultNewEntry, toast]);

  const handleEditEntry = useCallback(async (updatedEntry: PlannerEntry) => {
    try {
      const { error } = await supabase
        .from('planner_entries')
        .update({
          date: updatedEntry.date,
          customer_name: updatedEntry.customer_name,
          service_type: updatedEntry.service_type,
          estimated_time: updatedEntry.estimated_time,
          notes: updatedEntry.notes
        })
        .eq('id', updatedEntry.id);

      if (error) throw error;

      await fetchEntries();
      setIsEditDialogOpen(false);
      setEditingEntry(null);
      toast({
        title: "Entry updated",
        description: "Planner entry has been updated successfully"
      });
    } catch (error) {
      console.error('Error updating planner entry:', error);
      toast({
        title: "Error updating entry",
        description: "Failed to update planner entry",
        variant: "destructive"
      });
    }
  }, [toast]);

  const handleDeleteEntry = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('planner_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchEntries();
      toast({
        title: "Entry deleted",
        description: "Planner entry has been deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting planner entry:', error);
      toast({
        title: "Error deleting entry",
        description: "Failed to delete planner entry",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Filter entries based on current filter options
  const filteredEntries = entries.filter(entry => {
    if (filterOptions.startDate && entry.date < filterOptions.startDate) return false;
    if (filterOptions.endDate && entry.date > filterOptions.endDate) return false;
    if (filterOptions.serviceType && entry.service_type !== filterOptions.serviceType) return false;
    return true;
  });

  // Get unique service types for filter dropdown
  const uniqueServiceTypes = Array.from(
    new Set(entries.map(entry => entry.service_type))
  ).filter(Boolean);

  const handleFilterChange = useCallback((key: keyof FilterOptions, value: string) => {
    setFilterOptions(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilterOptions({
      startDate: '',
      endDate: '',
      serviceType: ''
    });
  }, []);

  return {
    entries: filteredEntries,
    isLoading,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    editingEntry,
    setEditingEntry,
    newEntry,
    setNewEntry,
    handleAddEntry,
    handleEditEntry,
    handleDeleteEntry,
    filterOptions,
    handleFilterChange,
    clearFilters,
    uniqueServiceTypes,
    refreshEntries: fetchEntries
  };
};
