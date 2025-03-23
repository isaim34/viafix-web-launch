
import React from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const PaymentMethodsEmptyState: React.FC = () => {
  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle>No Payment Methods</CardTitle>
        <CardDescription>
          Add a payment method to subscribe to featured listings or send mass messages
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default PaymentMethodsEmptyState;
