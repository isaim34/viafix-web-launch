
import { useState, useEffect, useCallback } from 'react';
import { PlannerEntry, PlannerFilterOptions } from './types/plannerTypes';
import { filterEntries } from './utils/filterUtils';
import { formatDate } from './utils/dateUtils';
import { sampleData } from './data/sampleData';

export type FilterOptions = {
  startDate: string | undefined;
  endDate: string | undefined;
  serviceType: string | undefined;
};

export const usePlannerState = () => {
  // Initialize with sample data or load from localStorage
  const getInitialData = () => {
    try {
      const savedData = localStorage.getItem('mechanic-planner');
      return savedData ? JSON.parse(savedData) : { 
        week: `Week of ${formatDate(new Date().toISOString())}`,
        entries: sampleData 
      };
    } catch (error) {
      console.error('Error loading planner data:', error);
      return { 
        week: `Week of ${formatDate(new Date().toISOString())}`,
        entries: [] 
      };
    }
  };
  
  const [weeklyPlan, setWeeklyPlan] = useState(getInitialData);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<PlannerEntry | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editedNote, setEditedNote] = useState('');
  
  // Filter state
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    startDate: '',
    endDate: '',
    serviceType: ''
  });

  // Default new entry
  const defaultNewEntry = {
    id: '',
    date: new Date().toISOString().split('T')[0],
    customerName: '',
    serviceType: '',
    estimatedTime: '1h',
    notes: ''
  };
  
  const [newEntry, setNewEntry] = useState<PlannerEntry>(defaultNewEntry);
  
  // Get unique service types for filter dropdown
  const uniqueServiceTypes = Array.from(
    new Set(weeklyPlan.entries?.map(entry => entry.serviceType) || [])
  ).filter(Boolean) as string[];

  // Save data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('mechanic-planner', JSON.stringify(weeklyPlan));
    } catch (error) {
      console.error('Error saving planner data:', error);
    }
  }, [weeklyPlan]);
  
  // Add entry
  const handleAddEntry = useCallback((entry: PlannerEntry) => {
    const entryWithId = {
      ...entry,
      id: Date.now().toString()
    };
    
    setWeeklyPlan(prev => ({
      ...prev,
      entries: [entryWithId, ...(prev.entries || [])]
    }));
    
    setIsAddDialogOpen(false);
    setNewEntry(defaultNewEntry);
  }, [defaultNewEntry]);
  
  // Edit entry
  const handleEditEntry = useCallback((updatedEntry: PlannerEntry) => {
    setWeeklyPlan(prev => ({
      ...prev,
      entries: (prev.entries || []).map(entry => 
        entry.id === updatedEntry.id ? updatedEntry : entry
      )
    }));
    
    setIsEditDialogOpen(false);
    setEditingEntry(null);
  }, []);
  
  // Delete entry
  const handleDeleteEntry = useCallback((id: string) => {
    setWeeklyPlan(prev => ({
      ...prev,
      entries: (prev.entries || []).filter(entry => entry.id !== id)
    }));
    
    if (editingNoteId === id) {
      setEditingNoteId(null);
    }
  }, [editingNoteId]);
  
  // Open edit dialog
  const openEditDialog = useCallback((entry: PlannerEntry) => {
    setEditingEntry(entry);
    setIsEditDialogOpen(true);
  }, []);
  
  // Start editing note
  const startEditingNote = useCallback((entry: PlannerEntry) => {
    setEditingNoteId(entry.id);
    setEditedNote(entry.notes || '');
  }, []);
  
  // Save edited note
  const saveEditedNote = useCallback((id: string) => {
    setWeeklyPlan(prev => ({
      ...prev,
      entries: (prev.entries || []).map(entry => 
        entry.id === id ? { ...entry, notes: editedNote } : entry
      )
    }));
    
    setEditingNoteId(null);
  }, [editedNote]);
  
  // Cancel editing note
  const cancelEditingNote = useCallback(() => {
    setEditingNoteId(null);
    setEditedNote('');
  }, []);
  
  // Handle filter change
  const handleFilterChange = useCallback((key: keyof FilterOptions, value: string) => {
    setFilterOptions(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  }, []);
  
  // Clear filters
  const clearFilters = useCallback(() => {
    setFilterOptions({
      startDate: '',
      endDate: '',
      serviceType: ''
    });
  }, []);
  
  // Filter entries based on current filter options
  const filteredEntries = filterEntries(weeklyPlan.entries || [], filterOptions);
  
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
    formatDisplayDate: formatDate,
    filterOptions,
    handleFilterChange,
    clearFilters,
    uniqueServiceTypes
  };
};
