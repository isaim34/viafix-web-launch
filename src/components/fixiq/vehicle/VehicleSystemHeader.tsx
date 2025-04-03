
import React from 'react';
import { CardTitle, CardDescription } from "@/components/ui/card";

const VehicleSystemHeader = () => {
  return (
    <div className="flex flex-col items-center py-6">
      <img 
        src="/lovable-uploads/489f7032-b400-43c3-a86b-2f163b4ca524.png"
        alt="FixIQ Logo"
        className="h-16 w-auto mb-6"
      />
      <div className="mt-2">
        <CardTitle className="text-3xl mb-2">Vehicle Intelligence System</CardTitle>
        <CardDescription className="text-lg max-w-2xl mx-auto">
          Intelligent maintenance tracking and safety monitoring for your vehicle
        </CardDescription>
      </div>
    </div>
  );
};

export default VehicleSystemHeader;
