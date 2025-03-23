
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PaymentMethod } from '@/types/mechanic';
import { PlusCircle } from 'lucide-react';
import { PaymentMethodForm } from './PaymentMethodForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import PaymentMethodCard from './PaymentMethodCard';
import PaymentSecurityInfo from './PaymentSecurityInfo';
import PaymentMethodsEmptyState from './PaymentMethodsEmptyState';

// Sample payment methods for now
const initialPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'card',
    last4: '4242',
    brand: 'Visa',
    expiryMonth: 12,
    expiryYear: 2025,
    isDefault: true
  },
  {
    id: '2',
    type: 'card',
    last4: '1234',
    brand: 'Mastercard',
    expiryMonth: 10,
    expiryYear: 2024,
    isDefault: false
  }
];

const PaymentMethodsTab: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(initialPaymentMethods);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();
  
  const handleAddMethod = (newMethod: PaymentMethod) => {
    // If the new method is default, update all others
    let updatedMethods = paymentMethods;
    if (newMethod.isDefault) {
      updatedMethods = paymentMethods.map(method => ({
        ...method,
        isDefault: false
      }));
    }
    
    setPaymentMethods([...updatedMethods, newMethod]);
    setShowAddForm(false);
    
    toast({
      title: "Payment method added",
      description: `${newMethod.brand} •••• ${newMethod.last4} has been added to your account.`,
    });
  };
  
  const handleRemoveMethod = (id: string) => {
    const methodToRemove = paymentMethods.find(m => m.id === id);
    
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
    
    toast({
      title: "Payment method removed",
      description: `${methodToRemove?.brand} •••• ${methodToRemove?.last4} has been removed.`,
    });
  };
  
  const setDefaultMethod = (id: string) => {
    setPaymentMethods(paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id
    })));
    
    const newDefault = paymentMethods.find(m => m.id === id);
    toast({
      title: "Default payment method updated",
      description: `${newDefault?.brand} •••• ${newDefault?.last4} is now your default payment method.`,
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Payment Methods</h2>
          <p className="text-muted-foreground">Manage your payment methods for subscriptions and advertising</p>
        </div>
      </div>
      
      {paymentMethods.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentMethods.map((method) => (
            <PaymentMethodCard 
              key={method.id}
              method={method}
              onRemove={handleRemoveMethod}
              onMakeDefault={setDefaultMethod}
            />
          ))}
        </div>
      ) : (
        <PaymentMethodsEmptyState />
      )}
      
      {showAddForm ? (
        <Card>
          <CardHeader>
            <CardTitle>Add New Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentMethodForm 
              onAddMethod={handleAddMethod} 
              onCancel={() => setShowAddForm(false)} 
            />
          </CardContent>
        </Card>
      ) : (
        <Button 
          variant="outline" 
          onClick={() => setShowAddForm(true)}
          className="gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Add Payment Method
        </Button>
      )}
      
      <PaymentSecurityInfo />
    </div>
  );
};

export default PaymentMethodsTab;
