
import React from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { AlertCircle } from 'lucide-react';

interface CancelledGig {
  id: string;
  title: string;
  customerName: string;
  date: string;
  reason: string;
}

// This would come from your backend in a real application
const sampleCancelledGigs: CancelledGig[] = [
  {
    id: '1',
    title: 'Oil Change Service',
    customerName: 'John Smith',
    date: '2025-03-15',
    reason: 'Customer found another service provider'
  },
  {
    id: '2',
    title: 'Brake Inspection',
    customerName: 'Sarah Wilson',
    date: '2025-03-10',
    reason: 'Schedule conflict'
  }
];

const CancelledGigsTab = () => {
  if (sampleCancelledGigs.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center text-center space-y-2">
          <AlertCircle className="h-8 w-8 text-muted-foreground" />
          <h3 className="font-semibold text-lg">No Cancelled Gigs</h3>
          <p className="text-muted-foreground">You don't have any cancelled gigs yet.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Service</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Reason</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sampleCancelledGigs.map((gig) => (
            <TableRow key={gig.id}>
              <TableCell>{gig.title}</TableCell>
              <TableCell>{gig.customerName}</TableCell>
              <TableCell>{new Date(gig.date).toLocaleDateString()}</TableCell>
              <TableCell>{gig.reason}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default CancelledGigsTab;
