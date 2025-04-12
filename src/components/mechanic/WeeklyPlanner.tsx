
import React from 'react';
import { usePlannerState } from './planner/usePlannerState';
import PlannerHeader from './planner/PlannerHeader';
import PlannerFilters from './planner/PlannerFilters';
import EmptyPlannerState from './planner/EmptyPlannerState';
import PlannerTable from './planner/PlannerTable';
import AddJobDialog from './planner/AddJobDialog';
import EditJobDialog from './planner/EditJobDialog';
import { exportToCSV, printSchedule } from './planner/utils/exportUtils';

const WeeklyPlanner = () => {
  const {
    weeklyPlan,
    filteredEntries,
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
    formatDisplayDate,
    filterOptions,
    handleFilterChange,
    clearFilters,
    uniqueServiceTypes
  } = usePlannerState();

  // Calculate the number of active filters
  const activeFilterCount = 
    (filterOptions.startDate ? 1 : 0) + 
    (filterOptions.endDate ? 1 : 0) + 
    (filterOptions.serviceType ? 1 : 0);

  // Handle CSV export
  const handleExportCSV = () => {
    exportToCSV(filteredEntries, `planner-export-${new Date().toISOString().slice(0, 10)}.csv`);
  };

  // Handle print schedule
  const handlePrintSchedule = () => {
    printSchedule(filteredEntries, weeklyPlan.week);
  };

  return (
    <div className="space-y-6">
      <PlannerHeader 
        weekTitle={weeklyPlan.week}
        entries={filteredEntries}
        onAddClick={() => setIsAddDialogOpen(true)}
        onExportCSV={handleExportCSV}
        onPrintSchedule={handlePrintSchedule}
      />

      {weeklyPlan.entries.length === 0 ? (
        <EmptyPlannerState onAddClick={() => setIsAddDialogOpen(true)} />
      ) : (
        <>
          <PlannerFilters 
            filterOptions={filterOptions}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
            serviceTypes={uniqueServiceTypes}
            activeFilterCount={activeFilterCount}
          />
          <PlannerTable
            entries={filteredEntries}
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
        </>
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
