import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';
import { Toaster } from './components/ui/toaster';
import { HelmetProvider } from 'react-helmet-async';
import { AuthGuard } from './components/auth/AuthGuard';
import { AuthProvider } from './contexts/AuthContext';
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
      <AuthProvider>
        <Router>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              
              {/* Protected routes */}
              <Route path="/mechanics" element={<AuthGuard><Mechanics /></AuthGuard>} />
              <Route path="/mechanics/:id" element={<AuthGuard><MechanicProfile /></AuthGuard>} />
              <Route path="/profile" element={<AuthGuard><CustomerProfile /></AuthGuard>} />
              <Route path="/customer/profile" element={<Navigate to="/profile" replace />} />
              <Route path="/mechanic-dashboard/*" element={<AuthGuard><MechanicDashboard /></AuthGuard>} />
              <Route path="/settings" element={<AuthGuard><AccountSettings /></AuthGuard>} />
              <Route path="/vehicle-safety-check" element={<AuthGuard><VehicleSafetyCheck /></AuthGuard>} />
              
              {/* Blog routes */}
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              
              {/* Other routes */}
              <Route path="/zipcode-test" element={<ZipcodeTest />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </Suspense>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
