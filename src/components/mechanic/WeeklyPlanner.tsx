
import React, { useState } from 'react';
import { Calendar, Clock, FilePlus, Pencil, Save, Trash2, X, Edit, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format, startOfWeek, endOfWeek, addDays, parseISO } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { PlannerEntry, WeeklyPlan } from '@/types/mechanic';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

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
      date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
      customerName: 'Sarah Johnson',
      serviceType: 'Brake Replacement',
      estimatedTime: '3 hours',
      notes: 'Front and rear brake pads'
    },
    {
      id: '3',
      date: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
      customerName: 'Mike Wilson',
      serviceType: 'Tire Rotation',
      estimatedTime: '45 minutes',
      notes: 'Check tire pressure and tread depth'
    }
  ]
};

const WeeklyPlanner = () => {
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
  const { toast } = useToast();

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

  const formatDisplayDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'EEE, MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">{weeklyPlan.week}</h2>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <FilePlus size={16} />
          Add Job
        </Button>
      </div>

      {weeklyPlan.entries.length === 0 ? (
        <div className="text-center py-12 border rounded-md bg-muted/20">
          <h3 className="text-lg font-medium mb-2">No jobs scheduled yet</h3>
          <p className="text-muted-foreground mb-6">
            Start planning your week by adding jobs to your schedule
          </p>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <FilePlus className="mr-2 h-4 w-4" />
            Add Job
          </Button>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Est. Time</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {weeklyPlan.entries
                .sort((a, b) => a.date.localeCompare(b.date))
                .map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-muted-foreground" />
                      {formatDisplayDate(entry.date)}
                    </div>
                  </TableCell>
                  <TableCell>{entry.customerName}</TableCell>
                  <TableCell>{entry.serviceType}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-muted-foreground" />
                      {entry.estimatedTime}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    {editingNoteId === entry.id ? (
                      <div className="flex flex-col gap-2">
                        <Textarea 
                          value={editedNote}
                          onChange={(e) => setEditedNote(e.target.value)}
                          className="min-h-[60px] text-sm"
                          placeholder="Enter notes for this job"
                        />
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="h-7 px-2 text-xs"
                            onClick={() => saveEditedNote(entry.id)}
                          >
                            <CheckSquare className="h-3.5 w-3.5 mr-1" />
                            Save
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="h-7 px-2 text-xs"
                            onClick={cancelEditingNote}
                          >
                            <X className="h-3.5 w-3.5 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between group">
                        <span className="mr-2" title={entry.notes}>{entry.notes || "No notes"}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => startEditingNote(entry)}
                        >
                          <Edit size={14} />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => openEditDialog(entry)}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDeleteEntry(entry.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add Job Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Job to Planner</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <label className="text-sm font-medium">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex justify-start text-left"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {newEntry.date ? formatDisplayDate(newEntry.date) : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={new Date(newEntry.date)}
                    onSelect={(date) => setNewEntry({
                      ...newEntry,
                      date: date ? format(date, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
                    })}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <label className="text-sm font-medium">Customer Name</label>
              <Input 
                placeholder="Enter customer name"
                value={newEntry.customerName}
                onChange={(e) => setNewEntry({
                  ...newEntry,
                  customerName: e.target.value
                })}
              />
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <label className="text-sm font-medium">Service Type</label>
              <Input 
                placeholder="Enter service type"
                value={newEntry.serviceType}
                onChange={(e) => setNewEntry({
                  ...newEntry,
                  serviceType: e.target.value
                })}
              />
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <label className="text-sm font-medium">Estimated Time</label>
              <Input 
                placeholder="e.g., 2 hours, 45 minutes"
                value={newEntry.estimatedTime}
                onChange={(e) => setNewEntry({
                  ...newEntry,
                  estimatedTime: e.target.value
                })}
              />
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <label className="text-sm font-medium">Notes</label>
              <Textarea 
                placeholder="Enter any special instructions or notes"
                value={newEntry.notes}
                onChange={(e) => setNewEntry({
                  ...newEntry,
                  notes: e.target.value
                })}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAddEntry}>
              <Save className="mr-2 h-4 w-4" />
              Save Job
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Job Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Job</DialogTitle>
          </DialogHeader>
          {editingEntry && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-2">
                <label className="text-sm font-medium">Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex justify-start text-left"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {editingEntry.date ? formatDisplayDate(editingEntry.date) : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={new Date(editingEntry.date)}
                      onSelect={(date) => setEditingEntry({
                        ...editingEntry,
                        date: date ? format(date, 'yyyy-MM-dd') : editingEntry.date
                      })}
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <label className="text-sm font-medium">Customer Name</label>
                <Input 
                  placeholder="Enter customer name"
                  value={editingEntry.customerName}
                  onChange={(e) => setEditingEntry({
                    ...editingEntry,
                    customerName: e.target.value
                  })}
                />
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <label className="text-sm font-medium">Service Type</label>
                <Input 
                  placeholder="Enter service type"
                  value={editingEntry.serviceType}
                  onChange={(e) => setEditingEntry({
                    ...editingEntry,
                    serviceType: e.target.value
                  })}
                />
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <label className="text-sm font-medium">Estimated Time</label>
                <Input 
                  placeholder="e.g., 2 hours, 45 minutes"
                  value={editingEntry.estimatedTime}
                  onChange={(e) => setEditingEntry({
                    ...editingEntry,
                    estimatedTime: e.target.value
                  })}
                />
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <label className="text-sm font-medium">Notes</label>
                <Textarea 
                  placeholder="Enter any special instructions or notes"
                  value={editingEntry.notes}
                  onChange={(e) => setEditingEntry({
                    ...editingEntry,
                    notes: e.target.value
                  })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleEditEntry}>
              <Save className="mr-2 h-4 w-4" />
              Update Job
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WeeklyPlanner;
