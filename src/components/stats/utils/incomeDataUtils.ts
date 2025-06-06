
// Production-ready income data utilities
export const generateIncomeData = (year: number, month?: number) => {
  // In production, this would fetch real data from the database
  // For now, return empty array to show proper empty states
  return [];
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
