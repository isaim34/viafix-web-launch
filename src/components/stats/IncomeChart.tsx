
import React, { useState } from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock data - in a real app this would come from an API
const generateMonthlyData = (year: number) => [
  { name: 'Jan', income: 1850 + Math.random() * 500 },
  { name: 'Feb', income: 2100 + Math.random() * 500 },
  { name: 'Mar', income: 1950 + Math.random() * 500 },
  { name: 'Apr', income: 2400 + Math.random() * 500 },
  { name: 'May', income: 2750 + Math.random() * 500 },
  { name: 'Jun', income: 3100 + Math.random() * 500 },
  { name: 'Jul', income: 2890 + Math.random() * 500 },
  { name: 'Aug', income: 2600 + Math.random() * 500 },
  { name: 'Sep', income: 2450 + Math.random() * 500 },
  { name: 'Oct', income: 2200 + Math.random() * 500 },
  { name: 'Nov', income: 1950 + Math.random() * 500 },
  { name: 'Dec', income: 1600 + Math.random() * 500 },
];

const currentYear = new Date().getFullYear();
const yearOptions = [currentYear, currentYear-1, currentYear-2];

const config = {
  income: {
    label: 'Income',
    theme: {
      light: '#22c55e',
      dark: '#22c55e',
    },
  },
};

const IncomeChart: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const data = generateMonthlyData(selectedYear);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select
          value={selectedYear.toString()}
          onValueChange={(value) => setSelectedYear(parseInt(value))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            {yearOptions.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="h-[400px] w-full">
        <ChartContainer config={config}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis 
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <ChartTooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <ChartTooltipContent
                      className="bg-popover text-popover-foreground p-0"
                      indicator="line"
                    />
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Bar dataKey="income" name="Income" fill="var(--color-income)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
};

export default IncomeChart;
