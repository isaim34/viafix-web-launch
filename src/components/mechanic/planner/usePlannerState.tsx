import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { PlannerEntry, WeeklyPlan } from '@/types/mechanic';

// Sample data - in a real app, this would come from an API or database
const sampleWeeklyPlan: WeeklyPlan = {
  week: format(new Date(), "'Week of' MMM d, yyyy"),
  entries: [
    {
      id: '1',
      date: format(new Date(), 'yyyy-MM-dd'),
      customerName: 'John Smith',
      serviceType: 'Oil Change',
      estimatedTime: '1 hour',
      notes: 'Customer requested synthetic oil'
    },
    {
      id: '2',
      date: format(new Date(Date.now() + 86400000), 'yyyy-MM-dd'),
      customerName: 'Sarah Johnson',
      serviceType: 'Brake Replacement',
      estimatedTime: '3 hours',
      notes: 'Front and rear brake pads'
    },
    {
      id: '3',
      date: format(new Date(Date.now() + 86400000 * 2), 'yyyy-MM-dd'),
      customerName: 'Mike Wilson',
      serviceType: 'Tire Rotation',
      estimatedTime: '45 minutes',
      notes: 'Check tire pressure and tread depth'
    }
  ]
};

export type FilterOptions = {
  startDate: string | undefined;
  endDate: string | undefined;
  serviceType: string | undefined;
};

export function usePlannerState() {
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan>(sampleWeeklyPlan);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<PlannerEntry | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const [newEntry, setNewEntry] = useState<Omit<PlannerEntry, 'id'>>({
    date: format(new Date(), 'yyyy-MM-dd'),
    customerName: '',
    serviceType: '',
    estimatedTime: '',
    notes: ''
  });
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editedNote, setEditedNote] = useState<string>('');
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    startDate: undefined,
    endDate: undefined,
    serviceType: undefined,
  });
  const { toast } = useToast();

  // Get unique service types for the filter dropdown
  const uniqueServiceTypes = Array.from(new Set(weeklyPlan.entries.map(entry => entry.serviceType)));

  // Apply filters to entries
  const filteredEntries = weeklyPlan.entries.filter(entry => {
    // Filter by service type (skip if "all" is selected or no filter)
    if (filterOptions.serviceType && filterOptions.serviceType !== 'all' && entry.serviceType !== filterOptions.serviceType) {
      return false;
    }

    // Filter by date range
    if (filterOptions.startDate && entry.date < filterOptions.startDate) {
      return false;
    }
    if (filterOptions.endDate && entry.date > filterOptions.endDate) {
      return false;
    }

    return true;
  });

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
    setNewEntry({
      date: format(new Date(), 'yyyy-MM-dd'),
      customerName: '',
      serviceType: '',
      estimatedTime: '',
      notes: ''
    });
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

  const formatDisplayDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'EEE, MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
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
    date,
    setDate,
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
