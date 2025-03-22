
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

export type ChatMessage = {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
};

export type ChatThread = {
  id: string;
  participants: string[];
  participantNames: Record<string, string>;
  lastMessage?: ChatMessage;
  unreadCount: number;
};
