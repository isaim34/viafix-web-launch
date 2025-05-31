
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/auth';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { HelmetProvider } from 'react-helmet-async';
import { CommentProvider } from '@/contexts/CommentContext';
import { useAuth } from '@/hooks/useAuth';
import ErrorBoundary from '@/components/ErrorBoundary';

// Page imports
import Index from '@/pages/Index';
import Signin from '@/pages/Signin';
import Signup from '@/pages/Signup';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import TwoFactorAuth from '@/pages/TwoFactorAuth';
import Mechanics from '@/pages/Mechanics';
import MechanicProfile from '@/pages/MechanicProfile';
import MechanicDashboard from '@/pages/MechanicDashboard';
import CustomerProfile from '@/pages/CustomerProfile';
import AccountSettings from '@/pages/AccountSettings';
import VehicleSafetyCheck from '@/pages/VehicleSafetyCheck';
import Messages from '@/pages/Messages';
import Favorites from '@/pages/Favorites';
import Blog from '@/pages/Blog';
import BlogPost from '@/pages/BlogPost';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
import HowItWorks from '@/pages/HowItWorks';
import NotFound from '@/pages/NotFound';
import ZipcodeTest from '@/pages/ZipcodeTest';

import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

function AppContent() {
  const { user, currentUserName, isLoggedIn } = useAuth();
  
  return (
    <ErrorBoundary>
      <CommentProvider 
        postSlug="" 
        currentUserId={user?.id || ''} 
        currentUserName={currentUserName || ''} 
        isLoggedIn={isLoggedIn}
      >
        <Routes>
          <Route path="/" element={
            <ErrorBoundary fallback={<div className="p-8 text-center">Unable to load homepage</div>}>
              <Index />
            </ErrorBoundary>
          } />
          <Route path="/signin" element={
            <ErrorBoundary fallback={<div className="p-8 text-center">Unable to load sign in page</div>}>
              <Signin />
            </ErrorBoundary>
          } />
          <Route path="/signup" element={
            <ErrorBoundary fallback={<div className="p-8 text-center">Unable to load sign up page</div>}>
              <Signup />
            </ErrorBoundary>
          } />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/two-factor-auth" element={<TwoFactorAuth />} />
          <Route path="/mechanics" element={
            <ErrorBoundary fallback={<div className="p-8 text-center">Unable to load mechanics page</div>}>
              <Mechanics />
            </ErrorBoundary>
          } />
          <Route path="/mechanics/:id" element={
            <ErrorBoundary fallback={<div className="p-8 text-center">Unable to load mechanic profile</div>}>
              <MechanicProfile />
            </ErrorBoundary>
          } />
          <Route path="/mechanic/:id" element={
            <ErrorBoundary fallback={<div className="p-8 text-center">Unable to load mechanic profile</div>}>
              <MechanicProfile />
            </ErrorBoundary>
          } />
          <Route path="/mechanic-dashboard" element={
            <ErrorBoundary fallback={<div className="p-8 text-center">Unable to load dashboard</div>}>
              <MechanicDashboard />
            </ErrorBoundary>
          } />
          <Route path="/customer-profile" element={
            <ErrorBoundary fallback={<div className="p-8 text-center">Unable to load customer profile</div>}>
              <CustomerProfile />
            </ErrorBoundary>
          } />
          <Route path="/account-settings" element={<AccountSettings />} />
          <Route path="/vehicle-safety-check" element={<VehicleSafetyCheck />} />
          <Route path="/messages" element={
            <ErrorBoundary fallback={<div className="p-8 text-center">Unable to load messages</div>}>
              <Messages />
            </ErrorBoundary>
          } />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/zipcode-test" element={<ZipcodeTest />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
        <Sonner />
      </CommentProvider>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <ErrorBoundary onError={(error, errorInfo) => {
      console.error('Global error caught:', error, errorInfo);
    }}>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <Router>
            <ErrorBoundary>
              <AuthProvider>
                <ErrorBoundary>
                  <NotificationProvider>
                    <AppContent />
                  </NotificationProvider>
                </ErrorBoundary>
              </AuthProvider>
            </ErrorBoundary>
          </Router>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
