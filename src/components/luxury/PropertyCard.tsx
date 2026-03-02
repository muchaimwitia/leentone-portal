'use client';

import { motion } from 'framer-motion';
import { Property } from '@/types/investment';

interface Props {
  property: Property;
  formatPrice: (kes: number) => string;
  currency: string;
  onSelect: (p: Property) => void;
}

export default function PropertyCard({ property, formatPrice, currency, onSelect }: Props) {
  return (
    <motion.div 
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      className="relative w-full cursor-pointer group"
      onClick={() => onSelect(property)}
    >
      {/* 1. VISUAL CANVAS (The Image Area) */}
      <div className="relative w-full h-[220px] md:h-[260px] bg-[#080D19] overflow-hidden rounded-[2px] border border-[#FDFBF7]/10">
        <motion.div 
          className="absolute inset-0 opacity-80 grayscale hover:grayscale-0 transition-all duration-700"
          style={{ background: `linear-gradient(135deg, ${property.g})` }}
          variants={{
            initial: { scale: 1 },
            hover: { scale: 1.05 }
          }}
        />
        
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none mix-blend-overlay">
          <span className="font-serif text-[120px] text-[#FDFBF7] opacity-10 italic">L</span>
        </div>

        {/* Floating Tags */}
        <div className="absolute top-4 left-4 z-10">
          {property.off && (
            <span className="px-3 py-1 bg-[#B89B5E] text-[#FDFBF7] text-[8px] font-mono tracking-[0.2em] uppercase shadow-xl">
              Private Inventory
            </span>
          )}
        </div>
      </div>

      {/* 2. THE IVORY DOMINANT PLAQUE (The Detail Area) */}
      <motion.div 
        variants={{
          initial: { y: 0, scale: 1 },
          hover: { y: -12, scale: 1.01 }
        }}
        transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
        className="relative z-20 mx-4 -mt-[50px] bg-[#FDFBF7] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-[1px]"
      >
        {/* Surgical Gold Accent Line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-[#B89B5E]" />

        {/* Header */}
        <div className="mb-4">
          <p className="font-mono text-[8px] tracking-[0.3em] text-[#B89B5E] uppercase mb-1">
            {property.loc}
          </p>
          <h3 className="font-serif text-[22px] md:text-[24px] text-[#080D19] font-light leading-tight">
            {property.name}
          </h3>
        </div>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 mb-6 border-b border-[#080D19]/5 pb-4">
          <span className="font-serif text-[26px] text-[#080D19] tracking-tight">
            {formatPrice(property.kes)}
          </span>
          <span className="font-mono text-[9px] text-[#080D19]/40 uppercase tracking-[0.2em]">
            {currency}
          </span>
        </div>

        {/* Specs Grid */}
        <div className="flex justify-between items-end">
          <div className="flex gap-6">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[7px] text-[#080D19]/40 uppercase tracking-widest">Surface</span>
              <span className="font-serif text-[15px] text-[#080D19]">{property.sqm} <span className="text-[10px]">m²</span></span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[7px] text-[#080D19]/40 uppercase tracking-widest">Configuration</span>
              <span className="font-serif text-[15px] text-[#080D19]">{property.beds} <span className="font-mono text-[9px] opacity-60">BR</span></span>
            </div>
          </div>

          <motion.div 
            variants={{ initial: { x: -5, opacity: 0 }, hover: { x: 0, opacity: 1 } }}
            className="text-[#B89B5E] text-[20px] font-light"
          >
            →
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}