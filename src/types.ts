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
