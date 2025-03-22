
export type Message = {
  id: string;
  from: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
  type: 'booking' | 'contact';
};

export type MechanicStats = {
  completed: number;
  cancelled: number;
  ongoing: number;
  totalEarnings: number;
  averageRating: number;
  responseRate: number;
};
