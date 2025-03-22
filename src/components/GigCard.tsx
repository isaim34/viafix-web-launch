
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Clock, DollarSign } from 'lucide-react';

interface GigCardProps {
  gig: {
    id: string;
    title: string;
    description: string;
    price: number;
    duration: string;
    image: string;
    status: string;
  };
  onEdit: () => void;
  onDelete: () => void;
}

const GigCard = ({ gig, onEdit, onDelete }: GigCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={gig.image} 
          alt={gig.title}
          className="w-full h-full object-cover"
        />
        <Badge 
          variant={gig.status === 'active' ? 'default' : 'secondary'}
          className="absolute top-2 right-2"
        >
          {gig.status === 'active' ? 'Active' : 'Inactive'}
        </Badge>
      </div>
      
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-2">{gig.title}</h3>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
          {gig.description}
        </p>
        
        <div className="flex flex-wrap gap-3 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <DollarSign className="w-4 h-4" />
            <span className="font-medium text-foreground">${gig.price}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{gig.duration}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button
          variant="outline" 
          size="sm" 
          onClick={onEdit}
          className="flex items-center gap-1"
        >
          <Edit className="w-4 h-4" />
          <span>Edit</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onDelete}
          className="flex items-center gap-1 text-destructive"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GigCard;
