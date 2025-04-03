
import React from 'react';
import { Layout } from '@/components/Layout';
import { Helmet } from 'react-helmet-async';
import VINLookupTool from '@/components/customer/VINLookupTool';
import { FileQuestion, Shield, ShieldAlert, RefreshCw } from 'lucide-react';

const VehicleSafetyCheck = () => {
  return (
    <Layout>
      <Helmet>
        <title>Vehicle Safety Check | ViaFix | Austin, TX</title>
        <meta 
          name="description" 
          content="Check your vehicle for safety recalls, complaints, and investigations using our free VIN lookup tool powered by NHTSA data." 
        />
        <meta 
          name="keywords" 
          content="vehicle safety check, VIN lookup, NHTSA recalls, auto safety, car recalls, vehicle complaints" 
        />
        <link rel="canonical" href="https://tryviafix.com/vehicle-safety-check" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Vehicle Safety Check</h1>
            <p className="text-gray-600 text-lg">
              Check if your vehicle has any recalls, complaints, or safety investigations
            </p>
          </div>
          
          <VINLookupTool />
          
          <div className="mt-12 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg border flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <ShieldAlert className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Recall Information</h3>
                <p className="text-gray-600 text-sm">
                  Check if your vehicle has any safety recalls that need to be addressed.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <FileQuestion className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Vehicle Complaints</h3>
                <p className="text-gray-600 text-sm">
                  View complaints submitted by other owners with the same vehicle model.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Safety Investigations</h3>
                <p className="text-gray-600 text-sm">
                  Learn about ongoing safety investigations related to your vehicle.
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg border">
              <h2 className="text-2xl font-bold mb-4">Why Check Your Vehicle Safety?</h2>
              <p className="mb-4">
                The National Highway Traffic Safety Administration (NHTSA) collects data on vehicle safety issues, 
                including manufacturer recalls, owner complaints, and safety investigations. This information 
                is critical for vehicle owners to ensure their vehicles are safe to drive.
              </p>
              <p className="mb-4">
                ViaFix provides this free tool to help you access this important safety information. By entering 
                your Vehicle Identification Number (VIN), you can quickly check if your vehicle has any open 
                recalls that require attention.
              </p>
              <div className="flex items-start mt-6">
                <RefreshCw className="h-5 w-5 text-primary mr-3 mt-0.5" />
                <p className="text-sm text-gray-600">
                  <strong>How often should I check?</strong> We recommend checking your vehicle at least twice a year, 
                  or whenever you hear about a recall for your make and model in the news. All recall repairs 
                  are performed by authorized dealers at no cost to the vehicle owner.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VehicleSafetyCheck;
