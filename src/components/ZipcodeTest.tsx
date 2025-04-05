
import React, { useState } from 'react';
import { useZipcode } from '@/hooks/useZipcode';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, MapPin, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export const ZipcodeTest = () => {
  const [zipCode, setZipCode] = useState('');
  const [countryCode, setCountryCode] = useState('us');
  const { locationData, isLoading, error, fetchLocationData, reset } = useZipcode();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLocationData(zipCode, countryCode);
  };

  return (
    <div className="container max-w-3xl mx-auto my-8 p-4">
      <h1 className="text-2xl font-bold mb-6">Zipcode API Test</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="w-full sm:w-1/4">
            <Input
              placeholder="Country Code"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value.toLowerCase())}
              className="w-full"
              maxLength={2}
            />
          </div>
          <div className="flex-grow relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Enter zip code"
              className="pl-10"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              pattern="[0-9]*"
              inputMode="numeric"
              maxLength={10}
            />
          </div>
          <Button 
            type="submit" 
            disabled={isLoading || !zipCode.trim()} 
            className="whitespace-nowrap"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Test Zipcode'
            )}
          </Button>
        </div>
      </form>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error.message} {error.code === 'ZIPCODE_NOT_FOUND' && 'Please check the zipcode and country code.'}
          </AlertDescription>
        </Alert>
      )}

      {locationData && (
        <Card>
          <CardHeader>
            <CardTitle>
              {locationData.places[0]?.placeName || 'Location'}, {locationData.places[0]?.stateAbbreviation}
            </CardTitle>
            <CardDescription>
              Zipcode: {locationData.postCode} | Country: {locationData.country} ({locationData.countryAbbreviation})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h3 className="font-medium">Places in this zipcode:</h3>
              {locationData.places.map((place, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-md">
                  <h4 className="font-medium">{place.placeName}</h4>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">State:</span> {place.state} ({place.stateAbbreviation})
                    </div>
                    <div>
                      <span className="font-medium">Coordinates:</span> {place.latitude}, {place.longitude}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={reset}>Clear Results</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default ZipcodeTest;
