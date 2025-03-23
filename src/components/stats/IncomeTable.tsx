
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface IncomeItem {
  id: string;
  date: string;
  service: string;
  client: string;
  amount: number;
}

interface IncomeTableProps {
  incomeData: IncomeItem[];
  totalIncome: number;
}

const IncomeTable: React.FC<IncomeTableProps> = ({ incomeData, totalIncome }) => {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Client</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {incomeData.length > 0 ? (
            incomeData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                <TableCell>{item.service}</TableCell>
                <TableCell>{item.client}</TableCell>
                <TableCell className="text-right">${item.amount.toFixed(2)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                No income data available for the selected period
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      <div className="mt-6 text-right font-semibold">
        Total Income: ${totalIncome.toFixed(2)}
      </div>
    </>
  );
};

export default IncomeTable;
