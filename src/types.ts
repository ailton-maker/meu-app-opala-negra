export type Gender = 'male' | 'female';
export type PlanTier = 'free' | 'bronze' | 'silver' | 'gold';

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  bio: string;
  location: string;
  role: string;
  interests?: string[];
  imageUrl: string; // Featured image
  photos: string[]; // 3-7 photos
  verificationVideo?: string; // Optional 15s video
  gender: Gender;
  plan: PlanTier;
  maxConversations: number;
  currentConversations: number;
  verificationLevel: 0 | 1 | 2; // 0: none, 1: thumb, 2: head (full)
  daysActive: number;
  reputation: number;
  joinedAt: string;
  isGhostMode?: boolean;
  blockedUsers?: string[];
  invitationCode?: string;
  invitedBy?: string;
  premiumUntil?: string; // ISO date string
  authInfo?: {
    email?: string;
    phone?: string;
  };
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

export interface Conversation {
  id: string;
  participants: string[];
  targetProfile: UserProfile;
  lastMessage: Message;
  unreadCount: number;
  updatedAt: string;
  isMuted?: boolean;
  typingStatus?: Record<string, boolean>;
}

export type View = 
  | 'splash'
  | 'auth'
  | 'access'
  | 'discovery' 
  | 'messages' 
  | 'reputation' 
  | 'profile' 
  | 'onboarding' 
  | 'verification' 
  | 'report' 
  | 'premium' 
  | 'transactions' 
  | 'admin'
  | 'help'
  | 'chat_view'
  | 'edit_profile'
  | 'settings';

export interface Profile {
  id: string;
  name: string;
  age: number;
  role: string;
  location: string;
  bio: string;
  imageUrl: string;
  verified: boolean;
}

export interface Transaction {
  id: string;
  planName: string;
  nsu: string;
  amount: number;
  status: 'Approved' | 'Pending' | 'Denied';
  date: string;
  time: string;
}

export interface Report {
  id: string;
  reason: string;
  timestamp: string;
  status: 'High' | 'Medium' | 'Low';
  description: string;
}
