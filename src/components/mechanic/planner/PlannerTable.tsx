
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { PlannerEntry } from '@/types/mechanic';
import PlannerTableRow from './PlannerTableRow';

interface PlannerTableProps {
  entries: PlannerEntry[];
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

const PlannerTable: React.FC<PlannerTableProps> = ({
  entries,
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
          {entries.length > 0 ? (
            entries
              .sort((a, b) => a.date.localeCompare(b.date))
              .map((entry) => (
                <PlannerTableRow
                  key={entry.id}
                  entry={entry}
                  editingNoteId={editingNoteId}
                  editedNote={editedNote}
                  formatDisplayDate={formatDisplayDate}
                  onEditClick={onEditClick}
                  onDeleteClick={onDeleteClick}
                  onStartEditingNote={onStartEditingNote}
                  onSaveEditedNote={onSaveEditedNote}
                  onCancelEditingNote={onCancelEditingNote}
                  onEditedNoteChange={onEditedNoteChange}
                />
              ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-32 text-center">
                No jobs match the current filters
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PlannerTable;
