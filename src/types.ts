import type { LucideIcon } from 'lucide-react';

export interface ServiceItem {
  id: string;
  title: string;
  shortDesc: string;
  icon: LucideIcon;
  features: string[];
  materials: string[];
  recommendedFor: string;
  warrantyYears: number;
}

export interface CaseStudy {
  id: string;
  number: string;
  title: string;
  location: string;
  system: string;
  surface: string;
  warranty: string;
  time: string;
  status: string;
  beforeImg: string;
  afterImg: string;
  beforeCaption: string;
  afterCaption: string;
  details: string[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'costos' | 'sistemas' | 'garantia' | 'consorcios';
}

export interface ReviewItem {
  id: string;
  name: string;
  role: string;
  location: string;
  comment: string;
  rating: number;
  date: string;
}

export interface ZoneItem {
  id: string;
  name: string;
  area: string;
  response: string;
  /** Posición en el mapa de cobertura (0–100) */
  x: number;
  y: number;
}

