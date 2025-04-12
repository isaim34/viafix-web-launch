
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

interface AddJobDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newEntry: Omit<PlannerEntry, 'id'>;
  setNewEntry: React.Dispatch<React.SetStateAction<Omit<PlannerEntry, 'id'>>>;
  onAddEntry: () => void;
  formatDisplayDate: (dateString: string) => string;
}

const AddJobDialog: React.FC<AddJobDialogProps> = ({
  isOpen,
  onOpenChange,
  newEntry,
  setNewEntry,
  onAddEntry,
  formatDisplayDate
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
          <Button onClick={onAddEntry}>
            <Save className="mr-2 h-4 w-4" />
            Save Job
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddJobDialog;
