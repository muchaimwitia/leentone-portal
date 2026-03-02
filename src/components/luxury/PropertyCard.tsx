'use client';

import { motion } from 'framer-motion';
import { Property } from '@/types/investment';

interface PropertyCardProps {
  property: Property;
  formatPrice: (kes: number) => string;
  currency: any; 
  onSelect: (p: Property) => void;
}

export default function PropertyCard({ property, formatPrice, currency, onSelect }: PropertyCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onClick={() => onSelect(property)}
      className="group relative bg-[#121A2F] border border-[#1E293B] overflow-hidden rounded-[2px] cursor-pointer hover:border-[#B89B5E] transition-all duration-500 luxury-shadow"
    >
      <div className="relative h-[240px] w-full overflow-hidden bg-[#0B1325]">
        <div className="absolute inset-0 bg-gradient-to-t from-[#080D19] to-transparent z-10 opacity-60"></div>
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          {property.v && (
            <span className="bg-[#B89B5E] text-[#080D19] text-[8px] font-mono uppercase tracking-widest px-2 py-1 rounded-[1px]">Verified</span>
          )}
          {property.off && (
            <span className="bg-[#8A2525] text-[#FDFBF7] text-[8px] font-mono uppercase tracking-widest px-2 py-1 rounded-[1px]">Private</span>
          )}
        </div>
        <div className="w-full h-full flex items-center justify-center text-[#1E293B] font-serif italic group-hover:scale-110 transition-transform duration-1000">
           {property.name} Visual
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="font-mono text-[9px] text-[#B89B5E] uppercase tracking-[0.2em] mb-1">{property.loc}</p>
            <h3 className="font-serif text-[20px] text-[#FDFBF7] leading-tight">{property.name}</h3>
          </div>
          <div className="text-right">
            <p className="font-mono text-[12px] text-[#FDFBF7] font-bold">{formatPrice(property.kes)}</p>
            <p className="text-[9px] text-[#94A3B8] uppercase tracking-widest">Est. Market Value</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 py-4 border-y border-[#1E293B] mb-4">
          <div className="text-center border-r border-[#1E293B]">
            <p className="text-[#FDFBF7] font-serif text-[16px]">{property.beds}</p>
            <p className="text-[8px] text-[#94A3B8] uppercase tracking-tighter">Bedrooms</p>
          </div>
          <div className="text-center border-r border-[#1E293B]">
            <p className="text-[#FDFBF7] font-serif text-[16px]">{property.sqm}</p>
            <p className="text-[8px] text-[#94A3B8] uppercase tracking-tighter">SQ Meters</p>
          </div>
          <div className="text-center">
            <p className="text-[#FDFBF7] font-serif text-[16px]">{property.ref?.split('-')[2] || 'PRV'}</p>
            <p className="text-[8px] text-[#94A3B8] uppercase tracking-tighter">Ref No.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {property.feats.slice(0, 2).map((f, i) => (
            <span key={i} className="text-[9px] font-mono text-[#94A3B8] border border-[#1E293B] px-2 py-1 rounded-[2px]">{f}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}