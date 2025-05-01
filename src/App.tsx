import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Toaster } from './components/ui/toaster';
import { HelmetProvider } from 'react-helmet-async';
import { AuthGuard } from './components/auth/AuthGuard';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './ErrorBoundary';
import './App.css';

// Import core pages directly for immediate loading
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Debug from './pages/Debug';

// Lazy load other pages for better performance
const Mechanics = lazy(() => import('./pages/Mechanics'));
const MechanicProfile = lazy(() => import('./pages/MechanicProfile'));
const CustomerProfile = lazy(() => import('./pages/CustomerProfile'));
const MechanicDashboard = lazy(() => import('./pages/MechanicDashboard'));
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
  // Add debug logging
  useEffect(() => {
    console.log("App component mounted");
    return () => console.log("App component unmounted");
  }, []);

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <ErrorBoundary>
          <AuthProvider>
            <Router>
              <Suspense fallback={<PageLoader />}>
                <ErrorBoundary>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={
                      <ErrorBoundary fallback={
                        <div className="flex flex-col items-center justify-center min-h-screen p-4">
                          <h1 className="text-2xl font-bold text-red-600">Error loading homepage</h1>
                          <p className="text-gray-600 mt-2">Please refresh the page to try again</p>
                        </div>
                      }>
                        <Index />
                      </ErrorBoundary>
                    } />
                    <Route path="/signin" element={<Signin />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/how-it-works" element={<HowItWorks />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/debug" element={<Debug />} />
                    
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
                </ErrorBoundary>
                <Toaster />
              </Suspense>
            </Router>
          </AuthProvider>
        </ErrorBoundary>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
