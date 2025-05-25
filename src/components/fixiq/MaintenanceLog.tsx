
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Plus, FileText, Printer } from 'lucide-react';
import { VehicleInfo } from '@/services/nhtsa';
import { MaintenanceRecord } from '@/types/customer';
import { format } from 'date-fns';

interface MaintenanceLogProps {
  vehicleInfo: VehicleInfo;
  maintenanceRecords?: MaintenanceRecord[];
}

const MaintenanceLog = ({ vehicleInfo, maintenanceRecords = [] }: MaintenanceLogProps) => {
  const sortedRecords = [...maintenanceRecords].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  const generateReport = () => {
    // In a real implementation, this would generate a PDF report
    console.log('Generating FixIQ report for', vehicleInfo);
    alert('FixIQ Report generation would download a PDF with all maintenance records and safety data');
  };
  
  const printMaintenanceLog = () => {
    const printWindow = window.open('', '_blank', 'height=600,width=800');
    
    if (!printWindow) {
      alert('Please allow pop-ups to print the maintenance log');
      return;
    }
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Vehicle Maintenance Log - ${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              color: #333;
            }
            .header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 30px;
              border-bottom: 2px solid #2563eb;
              padding-bottom: 20px;
            }
            .logo-section {
              display: flex;
              align-items: center;
              gap: 15px;
            }
            .logo {
              height: 50px;
              width: auto;
            }
            .company-info {
              text-align: left;
            }
            .company-name {
              font-size: 24px;
              font-weight: bold;
              color: #2563eb;
              margin: 0;
            }
            .tagline {
              font-size: 14px;
              color: #666;
              margin: 5px 0 0 0;
            }
            .report-title {
              text-align: right;
              color: #333;
            }
            .vehicle-info {
              background-color: #f8f9fa;
              padding: 15px;
              border-radius: 8px;
              margin-bottom: 20px;
            }
            .timeline {
              position: relative;
              padding-left: 30px;
            }
            .timeline::before {
              content: '';
              position: absolute;
              left: 15px;
              top: 0;
              bottom: 0;
              width: 2px;
              background-color: #e5e7eb;
            }
            .timeline-item {
              position: relative;
              margin-bottom: 20px;
              background: white;
              padding: 15px;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
            }
            .timeline-item::before {
              content: '';
              position: absolute;
              left: -23px;
              top: 20px;
              width: 8px;
              height: 8px;
              background-color: #2563eb;
              border-radius: 50%;
            }
            .footer {
              text-align: center;
              font-size: 12px;
              margin-top: 40px;
              color: #666;
              border-top: 1px solid #ddd;
              padding-top: 20px;
            }
            @media print {
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo-section">
              <img src="/lovable-uploads/e3e5d8f9-ed10-4030-8f80-f4d6d309c6e4.png" alt="ViaFix Logo" class="logo" />
              <div class="company-info">
                <h2 class="company-name">ViaFix</h2>
                <p class="tagline">Professional Mobile Mechanic Services</p>
              </div>
            </div>
            <div class="report-title">
              <h1>Vehicle Maintenance Log</h1>
            </div>
          </div>
          
          <div class="vehicle-info">
            <h3>Vehicle Information</h3>
            <p><strong>Year:</strong> ${vehicleInfo.year}</p>
            <p><strong>Make:</strong> ${vehicleInfo.make}</p>
            <p><strong>Model:</strong> ${vehicleInfo.model}</p>
            ${vehicleInfo.trim ? `<p><strong>Trim:</strong> ${vehicleInfo.trim}</p>` : ''}
            ${vehicleInfo.engine ? `<p><strong>Engine:</strong> ${vehicleInfo.engine}</p>` : ''}
          </div>
          
          ${sortedRecords.length > 0 ? `
            <div class="timeline">
              ${sortedRecords.map(record => `
                <div class="timeline-item">
                  <h4>${format(new Date(record.date), 'MMM d, yyyy')} - ${record.serviceType}</h4>
                  <p>${record.description}</p>
                  <p><small>Performed by: ${record.mechanic}</small></p>
                </div>
              `).join('')}
            </div>
          ` : `
            <p>No maintenance records available.</p>
          `}
          
          <div class="footer">
            Generated on ${format(new Date(), 'MMMM d, yyyy')} by ViaFix
          </div>
          
          <button onclick="window.print();return false;">Print Log</button>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
  };
  
  // Function to determine if a maintenance record addresses a recall
  const getRecallAssociation = (record: MaintenanceRecord) => {
    if (!record.nhtsaData?.recalls || record.nhtsaData.recalls.length === 0) {
      return null;
    }
    
    // Check if the service description mentions any recall component
    const serviceDescription = record.description.toLowerCase();
    const relatedRecalls = record.nhtsaData.recalls.filter(recall => {
      const component = recall.component.toLowerCase();
      return serviceDescription.includes(component);
    });
    
    return relatedRecalls.length > 0 ? relatedRecalls[0] : null;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Maintenance Timeline</h3>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={generateReport}
          >
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={printMaintenanceLog}
          >
            <Printer className="h-4 w-4" />
            <span>Print</span>
          </Button>
        </div>
      </div>
      
      {sortedRecords.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No maintenance records</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Start tracking your vehicle's maintenance history by adding service records.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Add Service Record</span>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <ScrollArea className="h-[400px] rounded-md border p-4">
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-muted-foreground/20" />
            
            <div className="space-y-8 relative">
              {sortedRecords.map((record, index) => {
                const formattedDate = format(new Date(record.date), 'MMM d, yyyy');
                const recallAssociation = getRecallAssociation(record);
                
                return (
                  <div key={record.id || index} className="relative pl-8">
                    <div className="absolute left-0 top-1 w-8 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{formattedDate}</span>
                        <span className="text-sm text-muted-foreground">
                          {record.serviceType}
                        </span>
                      </div>
                      
                      <p className="text-sm">{record.description}</p>
                      
                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                        <span>Performed by: {record.mechanic}</span>
                        {record.mechanicSignature && (
                          <span className="text-green-600">✓ Verified</span>
                        )}
                      </div>
                      
                      {recallAssociation && (
                        <div className="mt-2 flex items-start gap-2 text-xs bg-amber-50 text-amber-700 p-2 rounded border border-amber-200">
                          <FileText className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium">Addressed recall: {recallAssociation.campNo}</p>
                            <p>{recallAssociation.component}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default MaintenanceLog;
