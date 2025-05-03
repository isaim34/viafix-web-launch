
import React from 'react';
import { CalendarRange, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FilterOptions } from './types/plannerTypes';

interface PlannerFiltersProps {
  filterOptions: FilterOptions;
  onFilterChange: (key: keyof FilterOptions, value: string) => void;
  onClearFilters: () => void;
  serviceTypes: string[];
  activeFilterCount: number;
}

const PlannerFilters: React.FC<PlannerFiltersProps> = ({
  filterOptions,
  onFilterChange,
  onClearFilters,
  serviceTypes,
  activeFilterCount
}) => {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <CalendarRange className="h-4 w-4" />
            <span>Date Range</span>
            {(filterOptions.startDate || filterOptions.endDate) && (
              <span className="ml-1 h-4 w-4 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">•</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" align="start">
          <div className="space-y-2">
            <div>
              <label htmlFor="startDate" className="text-sm font-medium">Start Date</label>
              <Input
                id="startDate"
                type="date"
                value={filterOptions.startDate || ''}
                onChange={(e) => onFilterChange('startDate', e.target.value || undefined)}
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="text-sm font-medium">End Date</label>
              <Input
                id="endDate"
                type="date"
                value={filterOptions.endDate || ''}
                onChange={(e) => onFilterChange('endDate', e.target.value || undefined)}
                className="mt-1"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Select
        value={filterOptions.serviceType || ''}
        onValueChange={(value) => onFilterChange('serviceType', value || undefined)}
      >
        <SelectTrigger className="w-[180px] h-9 text-sm">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <SelectValue placeholder="Service Type" />
            {filterOptions.serviceType && (
              <span className="ml-1 h-4 w-4 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">•</span>
            )}
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Service Types</SelectItem>
          {serviceTypes.map((type) => (
            <SelectItem key={type} value={type}>{type}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {activeFilterCount > 0 && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClearFilters}
          className="flex items-center gap-1"
        >
          <X className="h-4 w-4" />
          Clear Filters
        </Button>
      )}
    </div>
  );
};

export default PlannerFilters;
