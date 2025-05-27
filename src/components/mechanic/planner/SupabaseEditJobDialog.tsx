
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
  id: string;
  date: string;
  customer_name: string;
  service_type: string;
  estimated_time: string;
  notes: string;
}

interface SupabaseEditJobDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingEntry: PlannerEntry;
  setEditingEntry: (entry: PlannerEntry) => void;
  onEditEntry: () => void;
  formatDisplayDate: (date: string) => string;
}

const SupabaseEditJobDialog: React.FC<SupabaseEditJobDialogProps> = ({
  isOpen,
  onOpenChange,
  editingEntry,
  setEditingEntry,
  onEditEntry,
  formatDisplayDate
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEntry.customer_name && editingEntry.service_type) {
      onEditEntry();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Job</DialogTitle>
          <DialogDescription>
            Update job appointment details
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-date">Date</Label>
            <Input
              id="edit-date"
              type="date"
              value={editingEntry.date}
              onChange={(e) => setEditingEntry({ ...editingEntry, date: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-customer">Customer Name</Label>
            <Input
              id="edit-customer"
              value={editingEntry.customer_name}
              onChange={(e) => setEditingEntry({ ...editingEntry, customer_name: e.target.value })}
              placeholder="Enter customer name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-service">Service Type</Label>
            <Input
              id="edit-service"
              value={editingEntry.service_type}
              onChange={(e) => setEditingEntry({ ...editingEntry, service_type: e.target.value })}
              placeholder="Enter service type"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-time">Estimated Time</Label>
            <Input
              id="edit-time"
              value={editingEntry.estimated_time}
              onChange={(e) => setEditingEntry({ ...editingEntry, estimated_time: e.target.value })}
              placeholder="e.g., 2 hours"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-notes">Notes</Label>
            <Textarea
              id="edit-notes"
              value={editingEntry.notes}
              onChange={(e) => setEditingEntry({ ...editingEntry, notes: e.target.value })}
              placeholder="Additional notes..."
              rows={3}
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Update Job</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SupabaseEditJobDialog;
