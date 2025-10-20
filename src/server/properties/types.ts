import type { Property, PropertyPurpose, Currency } from '@prisma/client';

type Location = {
  provincia: string;
  cidade: string;
  bairro: string;
  lat: number;
  lng: number;
};

export type PropertySummary = Pick<
  Property,
  'id' | 'title' | 'purpose' | 'type' | 'price' | 'currency' | 'amenities' | 'media' | 'description'
> & {
  location: Location;
};

export interface PropertyFilter {
  q?: string;
  purpose?: PropertyPurpose;
  type?: string;
  priceMin?: number;
  priceMax?: number;
  provincia?: string;
  cidade?: string;
  bairro?: string;
  bedrooms?: number;
  amenities?: string[];
  near?: { lat: number; lng: number; radius: number };
  orderBy?: 'novos' | 'preco' | 'area';
  currency?: Currency;
}
