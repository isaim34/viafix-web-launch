
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { FileText } from 'lucide-react';

interface MechanicNoteFormProps {
  record: any;
  onAddNote: (note: string) => void;
}

const MechanicNoteForm = ({ record, onAddNote }: MechanicNoteFormProps) => {
  const [note, setNote] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (note.trim()) {
      onAddNote(note);
      setNote('');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="mt-4 w-full">
      <h4 className="text-sm font-semibold mb-2">Add Mechanic Note</h4>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="w-full min-h-[100px] p-2 border rounded-md mb-2"
        placeholder="Add notes about this maintenance record (visible to the customer)"
      />
      <Button type="submit" disabled={!note.trim()} className="w-full">
        <FileText className="mr-2 h-4 w-4" />
        Add Note
      </Button>
    </form>
  );
};

export default MechanicNoteForm;
