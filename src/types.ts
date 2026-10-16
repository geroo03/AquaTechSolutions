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

/** Obra real, tomada de las redes de AquaTech (relevamiento del 16/10/2026) */
export interface WorkItem {
  id: string;
  place: string;
  type: string;
  /** Solo si el posteo lo dice o se ve claramente */
  detail?: string;
  date: string;
  url: string;
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
  /** Qué resalta en el mapa: un punto de obra, toda la provincia o las limítrofes */
  map: 'pin' | 'province' | 'neighbors';
}
