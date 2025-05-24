
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, User, Wrench } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export const ChatTestHelper = () => {
  const { isLoggedIn, currentUserRole, user } = useAuth();
  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testChatAccess = () => {
    if (!isLoggedIn) {
      addTestResult("❌ Not logged in - sign in required for messaging");
      toast.error("Please sign in to test messaging");
      return;
    }

    addTestResult(`✅ Logged in as ${currentUserRole} (${user?.email})`);
    
    if (currentUserRole === 'customer') {
      addTestResult("✅ Customer can access chat - go to /mechanics and click Contact on any mechanic");
    } else if (currentUserRole === 'mechanic') {
      addTestResult("✅ Mechanic can access chat - go to /messages to see customer conversations");
    } else {
      addTestResult("⚠️ Unknown role - may have limited chat access");
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  if (!isLoggedIn) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Chat Test Helper
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Sign in to test the messaging functionality
          </p>
          <Button 
            onClick={() => window.location.href = '/signin'}
            className="w-full"
          >
            Go to Sign In
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Chat Test Helper
          <Badge variant="outline" className="ml-auto">
            {currentUserRole === 'customer' ? (
              <><User className="h-3 w-3 mr-1" /> Customer</>
            ) : (
              <><Wrench className="h-3 w-3 mr-1" /> Mechanic</>
            )}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={testChatAccess} variant="outline">
            Test Chat Access
          </Button>
          <Button onClick={clearResults} variant="ghost" size="sm">
            Clear Results
          </Button>
        </div>

        {testResults.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Test Results:</h4>
            <div className="space-y-1">
              {testResults.map((result, index) => (
                <div key={index} className="text-sm font-mono">
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">Testing Instructions:</h4>
          <div className="space-y-2 text-sm">
            {currentUserRole === 'customer' ? (
              <>
                <div className="flex items-start gap-2">
                  <span className="font-medium">1.</span>
                  <span>Go to <code className="bg-gray-100 px-1 rounded">/mechanics</code> page</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-medium">2.</span>
                  <span>Click on any mechanic profile</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-medium">3.</span>
                  <span>Click the "Contact" or "Chat Now" button</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-medium">4.</span>
                  <span>Send a test message in the chat</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-medium">5.</span>
                  <span>Check <code className="bg-gray-100 px-1 rounded">/messages</code> to see your conversations</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start gap-2">
                  <span className="font-medium">1.</span>
                  <span>Go to <code className="bg-gray-100 px-1 rounded">/messages</code> page</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-medium">2.</span>
                  <span>Check the "Chat Messages" tab for customer conversations</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-medium">3.</span>
                  <span>Open a conversation to test sending replies</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-medium">4.</span>
                  <span>Test real-time updates by opening another browser window</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <h5 className="font-medium text-blue-900 mb-1">Quick Links:</h5>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => window.location.href = '/mechanics'}
            >
              Mechanics Page
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => window.location.href = '/messages'}
            >
              Messages Page
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
