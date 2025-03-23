
import React from 'react';
import IncomeTable from './IncomeTable';
import { monthOptions } from './utils/incomeDataUtils';

interface IncomeItem {
  id: string;
  date: string;
  service: string;
  client: string;
  amount: number;
}

interface PrintableReportProps {
  reportType: 'monthly' | 'yearly';
  selectedMonth: number | null;
  selectedYear: number;
  incomeData: IncomeItem[];
  totalIncome: number;
  printRef: React.RefObject<HTMLDivElement>;
}

const PrintableReport: React.FC<PrintableReportProps> = ({
  reportType,
  selectedMonth,
  selectedYear,
  incomeData,
  totalIncome,
  printRef
}) => {
  return (
    <div ref={printRef}>
      <h2 className="text-xl font-semibold mb-4">
        {reportType === 'monthly' 
          ? `Income Report - ${monthOptions.find(m => parseInt(m.value) === selectedMonth)?.label || 'Select Month'} ${selectedYear}`
          : `Yearly Income Report - ${selectedYear}`}
      </h2>
      
      <IncomeTable incomeData={incomeData} totalIncome={totalIncome} />
    </div>
  );
};

export default PrintableReport;
