
import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  color: string;
}

export const StatsCard = ({ title, value, icon, color }: StatsCardProps) => (
  <Card>
    <CardContent className="p-3 md:p-4">
      <div className="flex items-center gap-2 md:gap-3">
        <div className={`rounded-full p-1.5 md:p-2 ${color}`}>
          {icon}
        </div>
        <div>
          <h3 className="text-xs md:text-sm font-medium text-muted-foreground">{title}</h3>
          <p className="text-base md:text-2xl font-bold">{value}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);
