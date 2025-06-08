
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface VINInputFormProps {
  vin: string;
  onVINChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLookup: () => void;
  isDecoding: boolean;
  isSubscribed: boolean;
}

const VINInputForm = ({ vin, onVINChange, onLookup, isDecoding, isSubscribed }: VINInputFormProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="vin-lookup">Vehicle Identification Number (VIN)</Label>
      <div className="flex space-x-2">
        <Input
          id="vin-lookup"
          value={vin}
          onChange={onVINChange}
          placeholder="Enter 17-character VIN (try: 1HGBH41JXMN109186)"
          className="font-mono"
          maxLength={17}
          disabled={isDecoding}
        />
        <Button 
          type="button"
          onClick={onLookup}
          disabled={isDecoding || !vin || vin.length !== 17 || !isSubscribed}
        >
          {isDecoding ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            'Lookup'
          )}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        The VIN can be found on your vehicle registration, insurance card, or driver's side dashboard
      </p>
    </div>
  );
};

export default VINInputForm;
