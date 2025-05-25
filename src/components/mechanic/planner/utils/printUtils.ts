
import { PlannerEntry } from '@/types/mechanic';
import { format } from 'date-fns';
import { formatDisplayDate } from './dateFormatUtils';

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
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 20px;
          }
          .report-title {
            font-size: 24px;
            font-weight: bold;
            color: #2563eb;
            margin: 0;
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
          .footer {
            text-align: center;
            font-size: 12px;
            margin-top: 40px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 20px;
          }
          @media print {
            button {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="report-title">${weekTitle}</h1>
        </div>
        
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
        
        <div class="footer">
          Generated on ${format(new Date(), 'MMMM d, yyyy')}
        </div>
        
        <button onclick="window.print();return false;">Print Schedule</button>
      </body>
    </html>
  `);
  
  printWindow.document.close();
  printWindow.focus();
};
