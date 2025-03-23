
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PaymentMethod } from '@/types/mechanic';
import { CreditCard, Trash2, Star, PlusCircle, CheckCircle } from 'lucide-react';
import { PaymentMethodForm } from './PaymentMethodForm';
import { useToast } from '@/hooks/use-toast';

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
            <Card key={method.id} className={`${method.isDefault ? 'border-primary shadow-sm' : 'border'}`}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-lg">{method.brand}</CardTitle>
                  </div>
                  {method.isDefault && (
                    <div className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      Default
                    </div>
                  )}
                </div>
                <CardDescription>
                  •••• •••• •••• {method.last4}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Expires: {method.expiryMonth}/{method.expiryYear.toString().slice(-2)}
                </p>
                
                <div className="flex items-center justify-between mt-4">
                  {!method.isDefault && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs"
                      onClick={() => setDefaultMethod(method.id)}
                    >
                      Make Default
                    </Button>
                  )}
                  {method.isDefault && (
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Used for auto-renewals
                    </div>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-destructive text-xs"
                    onClick={() => handleRemoveMethod(method.id)}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>No Payment Methods</CardTitle>
            <CardDescription>
              Add a payment method to subscribe to featured listings or send mass messages
            </CardDescription>
          </CardHeader>
        </Card>
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
    </div>
  );
};

export default PaymentMethodsTab;
