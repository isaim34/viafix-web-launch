
import React from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { AlertCircle } from 'lucide-react';

const CancelledGigsTab = () => {
  // In production, this would fetch real cancelled bookings/offers from the database
  // For now, we show an empty state
  const cancelledGigs: any[] = [];

  return (
    <Card className="p-6">
      <div className="flex flex-col items-center justify-center text-center space-y-2">
        <AlertCircle className="h-8 w-8 text-muted-foreground" />
        <h3 className="font-semibold text-lg">No Cancelled Gigs</h3>
        <p className="text-muted-foreground">You don't have any cancelled gigs yet.</p>
      </div>
    </Card>
  );
};

export default CancelledGigsTab;
