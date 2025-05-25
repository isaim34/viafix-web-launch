
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateIncomeData, currentYear } from './utils/incomeDataUtils';
import ReportControls from './ReportControls';
import PrintableReport from './PrintableReport';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const IncomeReportGenerator: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [reportType, setReportType] = useState<'monthly' | 'yearly'>('monthly');
  const [printError, setPrintError] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Generate data based on selections
  const incomeData = generateIncomeData(selectedYear, reportType === 'monthly' ? selectedMonth : undefined);
  const totalIncome = incomeData.reduce((sum, item) => sum + item.amount, 0);
  
  const handlePrint = () => {
    const content = printRef.current;
    if (!content) {
      setPrintError("Could not find report content to print");
      return;
    }
    
    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        setPrintError("Please allow popups for this website to print reports");
        toast({
          title: "Print Error",
          description: "Please allow popups for this website to print reports",
          variant: "destructive"
        });
        return;
      }
      
      const reportTitle = reportType === 'monthly' 
        ? `Income Report - ${reportType === 'monthly' ? new Date(selectedYear, selectedMonth || 0).toLocaleString('default', { month: 'long' }) : ''} ${selectedYear}`
        : `Yearly Income Report - ${selectedYear}`;
      
      printWindow.document.write(`
        <html>
          <head>
            <title>${reportTitle}</title>
            <style>
              body { 
                font-family: sans-serif; 
                padding: 20px; 
                margin: 0;
              }
              .header {
                text-align: center;
                margin-bottom: 30px;
                border-bottom: 2px solid #2563eb;
                padding-bottom: 20px;
              }
              .company-name {
                font-size: 24px;
                font-weight: bold;
                color: #2563eb;
                margin: 0 0 5px 0;
              }
              .tagline {
                font-size: 14px;
                color: #666;
                margin: 5px 0 15px 0;
              }
              .report-title {
                font-size: 20px;
                color: #333;
                margin: 10px 0 0 0;
              }
              h1 { 
                text-align: center; 
                margin: 20px 0; 
                color: #333;
              }
              table { 
                width: 100%; 
                border-collapse: collapse; 
                margin-bottom: 20px; 
              }
              th, td { 
                border: 1px solid #ddd; 
                padding: 8px; 
                text-align: left; 
              }
              th { 
                background-color: #f8f9fa; 
              }
              .total { 
                font-weight: bold; 
                text-align: right; 
                margin-top: 20px; 
                font-size: 18px;
                color: #2563eb;
              }
              .footer { 
                text-align: center; 
                font-size: 12px; 
                margin-top: 40px; 
                color: #666; 
                border-top: 1px solid #ddd;
                padding-top: 20px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h2 class="company-name">ViaFix</h2>
              <p class="tagline">Professional Mobile Mechanic Services</p>
              <h1 class="report-title">${reportTitle}</h1>
            </div>
            ${content.innerHTML}
            <div class="footer">
              Generated on ${new Date().toLocaleDateString()} by ViaFix
            </div>
          </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.focus();
      
      // Clear any previous errors
      setPrintError(null);
      
      setTimeout(() => {
        try {
          printWindow.print();
          toast({
            title: "Success",
            description: "Print dialog opened successfully",
          });
        } catch (err) {
          console.error("Print error:", err);
          setPrintError("Failed to open print dialog");
          toast({
            title: "Print Error",
            description: "Failed to open print dialog",
            variant: "destructive"
          });
        }
      }, 250);
    } catch (err) {
      console.error("Window error:", err);
      setPrintError("Your browser blocked the print window");
      toast({
        title: "Print Error",
        description: "Your browser blocked the print window",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Income Reports</CardTitle>
        <CardDescription>Generate and print income reports for your records</CardDescription>
      </CardHeader>
      <CardContent>
        {printError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{printError}</AlertDescription>
          </Alert>
        )}
        
        <Tabs value={reportType} onValueChange={(value) => setReportType(value as 'monthly' | 'yearly')}>
          <TabsList className="mb-4">
            <TabsTrigger value="monthly">Monthly Report</TabsTrigger>
            <TabsTrigger value="yearly">Yearly Report</TabsTrigger>
          </TabsList>
          
          <ReportControls
            reportType={reportType}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            setSelectedMonth={setSelectedMonth}
            setSelectedYear={setSelectedYear}
            handlePrint={handlePrint}
          />
          
          <PrintableReport
            reportType={reportType}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            incomeData={incomeData}
            totalIncome={totalIncome}
            printRef={printRef}
          />
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default IncomeReportGenerator;
