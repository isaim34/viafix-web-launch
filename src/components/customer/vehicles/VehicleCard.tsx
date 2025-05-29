
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Car, AlertTriangle, Calendar, Wrench, FileText } from 'lucide-react';
import { CustomerVehicle } from './useMyVehicles';

interface VehicleCardProps {
  vehicle: CustomerVehicle;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  const getNextServiceRecommendation = () => {
    if (!vehicle.lastService) return 'Schedule your first service';
    
    const daysSinceService = Math.floor(
      (Date.now() - new Date(vehicle.lastService.date).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceService > 90) return 'Overdue for service check';
    if (daysSinceService > 60) return 'Service check recommended';
    return 'Up to date';
  };

  const getServiceBadgeColor = () => {
    if (!vehicle.lastService) return 'bg-gray-500';
    
    const daysSinceService = Math.floor(
      (Date.now() - new Date(vehicle.lastService.date).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceService > 90) return 'bg-red-500';
    if (daysSinceService > 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Car className="h-5 w-5 text-blue-600" />
            <div>
              <h3 className="font-medium">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h3>
              {vehicle.vin && (
                <p className="text-xs text-gray-500">VIN: {vehicle.vin}</p>
              )}
            </div>
          </div>
          {vehicle.isPrimary && (
            <Badge variant="outline" className="text-xs">Primary</Badge>
          )}
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Maintenance Records:</span>
            <span className="font-medium">{vehicle.maintenanceCount}</span>
          </div>
          
          {vehicle.recallCount > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-red-600">{vehicle.recallCount} active recalls</span>
            </div>
          )}
          
          {vehicle.lastService && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">
                Last service: {new Date(vehicle.lastService.date).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mb-3">
          <Badge className={`${getServiceBadgeColor()} text-white text-xs`}>
            {getNextServiceRecommendation()}
          </Badge>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <FileText className="h-3 w-3 mr-1" />
            View History
          </Button>
          <Button size="sm" className="flex-1">
            <Wrench className="h-3 w-3 mr-1" />
            Book Service
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
