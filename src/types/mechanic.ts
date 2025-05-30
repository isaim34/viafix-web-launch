
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
  lastMessageAt: string;
  unreadCount: number;
};

export type Service = {
  name: string;
  price: number;
};

export type Review = {
  id: string;
  author: string;
  rating: number;
  text: string;
  user_id?: string;
};

export type PaymentMethod = {
  id: string;
  type: 'card' | 'paypal' | 'bank';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  name?: string;
  isDefault: boolean;
};

export type MechanicDetail = {
  id: string;
  name: string;
  avatar: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  location: string;
  hourlyRate: number;
  yearsExperience: number;
  about: string;
  responseTime: string;
  services: Service[];
  reviews: Review[];
  isFavorite?: boolean;
  galleryImages?: string[];
  featured?: boolean;
  featuredUntil?: string;
};

export type FavoriteMechanic = {
  id: string;
  name: string;
  avatar: string;
  location: string;
  rating: number;
  hourlyRate: number;
  addedAt: string;
};

export type AdvertisementSettings = {
  featuredDaily: number;
  currentPlan?: {
    isFeatured: boolean;
    featuredUntil?: string;
    messagesRemaining: number;
  };
};

export type PlannerEntry = {
  id: string;
  date: string;
  customerName: string;
  serviceType: string;
  estimatedTime: string;
  notes: string;
};

export type WeeklyPlan = {
  week: string;
  entries: PlannerEntry[];
};
