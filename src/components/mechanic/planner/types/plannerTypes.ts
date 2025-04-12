
import { WeeklyPlan } from '@/types/mechanic';

export type FilterOptions = {
  startDate: string | undefined;
  endDate: string | undefined;
  serviceType: string | undefined;
};

export type NotesEditingState = {
  editingNoteId: string | null;
  editedNote: string;
};

export type DialogState = {
  isAddDialogOpen: boolean;
  isEditDialogOpen: boolean;
};
