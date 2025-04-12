
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
  editedNote,
  formatDisplayDate,
  onEditClick,
  onDeleteClick,
  onStartEditingNote,
  onSaveEditedNote,
  onCancelEditingNote,
  onEditedNoteChange
}) => {
  return (
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
              onChange={(e) => onEditedNoteChange(e.target.value)}
              className="min-h-[60px] text-sm"
              placeholder="Enter notes for this job"
            />
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                className="h-7 px-2 text-xs"
                onClick={() => onSaveEditedNote(entry.id)}
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
            <span className="mr-2" title={entry.notes}>{entry.notes || "No notes"}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onStartEditingNote(entry)}
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
            onClick={() => onEditClick(entry)}
          >
            <Pencil size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onDeleteClick(entry.id)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default PlannerTableRow;
