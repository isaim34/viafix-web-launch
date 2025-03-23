
// Mock data - in a real application, this would come from an API
export const generateIncomeData = (year: number, month?: number) => {
  const data: {
    id: string;
    date: string;
    service: string;
    client: string;
    amount: number;
  }[] = [];
  
  const monthsToGenerate = month ? [month] : Array.from({ length: 12 }, (_, i) => i);
  
  monthsToGenerate.forEach(m => {
    const daysInMonth = new Date(year, m + 1, 0).getDate();
    const entriesCount = Math.floor(Math.random() * 10) + 5; // 5-15 entries per month
    
    const services = [
      'Oil Change', 
      'Brake Repair', 
      'Tire Replacement', 
      'Engine Diagnostics', 
      'Battery Replacement'
    ];
    
    const clients = [
      'John Smith', 
      'Maria Garcia', 
      'Robert Chen', 
      'Sarah Johnson',
      'Mike Wilson',
      'Emma Davis'
    ];
    
    for (let i = 0; i < entriesCount; i++) {
      const day = Math.floor(Math.random() * daysInMonth) + 1;
      const service = services[Math.floor(Math.random() * services.length)];
      const client = clients[Math.floor(Math.random() * clients.length)];
      const amount = Math.floor(Math.random() * 300) + 50; // $50-$350
      
      data.push({
        id: `${year}-${m+1}-${day}-${i}`,
        date: `${year}-${(m+1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
        service,
        client,
        amount
      });
    }
  });
  
  return data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const currentYear = new Date().getFullYear();
export const yearOptions = [currentYear, currentYear-1, currentYear-2];
export const monthOptions = [
  { value: '0', label: 'January' },
  { value: '1', label: 'February' },
  { value: '2', label: 'March' },
  { value: '3', label: 'April' },
  { value: '4', label: 'May' },
  { value: '5', label: 'June' },
  { value: '6', label: 'July' },
  { value: '7', label: 'August' },
  { value: '8', label: 'September' },
  { value: '9', label: 'October' },
  { value: '10', label: 'November' },
  { value: '11', label: 'December' },
];
