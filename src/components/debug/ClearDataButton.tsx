
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { clearAllTestData, clearIsaiMercadoData } from '@/utils/clearTestData';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export const ClearDataButton = () => {
  const { toast } = useToast();
  const { signOut } = useAuth();

  const handleClearAll = async () => {
    try {
      // Sign out first if logged in
      await signOut();
      
      // Clear all local data
      clearAllTestData();
      
      toast({
        title: "Data Cleared",
        description: "All test data has been cleared from localStorage",
      });
      
      // Reload the page to ensure clean state
      window.location.reload();
    } catch (error) {
      console.error('Error clearing data:', error);
      toast({
        title: "Error",
        description: "Failed to clear all data",
        variant: "destructive"
      });
    }
  };

  const handleClearIsaiData = async () => {
    try {
      // Clear Isai Mercado specific data thoroughly
      clearIsaiMercadoData();
      
      toast({
        title: "Isai Mercado Data Cleared",
        description: "All data associated with Isai Mercado has been cleared completely",
      });
      
      // Refresh the page to see changes
      window.location.reload();
    } catch (error) {
      console.error('Error clearing Isai data:', error);
      toast({
        title: "Error",
        description: "Failed to clear Isai Mercado data",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex flex-col gap-3 p-4 border rounded-lg">
      <h3 className="font-medium text-lg">Clear Test Data</h3>
      <div className="flex gap-2">
        <Button 
          onClick={handleClearIsaiData}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Clear Isai Mercado Data
        </Button>
        
        <Button 
          onClick={handleClearAll}
          variant="destructive"
          size="sm"
          className="flex items-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Clear All Data
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Use these buttons to clear test data and start fresh. "Clear All Data" will sign you out and clear everything.
      </p>
    </div>
  );
};
