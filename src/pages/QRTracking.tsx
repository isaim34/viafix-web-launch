
import React from 'react';
import { Layout } from '@/components/Layout';
import QRCodeGenerator from '@/components/QRCodeGenerator';

const QRTracking = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              QR Code Tracking System
            </h1>
            <p className="text-lg text-gray-600">
              Generate trackable QR codes for your marketing materials
            </p>
          </div>
          
          <QRCodeGenerator />
        </div>
      </div>
    </Layout>
  );
};

export default QRTracking;
