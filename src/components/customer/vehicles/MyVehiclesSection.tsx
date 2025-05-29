
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, AlertTriangle, Calendar, Plus } from 'lucide-react';
import { useMyVehicles } from './useMyVehicles';
import { VehicleCard } from './VehicleCard';

export const MyVehiclesSection = () => {
  const { vehicles, loading, addVehicle } = useMyVehicles();

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-48 rounded-lg"></div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            My Vehicles
          </CardTitle>
          <Button onClick={() => addVehicle()} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Vehicle
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {vehicles.length === 0 ? (
          <div className="text-center py-8">
            <Car className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles added yet</h3>
            <p className="text-gray-500 mb-4">Add your vehicles to track maintenance history and get personalized recommendations.</p>
            <Button onClick={() => addVehicle()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Vehicle
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
