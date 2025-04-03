
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ExternalLink, AlertCircle, MapPin } from 'lucide-react';
import { VehicleInfo, Recall } from '@/services/nhtsa';

interface DealerReferralsProps {
  vehicleInfo: VehicleInfo;
  recalls: Recall[];
}

const DealerReferrals = ({ vehicleInfo, recalls }: DealerReferralsProps) => {
  const hasRecalls = recalls.length > 0;
  
  // Mock function to find nearby dealers (would connect to a real API in production)
  const findNearbyDealers = () => {
    // In a real implementation, this would use geolocation and an API to find dealers
    const mockDealerUrl = `https://www.${vehicleInfo.make.toLowerCase()}.com/dealers`;
    window.open(mockDealerUrl, '_blank', 'noopener,noreferrer');
  };
  
  return (
    <div className="space-y-6">
      {hasRecalls && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Recall Service Required</AlertTitle>
          <AlertDescription>
            Your vehicle has {recalls.length} active recall{recalls.length !== 1 ? 's' : ''} that require service at an authorized dealership.
            Recall repairs are performed free of charge by authorized dealers.
          </AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Authorized {vehicleInfo.make} Dealers</CardTitle>
          <CardDescription>
            Find an authorized dealer to perform recall repairs or warranty work
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm">
              {hasRecalls 
                ? "The following recalls must be addressed at an authorized dealership:" 
                : "Although your vehicle has no active recalls, you may still need an authorized dealer for warranty service."}
            </p>
            
            {hasRecalls && (
              <div className="space-y-3 my-4">
                {recalls.map((recall, index) => (
                  <div key={recall.id || index} className="border-l-4 border-red-500 pl-3 py-1">
                    <p className="font-medium text-sm">{recall.component}</p>
                    <p className="text-xs text-muted-foreground">{recall.summary}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={findNearbyDealers}
          >
            <MapPin className="h-4 w-4" />
            <span>Find Nearby Dealers</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => window.open(`https://www.nhtsa.gov/recalls?vin=${vehicleInfo.vin || ''}`, '_blank', 'noopener,noreferrer')}
          >
            <ExternalLink className="h-4 w-4" />
            <span>NHTSA Recall Info</span>
          </Button>
        </CardFooter>
      </Card>
      
      <div className="text-sm text-muted-foreground">
        <p>Recall repairs are always free of charge at authorized dealers. Contact your local dealership for more information.</p>
      </div>
    </div>
  );
};

export default DealerReferrals;
