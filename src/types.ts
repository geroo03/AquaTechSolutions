import type { LucideIcon } from 'lucide-react';

export interface ServiceItem {
  id: string;
  title: string;
  shortDesc: string;
  icon: LucideIcon;
  /** Texto de garantía tal como lo confirmó el dueño (por sistema, no por servicio) */
  warranty: string;
}

export interface WarrantyItem {
  system: string;
  years: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  location: string;
  system: string;
  warranty: string;
  beforeImg: string;
  afterImg: string;
  beforeAlt: string;
  afterAlt: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface ZoneItem {
  id: string;
  name: string;
  detail: string;
  /** Posición en el mapa esquemático (0–100). Sin posición: no se dibuja en el mapa */
  x?: number;
  y?: number;
}
