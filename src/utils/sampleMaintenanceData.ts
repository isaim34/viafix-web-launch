
import { MaintenanceRecord } from '@/types/customer';

export function getSampleRecords(): MaintenanceRecord[] {
  return [
    {
      id: '1',
      date: '2023-10-15',
      vehicle: '2018 Toyota Camry',
      vin: '4T1B11HK1KU123456',
      serviceType: 'Oil Change',
      description: 'Regular oil change with full synthetic oil. Replaced oil filter.',
      mechanic: 'Alex Johnson',
      mechanicSignature: true,
      nhtsaData: {
        recalls: [{
          id: "recall-1",
          campNo: "18V123000",
          component: "Forward Collision Avoidance",
          summary: "The forward collision avoidance system may not detect objects properly.",
          consequence: "Increased risk of crash if the driver relies on the system.",
          remedy: "Dealer will update the software free of charge.",
          notes: "Contact your Toyota dealer as soon as possible.",
          reportedDate: "2023-01-15"
        }],
        complaints: [],
        investigations: []
      }
    },
    {
      id: '2',
      date: '2023-08-22',
      vehicle: '2018 Toyota Camry',
      serviceType: 'Brake Replacement',
      description: 'Replaced front brake pads and rotors. Inspected rear brakes - still good condition.',
      mechanic: 'Sarah Williams',
      mechanicSignature: true
    }
  ];
}

// Add the exported array that VehicleMaintenanceLog.tsx is trying to import
export const sampleMaintenanceRecords = getSampleRecords();
