
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';

interface CustomerVehicleCardProps {
  vehicle: any;
}

export const CustomerVehicleCard = ({ vehicle }: CustomerVehicleCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Customer Vehicle Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          <strong>Vehicle:</strong> {vehicle.year} {vehicle.make} {vehicle.model}
        </p>
        {vehicle.vin && (
          <p className="text-sm text-muted-foreground">
            <strong>VIN:</strong> {vehicle.vin}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
