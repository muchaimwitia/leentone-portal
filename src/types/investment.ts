export interface Property {
  id: string;
  name: string;
  loc: string;
  kes: number;
  seg: 'pent' | 'vil' | 'apt';
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

export type PurchaseMode = 'cash' | 'mortgage';