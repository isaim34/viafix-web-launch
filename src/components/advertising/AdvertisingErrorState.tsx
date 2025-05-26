
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Tags, AlertCircle, RefreshCw, LogIn } from 'lucide-react';
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

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.clear();
      toast({
        title: "Signed out",
        description: "You have been signed out. Please sign in again.",
      });
      navigate('/signin?role=mechanic');
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

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

  const isAuthError = error.includes("Authentication") || error.includes("sign in") || error.includes("Session expired");
  const isRoleError = error.includes("only available for mechanics");

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
            <AlertTitle>Access Issue</AlertTitle>
            <AlertDescription className="flex flex-col gap-4">
              <p>{error}</p>
              
              {isAuthError && (
                <div className="bg-red-50 p-3 rounded border border-red-200">
                  <p className="text-sm font-medium text-red-800 mb-2">Authentication Problem</p>
                  <p className="text-sm text-red-700">
                    Your session may have expired or there's an authentication issue. Try signing out and back in.
                  </p>
                </div>
              )}
              
              {isRoleError && (
                <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                  <p className="text-sm font-medium text-yellow-800 mb-2">Role Issue</p>
                  <p className="text-sm text-yellow-700">
                    You need to be signed in as a mechanic to access advertising features.
                  </p>
                </div>
              )}
              
              <div className="flex flex-wrap gap-3 mt-2">
                {isAuthError ? (
                  <>
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="flex items-center gap-2"
                      onClick={handleSignOut}
                    >
                      <LogIn className="h-4 w-4" />
                      Sign Out & Back In
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={onRefresh}
                    >
                      <RefreshCw className="h-4 w-4" />
                      Try Again
                    </Button>
                  </>
                ) : isRoleError ? (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-fit" 
                      onClick={() => navigate('/signin?role=mechanic')}
                    >
                      Sign In as Mechanic
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm" 
                      onClick={handleQuickFix}
                    >
                      Set Role to Mechanic
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="secondary" 
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={onRefresh}
                  >
                    <RefreshCw className="h-4 w-4" />
                    Retry Detection
                  </Button>
                )}
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};
