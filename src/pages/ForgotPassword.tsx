
import React from 'react';
import { Layout } from '@/components/Layout';
import { motion } from 'framer-motion';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

const ForgotPassword = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          <div className="border p-6 rounded-lg shadow-sm bg-gray-50">
            <ForgotPasswordForm />
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
