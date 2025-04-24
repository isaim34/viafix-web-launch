import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';
import { Toaster } from './components/ui/toaster';
import { HelmetProvider } from 'react-helmet-async';
import './App.css';

// Import core pages directly for immediate loading
import Index from './pages/Index';
import NotFound from './pages/NotFound';

// Lazy load other pages for better performance
const Mechanics = lazy(() => import('./pages/Mechanics'));
const MechanicProfile = lazy(() => import('./pages/MechanicProfile'));
const CustomerProfile = lazy(() => import('./pages/CustomerProfile'));
const MechanicDashboard = lazy(() => import('./pages/MechanicDashboard'));
const Signin = lazy(() => import('./pages/Signin'));
const Signup = lazy(() => import('./pages/Signup'));
const TwoFactorAuth = lazy(() => import('./pages/TwoFactorAuth'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const VehicleSafetyCheck = lazy(() => import('./pages/VehicleSafetyCheck'));
const HowItWorks = lazy(() => import('./pages/HowItWorks'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const ZipcodeTest = lazy(() => import('./pages/ZipcodeTest'));
const AccountSettings = lazy(() => import('./pages/AccountSettings'));

// Loading component for Suspense fallback
const PageLoader = () => (
  <div className="flex items-center justify-center h-screen">
    <Loader2 className="h-12 w-12 animate-spin text-primary" />
    <span className="ml-2 text-xl">Loading...</span>
  </div>
);

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/mechanics" element={<Mechanics />} />
            <Route path="/mechanics/:id" element={<MechanicProfile />} />
            <Route path="/profile" element={<CustomerProfile />} />
            <Route path="/customer/profile" element={<Navigate to="/profile" replace />} />
            
            {/* How It Works page */}
            <Route path="/how-it-works" element={<HowItWorks />} />
            
            {/* Terms of Service Page */}
            <Route path="/terms" element={<Terms />} />
            
            {/* Privacy Policy Page */}
            <Route path="/privacy" element={<Privacy />} />
            
            {/* Zipcode Test Page */}
            <Route path="/zipcode-test" element={<ZipcodeTest />} />
            
            {/* Mechanic Dashboard Routes - Handle all possible variations */}
            <Route path="/mechanic-dashboard" element={<MechanicDashboard />} />
            <Route path="/mechanic-dashboard/*" element={<MechanicDashboard />} />
            <Route path="/mechanic/dashboard" element={<Navigate to="/mechanic-dashboard" replace />} />
            <Route path="/mechanic/dashboard/*" element={<Navigate to="/mechanic-dashboard" replace />} />
            
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/two-factor-auth" element={<TwoFactorAuth />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/vehicle-safety-check" element={<VehicleSafetyCheck />} />
            <Route path="/settings" element={<AccountSettings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </Suspense>
      </Router>
    </HelmetProvider>
  );
}

export default App;
