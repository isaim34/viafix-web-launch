
import React from 'react';
import { MessageCircle } from 'lucide-react';
import ErrorBoundary from '@/ErrorBoundary';

interface ChatLayoutProps {
  title?: string;
  userRole?: string;
  error: string | null;
  onRetry: () => void;
  isFullHeight?: boolean;
  children: React.ReactNode;
}

const ChatLayout = ({
  title = 'Messages',
  userRole,
  error,
  onRetry,
  isFullHeight = true,
  children
}: ChatLayoutProps) => {
  const heightClass = isFullHeight ? 'h-[600px]' : '';
  
  return (
    <ErrorBoundary fallback={
      <div className="bg-white rounded-lg border h-[600px] p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-2">Error loading chat</p>
          <button 
            onClick={onRetry} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    }>
      <div className={`bg-white rounded-lg border overflow-hidden ${heightClass}`}>
        {error && (
          <div className="p-4 bg-red-50 text-red-500 text-sm border-b">
            {error}
            <button 
              onClick={onRetry}
              className="ml-2 underline text-blue-500"
            >
              Retry
            </button>
          </div>
        )}
        {children}
      </div>
    </ErrorBoundary>
  );
};

export default ChatLayout;
