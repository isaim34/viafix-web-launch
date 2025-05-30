
import React from 'react';
import { Layout } from "@/components/Layout";
import MessagesContent from '@/components/messages/MessagesContent';

const Messages = () => {
  return (
    <Layout>
      <div className="container max-w-5xl py-8">
        <MessagesContent />
      </div>
    </Layout>
  );
};

export default Messages;
