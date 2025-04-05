
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Index from './pages/Index';
import Mechanics from './pages/Mechanics';
import MechanicProfile from './pages/MechanicProfile';
import CustomerProfile from './pages/CustomerProfile';
import MechanicDashboard from './pages/MechanicDashboard';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import TwoFactorAuth from './pages/TwoFactorAuth';
import NotFound from './pages/NotFound';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import VehicleSafetyCheck from './pages/VehicleSafetyCheck';
import HowItWorks from './pages/HowItWorks';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import ZipcodeTest from './pages/ZipcodeTest';
import { Toaster } from './components/ui/toaster';
import { HelmetProvider } from 'react-helmet-async';
import './App.css';

function App() {
  return (
    <HelmetProvider>
      <Router>
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
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </HelmetProvider>
  );
}

export default App;
