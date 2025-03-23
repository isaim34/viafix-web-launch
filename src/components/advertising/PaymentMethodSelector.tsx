
import React, { useState } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaymentMethodForm } from './PaymentMethodForm';
import { PaymentMethod } from '@/types/mechanic';

// Sample payment methods for now
const samplePaymentMethods: PaymentMethod[] = [
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

interface PaymentMethodSelectorProps {
  onSelectMethod?: (id: string) => void;
  confirmButtonText?: string;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ 
  onSelectMethod,
  confirmButtonText = "Continue with Selected Method"
}) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(samplePaymentMethods);
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(
    paymentMethods.find(m => m.isDefault)?.id || null
  );
  const [showAddForm, setShowAddForm] = useState(false);
  
  const handleAddMethod = (newMethod: PaymentMethod) => {
    setPaymentMethods([...paymentMethods, newMethod]);
    setSelectedMethodId(newMethod.id);
    setShowAddForm(false);
  };
  
  const handleRemoveMethod = (id: string) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
    if (selectedMethodId === id) {
      setSelectedMethodId(paymentMethods[0]?.id || null);
    }
  };
  
  const handleSelectMethod = (id: string) => {
    setSelectedMethodId(id);
  };
  
  const handleConfirmSelection = () => {
    if (selectedMethodId && onSelectMethod) {
      onSelectMethod(selectedMethodId);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="text-sm font-medium mb-2">Select Payment Method</div>
      
      {paymentMethods.length > 0 ? (
        <RadioGroup 
          value={selectedMethodId || undefined} 
          onValueChange={handleSelectMethod}
          className="space-y-2"
        >
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center justify-between space-x-2 border rounded-md p-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={method.id} id={`payment-${method.id}`} />
                <Label htmlFor={`payment-${method.id}`} className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span>{method.brand} •••• {method.last4}</span>
                  <span className="text-xs text-muted-foreground">
                    Exp: {method.expiryMonth}/{method.expiryYear.toString().slice(-2)}
                  </span>
                  {method.isDefault && (
                    <span className="text-xs bg-secondary text-secondary-foreground rounded-full px-2 py-0.5">
                      Default
                    </span>
                  )}
                </Label>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-destructive"
                onClick={() => handleRemoveMethod(method.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </RadioGroup>
      ) : (
        <div className="text-center py-4 text-muted-foreground">
          No payment methods added yet
        </div>
      )}
      
      {showAddForm ? (
        <PaymentMethodForm 
          onAddMethod={handleAddMethod} 
          onCancel={() => setShowAddForm(false)} 
        />
      ) : (
        <div className="space-y-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-2 flex items-center gap-2"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="h-4 w-4" />
            Add Payment Method
          </Button>
          
          {onSelectMethod && selectedMethodId && (
            <Button 
              variant="default"
              size="sm"
              className="w-full"
              onClick={handleConfirmSelection}
            >
              {confirmButtonText}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
