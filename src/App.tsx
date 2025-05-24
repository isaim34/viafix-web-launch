
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/auth';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { HelmetProvider } from 'react-helmet-async';
import { CommentProvider } from '@/contexts/CommentContext';

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
import Debug from '@/pages/Debug';
import ZipcodeTest from '@/pages/ZipcodeTest';

import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthProvider>
            <NotificationProvider>
              <CommentProvider>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/signin" element={<Signin />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/two-factor-auth" element={<TwoFactorAuth />} />
                  <Route path="/mechanics" element={<Mechanics />} />
                  <Route path="/mechanic/:id" element={<MechanicProfile />} />
                  <Route path="/mechanic-dashboard" element={<MechanicDashboard />} />
                  <Route path="/customer-profile" element={<CustomerProfile />} />
                  <Route path="/account-settings" element={<AccountSettings />} />
                  <Route path="/vehicle-safety-check" element={<VehicleSafetyCheck />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/how-it-works" element={<HowItWorks />} />
                  <Route path="/debug" element={<Debug />} />
                  <Route path="/zipcode-test" element={<ZipcodeTest />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
                <Sonner />
              </CommentProvider>
            </NotificationProvider>
          </AuthProvider>
        </Router>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
