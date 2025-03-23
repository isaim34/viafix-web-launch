
import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer, Download } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { monthOptions, yearOptions } from './utils/incomeDataUtils';

interface ReportControlsProps {
  reportType: 'monthly' | 'yearly';
  selectedMonth: number | null;
  selectedYear: number;
  setSelectedMonth: (month: number) => void;
  setSelectedYear: (year: number) => void;
  handlePrint: () => void;
}

const ReportControls: React.FC<ReportControlsProps> = ({
  reportType,
  selectedMonth,
  selectedYear,
  setSelectedMonth,
  setSelectedYear,
  handlePrint
}) => {
  return (
    <div className="mb-6 flex flex-wrap gap-4">
      {reportType === 'monthly' && (
        <Select
          value={selectedMonth !== null ? selectedMonth.toString() : ''}
          onValueChange={(value) => setSelectedMonth(parseInt(value))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Month" />
          </SelectTrigger>
          <SelectContent>
            {monthOptions.map((month) => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      
      <Select
        value={selectedYear.toString()}
        onValueChange={(value) => setSelectedYear(parseInt(value))}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Year" />
        </SelectTrigger>
        <SelectContent>
          {yearOptions.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <div className="ml-auto flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          onClick={handlePrint}
          className="flex items-center gap-2"
        >
          <Printer className="h-4 w-4" />
          Print Report
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => alert('Download functionality would be implemented here')}
        >
          <Download className="h-4 w-4" />
          Download
        </Button>
      </div>
    </div>
  );
};

export default ReportControls;
