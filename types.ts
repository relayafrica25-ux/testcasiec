
export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  impact: 'Bullish' | 'Bearish' | 'Neutral';
  sources?: Array<{ uri: string; title: string }>;
  imageUrl?: string;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  author: string;
  date: string;
  imageGradient: string;
  imageUrl?: string;
  content?: string;
  url?: string;
}

export interface LoanApplication {
  id: string;
  date: string;
  type: 'financial' | 'business_support';
  loanType?: string;
  serviceType?: string;
  amount?: string;
  revenue?: string;
  businessName: string;
  cacNumber: string;
  industry: string;
  state: string;
  fullName: string;
  role: string;
  email: string;
  phone: string;
  bvn?: string;
  description?: string;
  status: 'Pending' | 'Reviewed' | 'Approved' | 'Declined';
}

export interface ContactInquiry {
  id: string;
  date: string;
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'Unread' | 'Replied' | 'Archived' | 'opened';
  opened?: boolean;
}

export interface NewsletterSubscription {
  id: string;
  email: string;
  date: string;
}

export interface TickerItem {
  id: string;
  text: string;
  category: 'Market' | 'Corporate' | 'Urgent';
  isManual: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageGradient: string;
  specialization: string;
  imageUrl?: string;
  linkedin?: string;
  twitter?: string;
  email?: string;
}

export interface Campaign {
  id: string;
  headline: string;
  summary: string;
  contextType: string;
  tag: string;
  image?: string;
  url?: string;
}

export type CarouselItemType = 'news' | 'eco' | 'advert' | 'product' | 'customer';

export interface CarouselItem {
  id: string;
  type: CarouselItemType;
  title: string;
  summary: string;
  tag: string;
  date?: string;
  link?: string;
  linkText?: string;
  imageGradient?: string;
  imageUrl?: string;
  statLabel?: string;
  statValue?: string;
  url?: string; // Adding url for mapping if needed
}