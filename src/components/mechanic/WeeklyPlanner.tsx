
import React from 'react';
import { usePlannerState } from './planner/usePlannerState';
import PlannerHeader from './planner/PlannerHeader';
import PlannerFilters from './planner/PlannerFilters';
import EmptyPlannerState from './planner/EmptyPlannerState';
import PlannerTable from './planner/PlannerTable';
import AddJobDialog from './planner/AddJobDialog';
import EditJobDialog from './planner/EditJobDialog';
import { exportToCSV, printSchedule } from './planner/utils/exportUtils';
import ErrorBoundary from '@/ErrorBoundary';

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

  // Add debug logging
  React.useEffect(() => {
    console.log("WeeklyPlanner component mounted");
    return () => console.log("WeeklyPlanner component unmounted");
  }, []);

  // Calculate the number of active filters
  const activeFilterCount = 
    (filterOptions.startDate ? 1 : 0) + 
    (filterOptions.endDate ? 1 : 0) + 
    (filterOptions.serviceType ? 1 : 0);

  // Handle CSV export
  const handleExportCSV = () => {
    try {
      exportToCSV(filteredEntries, `planner-export-${new Date().toISOString().slice(0, 10)}.csv`);
    } catch (error) {
      console.error("Error exporting CSV:", error);
    }
  };

  // Handle print schedule
  const handlePrintSchedule = () => {
    try {
      printSchedule(filteredEntries, weeklyPlan?.week || 'Current Week');
    } catch (error) {
      console.error("Error printing schedule:", error);
    }
  };

  return (
    <div className="space-y-6">
      <ErrorBoundary fallback={<div className="p-4 text-red-500">Error loading planner header</div>}>
        <PlannerHeader 
          weekTitle={weeklyPlan?.week || 'Current Week'}
          entries={filteredEntries || []}
          onAddClick={() => setIsAddDialogOpen(true)}
          onExportCSV={handleExportCSV}
          onPrintSchedule={handlePrintSchedule}
        />
      </ErrorBoundary>

      {!weeklyPlan?.entries || weeklyPlan.entries.length === 0 ? (
        <EmptyPlannerState onAddClick={() => setIsAddDialogOpen(true)} />
      ) : (
        <>
          <ErrorBoundary fallback={<div className="p-4 text-red-500">Error loading planner filters</div>}>
            <PlannerFilters 
              filterOptions={filterOptions}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
              serviceTypes={uniqueServiceTypes}
              activeFilterCount={activeFilterCount}
            />
          </ErrorBoundary>
          
          <ErrorBoundary fallback={<div className="p-4 text-red-500">Error loading planner table</div>}>
            <PlannerTable
              entries={filteredEntries || []}
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
          </ErrorBoundary>
        </>
      )}

      {/* Add Job Dialog */}
      <ErrorBoundary fallback={<div className="p-4 text-red-500">Error loading job dialog</div>}>
        <AddJobDialog
          isOpen={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          newEntry={newEntry}
          setNewEntry={setNewEntry}
          onAddEntry={handleAddEntry}
          formatDisplayDate={formatDisplayDate}
        />
      </ErrorBoundary>

      {/* Edit Job Dialog */}
      <ErrorBoundary fallback={<div className="p-4 text-red-500">Error loading edit dialog</div>}>
        {editingEntry && (
          <EditJobDialog
            isOpen={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            editingEntry={editingEntry}
            setEditingEntry={setEditingEntry}
            onEditEntry={handleEditEntry}
            formatDisplayDate={formatDisplayDate}
          />
        )}
      </ErrorBoundary>
    </div>
  );
};

export default WeeklyPlanner;
