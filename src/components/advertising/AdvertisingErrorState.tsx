
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Tags, AlertCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AdvertisingErrorStateProps {
  error: string;
  onRefresh: () => void;
}

export const AdvertisingErrorState: React.FC<AdvertisingErrorStateProps> = ({
  error,
  onRefresh
}) => {
  const navigate = useNavigate();

  const handleQuickFix = () => {
    localStorage.setItem('userRole', 'mechanic');
    localStorage.setItem('pendingAuthRole', 'mechanic');
    localStorage.setItem('selectedRole', 'mechanic');
    
    supabase.auth.updateUser({
      data: {
        user_type: 'mechanic',
        role: 'mechanic'
      }
    }).then(({data, error}) => {
      if (error) {
        console.error("Error updating user metadata:", error);
      }
    });
    
    window.dispatchEvent(new Event('storage-event'));
    
    toast({
      title: "Role Updated",
      description: "Your user role has been set to 'mechanic' for testing purposes.",
    });
    
    onRefresh();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
            <Tags className="text-yellow-500" />
            Advertising &amp; Premium Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error accessing advertising options</AlertTitle>
            <AlertDescription className="flex flex-col gap-4">
              <p>{error}</p>
              <div className="flex flex-wrap gap-3 mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-fit" 
                  onClick={() => navigate('/signin?role=mechanic')}
                >
                  Sign In as Mechanic
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={onRefresh}
                >
                  <RefreshCw className="h-4 w-4" />
                  Retry Detection
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={handleQuickFix}
                >
                  Quick Fix (Set as Mechanic)
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};
