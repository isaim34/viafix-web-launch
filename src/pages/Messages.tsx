
import React, { useState, useEffect } from 'react';
import { Layout } from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MechanicMailbox from '@/components/MechanicMailbox';
import { useAuth } from '@/hooks/useAuth';
import { ChatThreadsList } from '@/components/chat/ChatThreadsList';
import { AlertCircle, MessageSquare, Inbox, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getChatThreads } from '@/services/chat/threadService';
import { ChatThread } from '@/types/mechanic';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import ErrorBoundary from '@/ErrorBoundary';
import MechanicChat from '@/components/MechanicChat';

const Messages = () => {
  const { isLoggedIn, currentUserRole, user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("chat");  // Default to "chat" for customers
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showChatView, setShowChatView] = useState(false);
  const navigate = useNavigate();

  const currentUserId = user?.id || localStorage.getItem('userId') || 'anonymous';

  // Fetch chat threads when component mounts
  useEffect(() => {
    const fetchThreads = async () => {
      if (!isLoggedIn) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // For debugging
        console.log("Fetching threads for user:", currentUserId);
        
        const userThreads = await getChatThreads(currentUserId);
        console.log("Fetched threads:", userThreads);
        
        setThreads(userThreads);
      } catch (error) {
        console.error("Error fetching chat threads:", error);
        setError("Failed to load messages. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchThreads();
    } else {
      setIsLoading(false);
    }
  }, [isLoggedIn, currentUserId]);

  const handleSelectThread = (threadId: string) => {
    setSelectedThreadId(threadId);
    setShowChatView(true);
  };

  const handleBackToList = () => {
    setShowChatView(false);
  };

  const handleSignInClick = () => {
    navigate('/signin', { state: { redirectTo: '/messages' } });
  };

  // Show login required message if not logged in
  if (!isLoggedIn) {
    return (
      <Layout>
        <div className="container max-w-5xl py-8">
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Authentication required</AlertTitle>
            <AlertDescription className="flex flex-col gap-4">
              <p>Please sign in to access your messages.</p>
              <Button onClick={handleSignInClick} className="w-fit">
                Sign In
              </Button>
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
        
        <ErrorBoundary>
          {showChatView && selectedThreadId ? (
            <div className="space-y-4">
              <Button 
                variant="outline" 
                onClick={handleBackToList} 
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Messages
              </Button>
              
              <div className="bg-white rounded-lg border shadow-sm h-[600px]">
                <MechanicChat 
                  initialThreadId={selectedThreadId}
                  onBack={handleBackToList}
                />
              </div>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-6">
                {currentUserRole === 'mechanic' ? (
                  <>
                    <TabsTrigger value="inbox" className="flex items-center gap-2">
                      <Inbox className="h-4 w-4" />
                      Inbox
                    </TabsTrigger>
                    <TabsTrigger value="chat" className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Chat Messages
                    </TabsTrigger>
                  </>
                ) : (
                  // For customers, simplify to just "Messages" since they don't need mechanic-specific tabs
                  <TabsTrigger value="chat" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Messages
                  </TabsTrigger>
                )}
              </TabsList>
              
              {/* Mechanic-specific inbox tab */}
              {currentUserRole === 'mechanic' && (
                <TabsContent value="inbox">
                  <MechanicMailbox />
                </TabsContent>
              )}
              
              {/* Chat messages tab - available for both roles but with different presentation */}
              <TabsContent value="chat">
                {currentUserRole === 'mechanic' ? (
                  <div className="bg-white rounded-lg border shadow-sm">
                    <div className="p-4 border-b">
                      <h2 className="text-lg font-medium">Your Customer Conversations</h2>
                      <p className="text-sm text-muted-foreground">
                        Manage your conversations with customers here.
                      </p>
                    </div>
                    {error ? (
                      <Alert variant="destructive" className="m-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    ) : (
                      <ChatThreadsList 
                        threads={threads}
                        currentUserId={currentUserId}
                        onSelectThread={handleSelectThread}
                        selectedThreadId={selectedThreadId || undefined}
                        isLoading={isLoading}
                      />
                    )}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg border shadow-sm">
                    <div className="p-4 border-b">
                      <h2 className="text-lg font-medium">Your Mechanic Conversations</h2>
                      <p className="text-sm text-muted-foreground">
                        Contact and chat with mechanics about your vehicle repairs and maintenance here.
                      </p>
                    </div>
                    {error ? (
                      <Alert variant="destructive" className="m-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    ) : (
                      <ChatThreadsList 
                        threads={threads}
                        currentUserId={currentUserId}
                        onSelectThread={handleSelectThread}
                        selectedThreadId={selectedThreadId || undefined}
                        isLoading={isLoading}
                      />
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </ErrorBoundary>
      </div>
    </Layout>
  );
};

export default Messages;
