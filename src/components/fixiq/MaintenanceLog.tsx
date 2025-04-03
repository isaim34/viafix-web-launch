
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
            onClick={() => window.print()}
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
