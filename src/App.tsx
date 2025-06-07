import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import LandingPage from '@/pages/LandingPage';
import MechanicsPage from '@/pages/MechanicsPage';
import ProfilePage from '@/pages/ProfilePage';
import NotFoundPage from '@/pages/NotFoundPage';
import MechanicDetailPage from '@/pages/MechanicDetailPage';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '@/components/ErrorFallback';
import { useAuth } from '@/contexts/AuthContext';
import LoadingPage from '@/pages/LoadingPage';
import ProtectedRoute from '@/components/ProtectedRoute';
import PublicOnlyRoute from '@/components/PublicOnlyRoute';
import LoginPage from '@/pages/LoginPage';
import RegistrationPage from '@/pages/RegistrationPage';
import PasswordResetPage from './pages/PasswordResetPage';
import PasswordUpdatePage from './pages/PasswordUpdatePage';
import PricingPage from './pages/PricingPage';
import SubscriptionSuccess from './pages/SubscriptionSuccess';
import SubscriptionCancel from './pages/SubscriptionCancel';
import CustomerPortal from './pages/CustomerPortal';
import QRTracking from '@/pages/QRTracking';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/mechanics" element={<MechanicsPage />} />
            
            <Route path="/login" element={
              <PublicOnlyRoute>
                <LoginPage />
              </PublicOnlyRoute>
            } />
            <Route path="/register" element={
              <PublicOnlyRoute>
                <RegistrationPage />
              </PublicOnlyRoute>
            } />
            <Route path="/reset-password" element={<PasswordResetPage />} />
            <Route path="/update-password" element={<PasswordUpdatePage />} />

            <Route path="/mechanics/:id" element={<MechanicDetailPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/subscription-success" element={<SubscriptionSuccess />} />
            <Route path="/subscription-cancel" element={<SubscriptionCancel />} />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/customer-portal" element={
              <ProtectedRoute>
                <CustomerPortal />
              </ProtectedRoute>
            } />

            <Route path="*" element={<NotFoundPage />} />
            <Route path="/qr-tracking" element={<QRTracking />} />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </div>
  );
}

export default App;
