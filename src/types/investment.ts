export type Currency = 'KES' | 'USD';
export type PurchaseMode = 'cash' | 'mortgage';

export interface Property {
  id: string;
  name: string;
  loc: string;
  kes: number;
  seg: 'pent' | 'vil';
  beds: number;
  baths: number;
  sqm: number;
  v: boolean;
  ref: string | null;
  off: boolean;
  feats: string[];
  em: string;
  g: string;
}