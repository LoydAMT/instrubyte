import type { ReactNode } from 'react';

export interface NavItem {
  id: string;
  label: string;
  dotLabel: string;
}

export interface Service {
  id: number;
  icon: ReactNode;
  title: string;
  description: string;
  details?: string[];
}

export interface Brand {
  name: string;
  logo: string;
}

export interface GalleryPhoto {
  src: string;
  alt: string;
}

export interface IndustrySlide {
  id: string;
  name: string;
  image: string;
  description: string;
}

export interface WhyUsPoint {
  title: string;
  description: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface FormState {
  name: string;
  email: string;
  company: string;
  service: string;
  message: string;
}

export type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

export interface ChatImage {
  mediaType: string;
  data: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  images?: ChatImage[];
}

export interface ChatLeadSummary {
  category?: string;
  specs?: string;
  contactName?: string;
  contactEmail?: string;
  contactCompany?: string;
  urgencyNote?: string;
}
