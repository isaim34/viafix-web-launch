
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const PaymentSecurityInfo: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>About Payment Processing</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
              <CheckCircle className="h-3 w-3 text-primary" />
            </div>
            <span>All payment information is securely stored and processed</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
              <CheckCircle className="h-3 w-3 text-primary" />
            </div>
            <span>Your default payment method will be used for subscription renewals</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
              <CheckCircle className="h-3 w-3 text-primary" />
            </div>
            <span>You can update or remove payment methods at any time</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default PaymentSecurityInfo;
