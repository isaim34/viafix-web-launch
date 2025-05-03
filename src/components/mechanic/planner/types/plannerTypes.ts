
import { WeeklyPlan } from '@/types/mechanic';

export type FilterOptions = {
  startDate: string | undefined;
  endDate: string | undefined;
  serviceType: string | undefined;
};

export type PlannerFilterOptions = FilterOptions;

export type PlannerEntry = {
  id: string;
  date: string;
  customerName: string;
  serviceType: string;
  estimatedTime: string;
  notes: string;
};

export type NotesEditingState = {
  editingNoteId: string | null;
  editedNote: string;
};

export type DialogState = {
  isAddDialogOpen: boolean;
  isEditDialogOpen: boolean;
};
