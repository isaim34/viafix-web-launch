
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface PlannerEntry {
  date: string;
  customer_name: string;
  service_type: string;
  estimated_time: string;
  notes: string;
}

interface SupabaseAddJobDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newEntry: Omit<PlannerEntry, 'id'>;
  setNewEntry: (entry: Omit<PlannerEntry, 'id'>) => void;
  onAddEntry: () => void;
  formatDisplayDate: (date: string) => string;
}

const SupabaseAddJobDialog: React.FC<SupabaseAddJobDialogProps> = ({
  isOpen,
  onOpenChange,
  newEntry,
  setNewEntry,
  onAddEntry,
  formatDisplayDate
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEntry.customer_name && newEntry.service_type) {
      onAddEntry();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Job</DialogTitle>
          <DialogDescription>
            Schedule a new job appointment
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={newEntry.date}
              onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="customer">Customer Name</Label>
            <Input
              id="customer"
              value={newEntry.customer_name}
              onChange={(e) => setNewEntry({ ...newEntry, customer_name: e.target.value })}
              placeholder="Enter customer name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="service">Service Type</Label>
            <Input
              id="service"
              value={newEntry.service_type}
              onChange={(e) => setNewEntry({ ...newEntry, service_type: e.target.value })}
              placeholder="Enter service type"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="time">Estimated Time</Label>
            <Input
              id="time"
              value={newEntry.estimated_time}
              onChange={(e) => setNewEntry({ ...newEntry, estimated_time: e.target.value })}
              placeholder="e.g., 2 hours"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={newEntry.notes}
              onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
              placeholder="Additional notes..."
              rows={3}
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Job</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SupabaseAddJobDialog;
