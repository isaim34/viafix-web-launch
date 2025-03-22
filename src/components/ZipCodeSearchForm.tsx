
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from './Button';
import { Search, MapPin } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ZipCodeSearchFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ZipCodeSearchForm: React.FC<ZipCodeSearchFormProps> = ({ isOpen, onClose }) => {
  const [zipCode, setZipCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!zipCode.trim() || zipCode.length < 5) {
      toast({
        title: "Invalid Zip Code",
        description: "Please enter a valid 5-digit zip code",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate a search operation
    setTimeout(() => {
      setIsLoading(false);
      onClose();
      
      // Navigate to mechanics page with zip code as query parameter
      navigate(`/mechanics?zipCode=${zipCode}`);
      
      toast({
        title: "Search Successful",
        description: `Showing mechanics near ${zipCode}`,
      });
    }, 1000);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Find Mechanics Near You</DialogTitle>
          <DialogDescription>
            Enter your zip code to find available mechanics in your area.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSearch} className="space-y-4 py-4">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Enter zip code"
              className="pl-10"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value.slice(0, 5))}
              type="text"
              pattern="[0-9]*"
              inputMode="numeric"
              maxLength={5}
            />
          </div>
          
          <DialogFooter>
            <Button
              type="submit"
              isLoading={isLoading}
              icon={<Search className="w-4 h-4" />}
              className="w-full"
            >
              Find Mechanics
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
