
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import './App.css';

// Pages
import Index from './pages/Index';
import Mechanics from './pages/Mechanics';
import MechanicProfile from './pages/MechanicProfile';
import HowItWorks from './pages/HowItWorks';
import NotFound from './pages/NotFound';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import MechanicDashboard from './pages/MechanicDashboard';
import CustomerProfile from './pages/CustomerProfile';
import VehicleSafetyCheck from './pages/VehicleSafetyCheck';
import AccountSettings from './pages/AccountSettings';
import Debug from './pages/Debug';
import ZipcodeTest from './pages/ZipcodeTest';
import TwoFactorAuth from './pages/TwoFactorAuth';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Messages from './pages/Messages';
import Favorites from './pages/Favorites';

import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from './contexts/auth';
import { AuthGuard } from './components/auth/AuthGuard';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Helmet>
          <title>ViaFix - Mobile Mechanic Services</title>
          <meta name="description" content="Connect with skilled mobile mechanics for on-demand auto repair services." />
        </Helmet>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/mechanics" element={<Mechanics />} />
            <Route path="/mechanics/:id" element={<MechanicProfile />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/2fa" element={<TwoFactorAuth />} />
            
            {/* Messages page */}
            <Route path="/messages" element={<Messages />} />
            
            {/* Mechanic-specific routes */}
            <Route path="/mechanic-dashboard" element={
              <AuthGuard requiredRole="mechanic">
                <MechanicDashboard />
              </AuthGuard>
            } />
            
            {/* Customer-specific routes */}
            <Route path="/customer-profile" element={
              <AuthGuard requiredRole="customer">
                <CustomerProfile />
              </AuthGuard>
            } />
            <Route path="/vehicle-safety-check" element={
              <AuthGuard>
                <VehicleSafetyCheck />
              </AuthGuard>
            } />
            <Route path="/account-settings" element={
              <AuthGuard>
                <AccountSettings />
              </AuthGuard>
            } />
            
            {/* Add redirect from /profile to /customer-profile for backward compatibility */}
            <Route path="/profile" element={<Navigate to="/customer-profile" replace />} />
            
            {/* Debug Routes */}
            <Route path="/debug" element={<Debug />} />
            <Route path="/zipcode-test" element={<ZipcodeTest />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
