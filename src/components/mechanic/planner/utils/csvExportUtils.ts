
import { PlannerEntry } from '@/types/mechanic';
import { formatDisplayDate } from './dateFormatUtils';

// Convert planner entries to CSV format
export const exportToCSV = (entries: PlannerEntry[], filename: string = 'weekly-planner.csv') => {
  // CSV Headers
  const headers = ['Date', 'Customer Name', 'Service Type', 'Estimated Time', 'Notes'];
  
  // Map entries to CSV rows
  const rows = entries.map(entry => [
    formatDisplayDate(entry.date),
    entry.customerName,
    entry.serviceType,
    entry.estimatedTime,
    // Escape quotes in notes to prevent CSV format issues
    entry.notes.replace(/"/g, '""')
  ]);
  
  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  // Create a Blob and download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
