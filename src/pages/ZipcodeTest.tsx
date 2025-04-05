
import React from 'react';
import { Layout } from '@/components/Layout';
import ZipcodeTest from '@/components/ZipcodeTest';
import { Helmet } from 'react-helmet-async';

const ZipcodeTestPage = () => {
  return (
    <Layout>
      <Helmet>
        <title>Zipcode API Test | ViaFix</title>
        <meta name="description" content="Test the Zippopotam.us API for zipcode lookups" />
      </Helmet>
      <ZipcodeTest />
    </Layout>
  );
};

export default ZipcodeTestPage;
