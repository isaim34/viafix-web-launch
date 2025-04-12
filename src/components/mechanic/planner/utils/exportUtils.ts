
import { PlannerEntry } from '@/types/mechanic';
import { format, parseISO } from 'date-fns';

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

// Format date for display
export const formatDisplayDate = (dateString: string) => {
  try {
    const date = parseISO(dateString);
    return format(date, 'EEE, MMM d, yyyy');
  } catch (error) {
    return dateString;
  }
};

// Prepare for printing by opening a new window with formatted content
export const printSchedule = (entries: PlannerEntry[], weekTitle: string) => {
  // Sort entries by date
  const sortedEntries = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  
  // Create a new window for printing
  const printWindow = window.open('', '_blank', 'height=600,width=800');
  
  if (!printWindow) {
    alert('Please allow pop-ups to print the schedule');
    return;
  }
  
  // Generate HTML content for printing
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Weekly Planner - ${weekTitle}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
          }
          h1 {
            color: #2563eb;
            margin-bottom: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
          }
          th {
            background-color: #f1f5f9;
            font-weight: bold;
          }
          tr:nth-child(even) {
            background-color: #f9fafb;
          }
          .print-date {
            text-align: right;
            font-size: 12px;
            color: #666;
            margin-bottom: 20px;
          }
          .no-entries {
            text-align: center;
            padding: 30px;
            color: #666;
          }
          @media print {
            button {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <h1>${weekTitle}</h1>
        <div class="print-date">Printed on: ${format(new Date(), 'MMMM d, yyyy')}</div>
        
        ${sortedEntries.length > 0 ? `
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Customer</th>
                <th>Service</th>
                <th>Est. Time</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              ${sortedEntries.map(entry => `
                <tr>
                  <td>${formatDisplayDate(entry.date)}</td>
                  <td>${entry.customerName}</td>
                  <td>${entry.serviceType}</td>
                  <td>${entry.estimatedTime}</td>
                  <td>${entry.notes}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : `
          <div class="no-entries">No entries in the schedule</div>
        `}
        
        <button onclick="window.print();return false;">Print Schedule</button>
      </body>
    </html>
  `);
  
  printWindow.document.close();
  printWindow.focus();
};
