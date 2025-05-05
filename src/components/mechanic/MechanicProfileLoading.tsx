
import React from 'react';
import { Layout } from '@/components/Layout';
import { Loader2 } from 'lucide-react';

export const MechanicProfileLoading = () => {
  return (
    <Layout>
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    </Layout>
  );
};
