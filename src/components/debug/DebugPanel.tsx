
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Database, Users } from 'lucide-react';
import { ClearDataButton } from './ClearDataButton';
import { TestAccountsGenerator } from './TestAccountsGenerator';

export const DebugPanel = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Database className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Debug Tools</h2>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Test Accounts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Create and login with pre-configured test accounts to quickly test different user flows.
          </p>
          <TestAccountsGenerator />
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
        </CardHeader>
        <CardContent>
          <ClearDataButton />
        </CardContent>
      </Card>
    </div>
  );
};
