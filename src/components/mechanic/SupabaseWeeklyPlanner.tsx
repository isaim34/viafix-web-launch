
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
      // Convert entries to the format expected by exportToCSV
      const convertedEntries = entries.map(entry => ({
        id: entry.id,
        date: entry.date,
        customerName: entry.customer_name,
        serviceType: entry.service_type,
        estimatedTime: entry.estimated_time,
        notes: entry.notes
      }));
      exportToCSV(convertedEntries, `planner-export-${new Date().toISOString().slice(0, 10)}.csv`);
    } catch (error) {
      console.error("Error exporting CSV:", error);
    }
  };

  const handlePrintSchedule = () => {
    try {
      // Convert entries to the format expected by printSchedule
      const convertedEntries = entries.map(entry => ({
        id: entry.id,
        date: entry.date,
        customerName: entry.customer_name,
        serviceType: entry.service_type,
        estimatedTime: entry.estimated_time,
        notes: entry.notes
      }));
      printSchedule(convertedEntries, 'Weekly Schedule');
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

  // Convert entries to match PlannerTable expectations
  const convertedEntries = entries.map(entry => ({
    id: entry.id,
    date: entry.date,
    customerName: entry.customer_name,
    serviceType: entry.service_type,
    estimatedTime: entry.estimated_time,
    notes: entry.notes
  }));

  return (
    <div className="space-y-6">
      <ErrorBoundary fallback={<div className="p-4 text-red-500">Error loading planner header</div>}>
        <PlannerHeader 
          weekTitle="Weekly Schedule"
          entries={convertedEntries}
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
              entries={convertedEntries}
              editingNoteId={null}
              editedNote=""
              formatDisplayDate={formatDisplayDate}
              onEditClick={(entry) => {
                // Convert back to Supabase format
                const supabaseEntry = {
                  id: entry.id,
                  date: entry.date,
                  customer_name: entry.customerName,
                  service_type: entry.serviceType,
                  estimated_time: entry.estimatedTime,
                  notes: entry.notes
                };
                setEditingEntry(supabaseEntry);
              }}
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
