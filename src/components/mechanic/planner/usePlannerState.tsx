
import { useState } from 'react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { PlannerEntry, WeeklyPlan } from '@/types/mechanic';
import { FilterOptions } from './types/plannerTypes';
import { sampleWeeklyPlan, getEmptyEntry } from './data/sampleData';
import { filterEntries, getUniqueServiceTypes } from './utils/filterUtils';
import { formatDisplayDate } from './utils/dateUtils';

export { formatDisplayDate } from './utils/dateUtils';
export type { FilterOptions } from './types/plannerTypes';

export function usePlannerState() {
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan>(sampleWeeklyPlan);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<PlannerEntry | null>(null);
  const [newEntry, setNewEntry] = useState<Omit<PlannerEntry, 'id'>>(getEmptyEntry());
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editedNote, setEditedNote] = useState<string>('');
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    startDate: undefined,
    endDate: undefined,
    serviceType: undefined,
  });
  const { toast } = useToast();

  // Get unique service types for the filter dropdown
  const uniqueServiceTypes = getUniqueServiceTypes(weeklyPlan.entries);

  // Apply filters to entries
  const filteredEntries = filterEntries(weeklyPlan.entries, filterOptions);

  const handleAddEntry = () => {
    if (!newEntry.customerName || !newEntry.serviceType) {
      toast({
        title: "Missing information",
        description: "Please fill in at least customer name and service type",
        variant: "destructive"
      });
      return;
    }

    const entry: PlannerEntry = {
      id: Date.now().toString(),
      ...newEntry
    };

    setWeeklyPlan({
      ...weeklyPlan,
      entries: [...weeklyPlan.entries, entry]
    });

    // Reset form and close dialog
    setNewEntry(getEmptyEntry());
    setIsAddDialogOpen(false);

    toast({
      title: "Entry added",
      description: "The job has been added to your weekly planner"
    });
  };

  const handleEditEntry = () => {
    if (!editingEntry || !editingEntry.customerName || !editingEntry.serviceType) {
      toast({
        title: "Missing information",
        description: "Please fill in at least customer name and service type",
        variant: "destructive"
      });
      return;
    }

    setWeeklyPlan({
      ...weeklyPlan,
      entries: weeklyPlan.entries.map(entry => 
        entry.id === editingEntry.id ? editingEntry : entry
      )
    });

    setIsEditDialogOpen(false);
    setEditingEntry(null);

    toast({
      title: "Entry updated",
      description: "The job has been updated in your weekly planner"
    });
  };

  const handleDeleteEntry = (id: string) => {
    setWeeklyPlan({
      ...weeklyPlan,
      entries: weeklyPlan.entries.filter(entry => entry.id !== id)
    });

    toast({
      title: "Entry deleted",
      description: "The job has been removed from your weekly planner"
    });
  };

  const openEditDialog = (entry: PlannerEntry) => {
    setEditingEntry(entry);
    setIsEditDialogOpen(true);
  };

  // Start inline note editing
  const startEditingNote = (entry: PlannerEntry) => {
    setEditingNoteId(entry.id);
    setEditedNote(entry.notes);
  };

  // Save edited note
  const saveEditedNote = (id: string) => {
    setWeeklyPlan({
      ...weeklyPlan,
      entries: weeklyPlan.entries.map(entry => 
        entry.id === id ? {...entry, notes: editedNote} : entry
      )
    });
    
    setEditingNoteId(null);
    setEditedNote('');
    
    toast({
      title: "Note updated",
      description: "The job notes have been updated"
    });
  };

  // Cancel note editing
  const cancelEditingNote = () => {
    setEditingNoteId(null);
    setEditedNote('');
  };

  // Handle filter changes
  const handleFilterChange = (newOptions: Partial<FilterOptions>) => {
    setFilterOptions(prev => ({
      ...prev,
      ...newOptions
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilterOptions({
      startDate: undefined,
      endDate: undefined,
      serviceType: undefined,
    });
  };

  return {
    weeklyPlan,
    filteredEntries,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    editingEntry,
    setEditingEntry,
    newEntry,
    setNewEntry,
    editingNoteId,
    editedNote,
    setEditedNote,
    handleAddEntry,
    handleEditEntry,
    handleDeleteEntry,
    openEditDialog,
    startEditingNote,
    saveEditedNote,
    cancelEditingNote,
    formatDisplayDate,
    filterOptions,
    handleFilterChange,
    clearFilters,
    uniqueServiceTypes
  };
}
