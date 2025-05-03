
import React from 'react';
import { Calendar, Clock, Edit, Pencil, Trash2, CheckSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { TableRow, TableCell } from '@/components/ui/table';
import { PlannerEntry } from '@/types/mechanic';

interface PlannerTableRowProps {
  entry: PlannerEntry;
  editingNoteId: string | null;
  editedNote: string;
  formatDisplayDate: (dateString: string) => string;
  onEditClick: (entry: PlannerEntry) => void;
  onDeleteClick: (id: string) => void;
  onStartEditingNote: (entry: PlannerEntry) => void;
  onSaveEditedNote: (id: string) => void;
  onCancelEditingNote: () => void;
  onEditedNoteChange: (value: string) => void;
}

const PlannerTableRow: React.FC<PlannerTableRowProps> = ({
  entry,
  editingNoteId,
  editedNote = '',
  formatDisplayDate,
  onEditClick,
  onDeleteClick,
  onStartEditingNote,
  onSaveEditedNote,
  onCancelEditingNote,
  onEditedNoteChange
}) => {
  if (!entry || !entry.id) {
    console.error("Invalid entry data", entry);
    return null;
  }

  const handleEditClick = () => {
    try {
      onEditClick(entry);
    } catch (error) {
      console.error("Error handling edit click:", error);
    }
  };

  const handleDeleteClick = () => {
    try {
      onDeleteClick(entry.id);
    } catch (error) {
      console.error("Error handling delete click:", error);
    }
  };

  const handleStartEditingNote = () => {
    try {
      onStartEditingNote(entry);
    } catch (error) {
      console.error("Error starting note edit:", error);
    }
  };

  const handleSaveEditedNote = () => {
    try {
      onSaveEditedNote(entry.id);
    } catch (error) {
      console.error("Error saving edited note:", error);
    }
  };

  return (
    <TableRow key={entry.id}>
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-muted-foreground" />
          {formatDisplayDate(entry.date)}
        </div>
      </TableCell>
      <TableCell>{entry.customerName || 'N/A'}</TableCell>
      <TableCell>{entry.serviceType || 'N/A'}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-muted-foreground" />
          {entry.estimatedTime || 'N/A'}
        </div>
      </TableCell>
      <TableCell className="max-w-xs">
        {editingNoteId === entry.id ? (
          <div className="flex flex-col gap-2">
            <Textarea 
              value={editedNote}
              onChange={(e) => onEditedNoteChange(e.target.value)}
              className="min-h-[60px] text-sm"
              placeholder="Enter notes for this job"
            />
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                className="h-7 px-2 text-xs"
                onClick={handleSaveEditedNote}
              >
                <CheckSquare className="h-3.5 w-3.5 mr-1" />
                Save
              </Button>
              <Button 
                size="sm" 
                variant="ghost"
                className="h-7 px-2 text-xs"
                onClick={onCancelEditingNote}
              >
                <X className="h-3.5 w-3.5 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between group">
            <span className="mr-2" title={entry.notes || ""}>{entry.notes || "No notes"}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleStartEditingNote}
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
            onClick={handleEditClick}
          >
            <Pencil size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleDeleteClick}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default PlannerTableRow;
