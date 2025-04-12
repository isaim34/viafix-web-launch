
import React from 'react';
import { usePlannerState } from './planner/usePlannerState';
import PlannerHeader from './planner/PlannerHeader';
import EmptyPlannerState from './planner/EmptyPlannerState';
import PlannerTable from './planner/PlannerTable';
import AddJobDialog from './planner/AddJobDialog';
import EditJobDialog from './planner/EditJobDialog';

const WeeklyPlanner = () => {
  const {
    weeklyPlan,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    editingEntry,
    setEditingEntry,
    newEntry,
    setNewEntry,
    editingNoteId,
    editedNote,
    setEditedNote,
    handleAddEntry,
    handleEditEntry,
    handleDeleteEntry,
    openEditDialog,
    startEditingNote,
    saveEditedNote,
    cancelEditingNote,
    formatDisplayDate
  } = usePlannerState();

  return (
    <div className="space-y-6">
      <PlannerHeader 
        weekTitle={weeklyPlan.week}
        onAddClick={() => setIsAddDialogOpen(true)}
      />

      {weeklyPlan.entries.length === 0 ? (
        <EmptyPlannerState onAddClick={() => setIsAddDialogOpen(true)} />
      ) : (
        <PlannerTable
          entries={weeklyPlan.entries}
          editingNoteId={editingNoteId}
          editedNote={editedNote}
          formatDisplayDate={formatDisplayDate}
          onEditClick={openEditDialog}
          onDeleteClick={handleDeleteEntry}
          onStartEditingNote={startEditingNote}
          onSaveEditedNote={saveEditedNote}
          onCancelEditingNote={cancelEditingNote}
          onEditedNoteChange={(value) => setEditedNote(value)}
        />
      )}

      {/* Add Job Dialog */}
      <AddJobDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        newEntry={newEntry}
        setNewEntry={setNewEntry}
        onAddEntry={handleAddEntry}
        formatDisplayDate={formatDisplayDate}
      />

      {/* Edit Job Dialog */}
      <EditJobDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        editingEntry={editingEntry}
        setEditingEntry={setEditingEntry}
        onEditEntry={handleEditEntry}
        formatDisplayDate={formatDisplayDate}
      />
    </div>
  );
};

export default WeeklyPlanner;
