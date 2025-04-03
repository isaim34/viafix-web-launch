
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, X, Calendar, Car, Wrench, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MaintenanceRecord } from '@/types/customer';

interface MaintenanceRecordTableProps {
  records: MaintenanceRecord[];
  isMechanic: boolean;
  onViewRecord: (record: MaintenanceRecord) => void;
  onDeleteRecord: (id: string) => void;
}

const MaintenanceRecordTable = ({ 
  records, 
  isMechanic, 
  onViewRecord, 
  onDeleteRecord 
}: MaintenanceRecordTableProps) => {
  
  const hasRecalls = (record: MaintenanceRecord) => {
    return record.nhtsaData?.recalls && record.nhtsaData.recalls.length > 0;
  };
  
  return (
    <ScrollArea className="h-[400px] rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Vehicle</TableHead>
            <TableHead>Service Type</TableHead>
            <TableHead>Mechanic</TableHead>
            <TableHead>Safety</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {record.date}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  {record.vehicle}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="outline">{record.serviceType}</Badge>
                </div>
              </TableCell>
              <TableCell>{record.mechanic}</TableCell>
              <TableCell>
                {hasRecalls(record) ? (
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <ShieldAlert className="h-3 w-3" />
                    Recalls
                  </Badge>
                ) : record.vin ? (
                  <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                    Checked
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-gray-500">
                    No VIN
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onViewRecord(record)}
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {!isMechanic && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onDeleteRecord(record.id!)}
                      title="Delete Record"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export default MaintenanceRecordTable;
