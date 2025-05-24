
export interface CustomOffer {
  id: string;
  customer_id: string;
  description: string;
  budget: string;
  timeframe: string;
  preferred_date: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  created_at: string;
}

export interface ExistingMaintenanceRecord {
  id: string;
  service_type: string;
  description: string;
  date: string;
  vehicle_id?: string;
  customer_id: string;
  mechanic_id?: string;
  mechanic_signature?: boolean;
}
