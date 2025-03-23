
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer, Download, ChevronDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data - in a real application, this would come from an API
const generateIncomeData = (year: number, month?: number) => {
  const data: {
    id: string;
    date: string;
    service: string;
    client: string;
    amount: number;
  }[] = [];
  
  const monthsToGenerate = month ? [month] : Array.from({ length: 12 }, (_, i) => i);
  
  monthsToGenerate.forEach(m => {
    const daysInMonth = new Date(year, m + 1, 0).getDate();
    const entriesCount = Math.floor(Math.random() * 10) + 5; // 5-15 entries per month
    
    const services = [
      'Oil Change', 
      'Brake Repair', 
      'Tire Replacement', 
      'Engine Diagnostics', 
      'Battery Replacement'
    ];
    
    const clients = [
      'John Smith', 
      'Maria Garcia', 
      'Robert Chen', 
      'Sarah Johnson',
      'Mike Wilson',
      'Emma Davis'
    ];
    
    for (let i = 0; i < entriesCount; i++) {
      const day = Math.floor(Math.random() * daysInMonth) + 1;
      const service = services[Math.floor(Math.random() * services.length)];
      const client = clients[Math.floor(Math.random() * clients.length)];
      const amount = Math.floor(Math.random() * 300) + 50; // $50-$350
      
      data.push({
        id: `${year}-${m+1}-${day}-${i}`,
        date: `${year}-${(m+1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
        service,
        client,
        amount
      });
    }
  });
  
  return data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

const currentYear = new Date().getFullYear();
const yearOptions = [currentYear, currentYear-1, currentYear-2];
const monthOptions = [
  { value: '0', label: 'January' },
  { value: '1', label: 'February' },
  { value: '2', label: 'March' },
  { value: '3', label: 'April' },
  { value: '4', label: 'May' },
  { value: '5', label: 'June' },
  { value: '6', label: 'July' },
  { value: '7', label: 'August' },
  { value: '8', label: 'September' },
  { value: '9', label: 'October' },
  { value: '10', label: 'November' },
  { value: '11', label: 'December' },
];

const IncomeReportGenerator: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [reportType, setReportType] = useState<'monthly' | 'yearly'>('monthly');
  const printRef = useRef<HTMLDivElement>(null);
  
  // Generate data based on selections
  const incomeData = generateIncomeData(selectedYear, reportType === 'monthly' ? selectedMonth : undefined);
  
  const totalIncome = incomeData.reduce((sum, item) => sum + item.amount, 0);
  
  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups for this website');
      return;
    }
    
    const reportTitle = reportType === 'monthly' 
      ? `Income Report - ${monthOptions.find(m => parseInt(m.value) === selectedMonth)?.label} ${selectedYear}`
      : `Yearly Income Report - ${selectedYear}`;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>${reportTitle}</title>
          <style>
            body { font-family: sans-serif; padding: 20px; }
            h1 { text-align: center; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f8f9fa; }
            .total { font-weight: bold; text-align: right; margin-top: 20px; }
            .footer { text-align: center; font-size: 12px; margin-top: 40px; color: #666; }
          </style>
        </head>
        <body>
          <h1>${reportTitle}</h1>
          ${content.innerHTML}
          <div class="footer">
            Generated on ${new Date().toLocaleDateString()} by Mechanic Dashboard
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Income Reports</CardTitle>
        <CardDescription>Generate and print income reports for your records</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={reportType} onValueChange={(value) => setReportType(value as 'monthly' | 'yearly')}>
          <TabsList className="mb-4">
            <TabsTrigger value="monthly">Monthly Report</TabsTrigger>
            <TabsTrigger value="yearly">Yearly Report</TabsTrigger>
          </TabsList>
          
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
                // In a real app, this would generate and download a PDF or CSV
                onClick={() => alert('Download functionality would be implemented here')}
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
          
          <div ref={printRef}>
            <h2 className="text-xl font-semibold mb-4">
              {reportType === 'monthly' 
                ? `Income Report - ${monthOptions.find(m => parseInt(m.value) === selectedMonth)?.label || 'Select Month'} ${selectedYear}`
                : `Yearly Income Report - ${selectedYear}`}
            </h2>
            
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
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default IncomeReportGenerator;
