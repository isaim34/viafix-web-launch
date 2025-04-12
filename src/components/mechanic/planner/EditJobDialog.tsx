
import React from 'react';
import { Calendar, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
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
import { PlannerEntry } from '@/types/mechanic';
import { cn } from '@/lib/utils';

interface EditJobDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingEntry: PlannerEntry | null;
  setEditingEntry: React.Dispatch<React.SetStateAction<PlannerEntry | null>>;
  onEditEntry: () => void;
  formatDisplayDate: (dateString: string) => string;
}

const EditJobDialog: React.FC<EditJobDialogProps> = ({
  isOpen,
  onOpenChange,
  editingEntry,
  setEditingEntry,
  onEditEntry,
  formatDisplayDate
}) => {
  if (!editingEntry) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Job</DialogTitle>
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
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={onEditEntry}>
            <Save className="mr-2 h-4 w-4" />
            Update Job
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditJobDialog;
