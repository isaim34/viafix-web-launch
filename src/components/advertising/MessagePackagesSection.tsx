
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface MessagePackagesSectionProps {
  messageCost: number;
  messagesRemaining: number;
  onBuyMessages: (quantity: number) => void;
}

export const MessagePackagesSection: React.FC<MessagePackagesSectionProps> = ({
  messageCost,
  messagesRemaining,
  onBuyMessages
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="border-dashed hover:border-primary/50 transition-colors cursor-pointer" onClick={() => onBuyMessages(50)}>
          <CardHeader>
            <CardTitle>50 Messages</CardTitle>
            <CardDescription>${(messageCost * 50).toFixed(2)}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="outline" className="w-full">Buy Now</Button>
          </CardFooter>
        </Card>
        
        <Card className="border-primary shadow-sm hover:shadow-md transition-all cursor-pointer" onClick={() => onBuyMessages(200)}>
          <CardHeader>
            <CardTitle>200 Messages</CardTitle>
            <CardDescription>${(messageCost * 200 * 0.9).toFixed(2)} (10% discount)</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Most Popular</Badge>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Buy Now</Button>
          </CardFooter>
        </Card>
        
        <Card className="border-dashed hover:border-primary/50 transition-colors cursor-pointer" onClick={() => onBuyMessages(500)}>
          <CardHeader>
            <CardTitle>500 Messages</CardTitle>
            <CardDescription>${(messageCost * 500 * 0.8).toFixed(2)} (20% discount)</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="outline" className="w-full">Buy Now</Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="flex items-center gap-2 mb-4">
        <p>Messages available: <span className="font-medium">{messagesRemaining}</span></p>
        {messagesRemaining === 0 && (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            Purchase messages to continue
          </Badge>
        )}
      </div>
    </div>
  );
};
