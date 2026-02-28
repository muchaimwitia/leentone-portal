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
      {/* 1. The Compact Canvas (Height reduced from 400px to 260px) */}
      <div className="relative w-full h-[220px] md:h-[260px] bg-[#121A2F] overflow-hidden rounded-[2px]">
        {/* Parallax Image Background */}
        <motion.div 
          className="absolute inset-0 opacity-90"
          style={{ background: `linear-gradient(135deg, ${property.g})` }}
          variants={{
            initial: { scale: 1 },
            hover: { scale: 1.05 }
          }}
          transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }} 
        />
        
        {/* Monogram Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none mix-blend-multiply">
          <span className="font-serif text-[100px] text-[#1E293B] opacity-50 italic">L</span>
        </div>

        {/* Top Floating Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
          <div className="flex flex-col gap-2">
            {property.off && (
              <span className="px-2 py-[4px] bg-[#080D19] text-[#B89B5E] text-[8px] font-mono tracking-[0.2em] uppercase shadow-xl border border-[#1E293B]">
                Private Inventory
              </span>
            )}
          </div>
          {property.v && (
            <div className="w-[24px] h-[24px] bg-[#080D19] rounded-full flex items-center justify-center shadow-lg border border-[#1E293B]">
              <div className="w-[12px] h-[12px] border border-[#1A6A45] rounded-full flex items-center justify-center">
                <div className="w-[4px] h-[4px] bg-[#1A6A45] rounded-full"></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. The Compact Plaque (Less negative margin, tighter padding) */}
      <motion.div 
        variants={{
          initial: { y: 0, boxShadow: "0 4px 20px rgba(0,0,0, 0.2)" },
          hover: { y: -4, boxShadow: "0 10px 30px rgba(184, 155, 94, 0.1)" },
          tap: { y: 0, scale: 0.99 }
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-20 mx-3 md:mx-4 -mt-[40px] bg-[#080D19] border border-[#1E293B] p-5 md:p-6 rounded-[2px] flex flex-col"
      >
        {/* Animated Gold Header Line */}
        <motion.div 
          variants={{
            initial: { scaleX: 0 },
            hover: { scaleX: 1 }
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute top-0 left-0 right-0 h-[2px] bg-[#B89B5E] origin-left"
        />

        {/* Header */}
        <div className="mb-3">
          <p className="font-mono text-[8px] tracking-[0.2em] text-[#B89B5E] uppercase mb-1">
            {property.loc}
          </p>
          <h3 className="font-serif text-[18px] md:text-[20px] text-[#FDFBF7] font-light leading-tight tracking-[-0.01em]">
            {property.name}
          </h3>
        </div>

        {/* Financials */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="font-serif text-[20px] md:text-[24px] text-[#FDFBF7] tracking-tight">
            {formatPrice(property.kes)}
          </span>
          <span className="font-mono text-[8px] text-[#94A3B8] uppercase tracking-[0.2em]">
            {currency}
          </span>
        </div>

        {/* Minimal Specs Divider */}
        <div className="h-[1px] w-full bg-[#1E293B] mb-4"></div>

        {/* Data Grid & Interaction Prompt */}
        <div className="flex justify-between items-end">
          <div className="flex gap-4 md:gap-5">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[7px] text-[#94A3B8] uppercase tracking-widest">Surface</span>
              <span className="font-serif text-[14px] text-[#FDFBF7]">{property.sqm} <span className="text-[10px]">m²</span></span>
            </div>
            <div className="w-[1px] h-[20px] bg-[#1E293B] self-center"></div>
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[7px] text-[#94A3B8] uppercase tracking-widest">Config</span>
              <span className="font-serif text-[14px] text-[#FDFBF7]">{property.beds} <span className="font-mono text-[9px] text-[#94A3B8] uppercase">Beds</span></span>
            </div>
          </div>

          <motion.div 
            variants={{
              initial: { x: -5, opacity: 0 },
              hover: { x: 0, opacity: 1 }
            }}
            transition={{ duration: 0.3 }}
            className="text-[#B89B5E] text-[16px] font-light"
          >
            →
          </motion.div>
        </div>

      </motion.div>
    </motion.div>
  );
}