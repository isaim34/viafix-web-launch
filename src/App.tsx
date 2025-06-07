
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '@/components/ErrorFallback';
import QRTracking from '@/pages/QRTracking';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    QR Code Tracking System
                  </h1>
                  <p className="text-lg text-gray-600 mb-8">
                    Generate and track QR codes for your marketing materials
                  </p>
                  <a 
                    href="/qr-tracking" 
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Go to QR Tracking
                  </a>
                </div>
              </div>
            } />
            <Route path="/qr-tracking" element={<QRTracking />} />
            <Route path="*" element={
              <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-xl text-gray-600 mb-8">Page not found</p>
                  <a 
                    href="/" 
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Go Home
                  </a>
                </div>
              </div>
            } />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </div>
  );
}

export default App;
