
import React from 'react';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import AccountSettingsForm from '@/components/settings/AccountSettingsForm';

const AccountSettings = () => {
  const auth = useAuth();
  const { currentUserRole } = auth;
  
  return (
    <Layout>
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
        <AccountSettingsForm userRole={currentUserRole} />
      </div>
    </Layout>
  );
};

export default AccountSettings;
