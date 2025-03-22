
import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  color: string;
}

export const StatsCard = ({ title, value, icon, color }: StatsCardProps) => (
  <div className="bg-white rounded-lg border p-4">
    <div className="flex items-center gap-3">
      <div className={`rounded-full p-2 ${color}`}>
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  </div>
);
