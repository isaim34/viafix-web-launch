
import React from 'react';
import { CalendarPlus, FileDown, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlannerEntry } from '@/types/mechanic';

interface PlannerHeaderProps {
  weekTitle: string;
  entries: PlannerEntry[];
  onAddClick: () => void;
  onExportCSV: () => void;
  onPrintSchedule: () => void;
}

const PlannerHeader: React.FC<PlannerHeaderProps> = ({
  weekTitle,
  entries,
  onAddClick,
  onExportCSV,
  onPrintSchedule
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h3 className="text-xl font-semibold tracking-tight">{weekTitle}</h3>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <FileDown className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onExportCSV} className="flex items-center gap-2">
              <FileDown className="h-4 w-4" />
              Export to CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onPrintSchedule} className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              Print Schedule
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button onClick={onAddClick} size="sm" className="flex items-center gap-2">
          <CalendarPlus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Job</span>
        </Button>
      </div>
    </div>
  );
};

export default PlannerHeader;
