
import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer, Download } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { monthOptions, yearOptions } from './utils/incomeDataUtils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  
  const validateAndPrint = () => {
    if (reportType === 'monthly' && selectedMonth === null) {
      toast({
        title: "Selection Required",
        description: "Please select a month before printing",
        variant: "destructive"
      });
      return;
    }
    handlePrint();
  };
  
  const handleDownload = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Download functionality will be available in a future update",
    });
  };
  
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
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              Print Report
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Print Report</AlertDialogTitle>
              <AlertDialogDescription>
                This will open a new window to print your report. Please ensure your browser allows popups for this site.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={validateAndPrint}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={handleDownload}
        >
          <Download className="h-4 w-4" />
          Download
        </Button>
      </div>
    </div>
  );
};

export default ReportControls;
