
import React from 'react';
import { CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface VINLookupFooterProps {
  vin: string;
  onReset: () => void;
}

const VINLookupFooter = ({ vin, onReset }: VINLookupFooterProps) => {
  const handleNHTSALink = () => {
    window.open(`https://www.nhtsa.gov/recalls?vin=${vin}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <CardFooter className="flex justify-between border-t pt-6">
      <Button variant="outline" onClick={onReset}>
        Check Another Vehicle
      </Button>
      <Button 
        variant="outline" 
        className="flex items-center gap-2"
        onClick={handleNHTSALink}
      >
        NHTSA Recall Lookup 
        <ExternalLink className="h-4 w-4" />
      </Button>
    </CardFooter>
  );
};

export default VINLookupFooter;
