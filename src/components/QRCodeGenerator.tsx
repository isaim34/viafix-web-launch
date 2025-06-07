
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink, BarChart3 } from 'lucide-react';

const QRCodeGenerator = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [functionUrl, setFunctionUrl] = useState('');

  useEffect(() => {
    // The public URL of our edge function
    const edgeFunctionUrl = 'https://npwxxmboagkouafjwhhw.functions.supabase.co/qr-redirect';
    setFunctionUrl(edgeFunctionUrl);
    
    // Generate QR code using QR Server API (free, high-quality)
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=800x800&format=png&data=${encodeURIComponent(edgeFunctionUrl)}&ecc=M&margin=10`;
    setQrCodeUrl(qrUrl);
  }, []);

  const downloadQRCode = async () => {
    try {
      // Generate high-resolution QR code for print (1200x1200)
      const highResUrl = `https://api.qrserver.com/v1/create-qr-code/?size=1200x1200&format=png&data=${encodeURIComponent(functionUrl)}&ecc=H&margin=20`;
      
      const response = await fetch(highResUrl);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'viafix-qr-code-print.png';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading QR code:', error);
    }
  };

  const openFunctionUrl = () => {
    window.open(functionUrl, '_blank');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            QR Code Tracking System
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Your QR Code</h3>
            <p className="text-sm text-gray-600 mb-4">
              This QR code redirects to tryviafix.com and tracks each scan
            </p>
            
            {qrCodeUrl && (
              <div className="inline-block p-4 bg-white border rounded-lg shadow-sm">
                <img 
                  src={qrCodeUrl} 
                  alt="QR Code for ViaFix" 
                  className="w-64 h-64 mx-auto"
                />
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Edge Function URL:
              </label>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-2 bg-gray-100 rounded text-sm break-all">
                  {functionUrl}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openFunctionUrl}
                  className="flex items-center gap-1"
                >
                  <ExternalLink className="h-4 w-4" />
                  Test
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={downloadQRCode}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download High-Res QR Code (1200x1200)
              </Button>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Print Specifications:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• High resolution: 1200x1200 pixels</li>
                <li>• Print size: Up to 4"×4" at 300 DPI</li>
                <li>• Error correction: High (survives up to 30% damage)</li>
                <li>• Format: PNG with transparent background capability</li>
              </ul>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">How it works:</h4>
              <ol className="text-sm text-green-800 space-y-1">
                <li>1. User scans QR code with their phone</li>
                <li>2. Scan is logged to the database with timestamp</li>
                <li>3. User is redirected to https://tryviafix.com</li>
                <li>4. You can track all scans in your Supabase dashboard</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRCodeGenerator;
