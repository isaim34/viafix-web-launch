
import React, { useState } from 'react';
import { Layout } from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MechanicMailbox from '@/components/MechanicMailbox';
import { useAuth } from '@/contexts/auth';
import { ChatThreadsList } from '@/components/chat/ChatThreadsList';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const Messages = () => {
  const { isLoggedIn, currentUserRole } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("inbox");

  // Show login required message if not logged in
  if (!isLoggedIn) {
    return (
      <Layout>
        <div className="container max-w-5xl py-8">
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Authentication required</AlertTitle>
            <AlertDescription>
              Please sign in to access your messages.
            </AlertDescription>
          </Alert>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container max-w-5xl py-8">
        <h1 className="text-3xl font-bold mb-6">Messages</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="inbox">Inbox</TabsTrigger>
            <TabsTrigger value="chat">Chat Messages</TabsTrigger>
          </TabsList>
          
          <TabsContent value="inbox">
            <MechanicMailbox />
          </TabsContent>
          
          <TabsContent value="chat">
            {currentUserRole === 'mechanic' ? (
              <ChatThreadsList />
            ) : (
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <h3 className="text-lg font-medium mb-2">Your Chat Messages</h3>
                <p className="text-gray-500">
                  View and manage your conversations with mechanics here.
                </p>
                <ChatThreadsList />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Messages;
