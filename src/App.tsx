
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import QRTracking from '@/pages/QRTracking';
import QRWelcome from '@/pages/QRWelcome';

function App() {
  return (
    <div className="min-h-screen bg-background">
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
          <Route path="/qr-welcome" element={<QRWelcome />} />
          <Route path="/mechanics" element={
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Mechanics Directory
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  Find trusted mechanics in your area
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl">
                  {/* Sample mechanic cards */}
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white p-6 rounded-lg shadow-md">
                      <h3 className="font-semibold text-lg mb-2">Mechanic {i}</h3>
                      <p className="text-gray-600 mb-2">⭐ 4.{i + 2}/5 rating</p>
                      <p className="text-gray-600 mb-4">${40 + i * 5}/hour</p>
                      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                        Contact Mechanic
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          } />
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
    </div>
  );
}

export default App;
