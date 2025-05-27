
import React from 'react';
import { useSupabasePlannerState } from '@/hooks/useSupabasePlannerState';
import PlannerHeader from './planner/PlannerHeader';
import PlannerFilters from './planner/PlannerFilters';
import EmptyPlannerState from './planner/EmptyPlannerState';
import PlannerTable from './planner/PlannerTable';
import SupabaseAddJobDialog from './planner/SupabaseAddJobDialog';
import SupabaseEditJobDialog from './planner/SupabaseEditJobDialog';
import { exportToCSV, printSchedule } from './planner/utils/exportUtils';
import ErrorBoundary from '@/ErrorBoundary';
import { Loader2 } from 'lucide-react';

const SupabaseWeeklyPlanner = () => {
  const {
    entries,
    isLoading,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    editingEntry,
    setEditingEntry,
    newEntry,
    setNewEntry,
    handleAddEntry,
    handleEditEntry,
    handleDeleteEntry,
    filterOptions,
    handleFilterChange,
    clearFilters,
    uniqueServiceTypes
  } = useSupabasePlannerState();

  const activeFilterCount = 
    (filterOptions.startDate ? 1 : 0) + 
    (filterOptions.endDate ? 1 : 0) + 
    (filterOptions.serviceType ? 1 : 0);

  const handleExportCSV = () => {
    try {
      exportToCSV(entries, `planner-export-${new Date().toISOString().slice(0, 10)}.csv`);
    } catch (error) {
      console.error("Error exporting CSV:", error);
    }
  };

  const handlePrintSchedule = () => {
    try {
      printSchedule(entries, 'Weekly Schedule');
    } catch (error) {
      console.error("Error printing schedule:", error);
    }
  };

  const formatDisplayDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading planner...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ErrorBoundary fallback={<div className="p-4 text-red-500">Error loading planner header</div>}>
        <PlannerHeader 
          weekTitle="Weekly Schedule"
          entries={entries}
          onAddClick={() => setIsAddDialogOpen(true)}
          onExportCSV={handleExportCSV}
          onPrintSchedule={handlePrintSchedule}
        />
      </ErrorBoundary>

      {entries.length === 0 ? (
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
              entries={entries}
              editingNoteId={null}
              editedNote=""
              formatDisplayDate={formatDisplayDate}
              onEditClick={setEditingEntry}
              onDeleteClick={handleDeleteEntry}
              onStartEditingNote={() => {}}
              onSaveEditedNote={() => {}}
              onCancelEditingNote={() => {}}
              onEditedNoteChange={() => {}}
            />
          </ErrorBoundary>
        </>
      )}

      <SupabaseAddJobDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        newEntry={newEntry}
        setNewEntry={setNewEntry}
        onAddEntry={() => handleAddEntry(newEntry)}
        formatDisplayDate={formatDisplayDate}
      />

      {editingEntry && (
        <SupabaseEditJobDialog
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          editingEntry={editingEntry}
          setEditingEntry={setEditingEntry}
          onEditEntry={() => handleEditEntry(editingEntry)}
          formatDisplayDate={formatDisplayDate}
        />
      )}
    </div>
  );
};

export default SupabaseWeeklyPlanner;
