
// If the file already exists, we'll append these types to it
export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface ChatThread {
  id: string;
  participants: string[];
  participantNames: Record<string, string>;
  lastMessage?: ChatMessage | null;
  unreadCount: number;
  lastMessageAt?: string;
}

// Add other mechanic types if needed
export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
}

export interface MechanicDetail {
  id: string;
  name: string;
  hourlyRate: number;
  responseTime: string;
  services: Service[];
  // Add other properties as needed
}
