
import { VehicleInfo } from '@/services/nhtsa';
import { MaintenanceRecord } from '@/types/customer';
import { format } from 'date-fns';

export const printMaintenanceLog = (vehicleInfo: VehicleInfo, maintenanceRecords: MaintenanceRecord[]) => {
  const sortedRecords = [...maintenanceRecords].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  const printWindow = window.open('', '_blank', 'height=600,width=800');
  
  if (!printWindow) {
    alert('Please allow pop-ups to print the maintenance log');
    return;
  }
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Vehicle Maintenance Log - ${vehicleInfo.modelYear} ${vehicleInfo.make} ${vehicleInfo.model}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
          }
          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 30px;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 20px;
          }
          .logo-section {
            display: flex;
            align-items: center;
            gap: 15px;
          }
          .logo {
            height: 50px;
            width: auto;
          }
          .company-info {
            text-align: left;
          }
          .company-name {
            font-size: 24px;
            font-weight: bold;
            color: #2563eb;
            margin: 0;
          }
          .tagline {
            font-size: 14px;
            color: #666;
            margin: 5px 0 0 0;
          }
          .report-title {
            text-align: right;
            color: #333;
          }
          .vehicle-info {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
          }
          .timeline {
            position: relative;
            padding-left: 30px;
          }
          .timeline::before {
            content: '';
            position: absolute;
            left: 15px;
            top: 0;
            bottom: 0;
            width: 2px;
            background-color: #e5e7eb;
          }
          .timeline-item {
            position: relative;
            margin-bottom: 20px;
            background: white;
            padding: 15px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
          }
          .timeline-item::before {
            content: '';
            position: absolute;
            left: -23px;
            top: 20px;
            width: 8px;
            height: 8px;
            background-color: #2563eb;
            border-radius: 50%;
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
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo-section">
            <img src="/lovable-uploads/e3e5d8f9-ed10-4030-8f80-f4d6d309c6e4.png" alt="ViaFix Logo" class="logo" />
            <div class="company-info">
              <h2 class="company-name">ViaFix</h2>
              <p class="tagline">Professional Mobile Mechanic Services</p>
            </div>
          </div>
          <div class="report-title">
            <h1>Vehicle Maintenance Log</h1>
          </div>
        </div>
        
        <div class="vehicle-info">
          <h3>Vehicle Information</h3>
          <p><strong>Year:</strong> ${vehicleInfo.modelYear}</p>
          <p><strong>Make:</strong> ${vehicleInfo.make}</p>
          <p><strong>Model:</strong> ${vehicleInfo.model}</p>
          ${vehicleInfo.trim ? `<p><strong>Trim:</strong> ${vehicleInfo.trim}</p>` : ''}
          ${vehicleInfo.engineCylinders ? `<p><strong>Engine:</strong> ${vehicleInfo.engineCylinders}</p>` : ''}
        </div>
        
        ${sortedRecords.length > 0 ? `
          <div class="timeline">
            ${sortedRecords.map(record => `
              <div class="timeline-item">
                <h4>${format(new Date(record.date), 'MMM d, yyyy')} - ${record.serviceType}</h4>
                <p>${record.description}</p>
                <p><small>Performed by: ${record.mechanic}</small></p>
              </div>
            `).join('')}
          </div>
        ` : `
          <p>No maintenance records available.</p>
        `}
        
        <div class="footer">
          Generated on ${format(new Date(), 'MMMM d, yyyy')} by ViaFix
        </div>
        
        <button onclick="window.print();return false;">Print Log</button>
      </body>
    </html>
  `);
  
  printWindow.document.close();
  printWindow.focus();
};

export const generateReport = (vehicleInfo: VehicleInfo) => {
  // In a real implementation, this would generate a PDF report
  console.log('Generating FixIQ report for', vehicleInfo);
  alert('FixIQ Report generation would download a PDF with all maintenance records and safety data');
};
