
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PaymentMethod } from '@/types/mechanic';
import { CreditCard, Trash2, Star, CheckCircle } from 'lucide-react';

interface PaymentMethodCardProps {
  method: PaymentMethod;
  onRemove: (id: string) => void;
  onMakeDefault: (id: string) => void;
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({ 
  method, 
  onRemove, 
  onMakeDefault 
}) => {
  return (
    <Card className={`${method.isDefault ? 'border-primary shadow-sm' : 'border'}`}>
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
              onClick={() => onMakeDefault(method.id)}
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
            onClick={() => onRemove(method.id)}
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Remove
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodCard;
