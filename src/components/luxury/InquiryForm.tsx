'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import MagneticButton from '@/components/luxury/MagneticButton';

interface Props {
  onComplete: () => void;
  triggerHaptic: (ms: number | number[]) => void;
}

export default function InquiryForm({ onComplete, triggerHaptic }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic(15);
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      triggerHaptic([10, 50, 10]);
      onComplete();
    }, 2000);
  };

  return (
    <div className="w-full bg-white border border-[#E8DFC8] rounded-[2px] luxury-shadow overflow-hidden flex flex-col md:flex-row">
      
      {/* LEFT COLUMN: The Strategist Profile */}
      <div className="w-full md:w-[40%] bg-[#F2ECE0] p-[32px] md:p-[48px] relative overflow-hidden flex flex-col justify-between">
        {/* Subtle background monogram */}
        <div className="absolute -bottom-10 -left-10 font-serif text-[200px] text-[#D4C8A8] opacity-20 pointer-events-none italic">L</div>
        
        <div>
          <p className="font-mono text-[9px] tracking-[0.3em] text-[#B8922A] uppercase mb-[32px]">Direct Advisory</p>
          
          {/* Portrait Placeholder (High-end editorial crop) */}
          <div className="w-[80px] h-[100px] bg-[#1A1410] mb-[24px] relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop')] bg-cover bg-center grayscale mix-blend-luminosity opacity-80"></div>
          </div>
          
          <h3 className="font-serif text-[24px] text-[#1A1410] leading-tight mb-2">Aileen Mucangi</h3>
          <p className="font-mono text-[9px] tracking-[0.1em] text-[#8A7A60] uppercase mb-[24px]">Principal Director, Private Clients</p>
          
          <div className="w-[30px] h-[1px] bg-[#B8922A] mb-[24px]"></div>
          
          <p className="text-[13px] text-[#4A3F30] leading-[1.8] font-light italic">
            "Acquisition is not merely about the asset; it is about absolute legal certainty and structural integrity. I look forward to engineering your portfolio."
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN: The Minimalist Form */}
      <div className="w-full md:w-[60%] p-[32px] md:p-[48px] bg-white">
        <form onSubmit={handleSubmit} className="flex flex-col h-full justify-between">
          <div className="space-y-[40px]">
            
            {/* Minimal Input Fields */}
            <div className="relative group">
              <input type="text" required className="w-full bg-transparent border-b border-[#E8DFC8] py-2 text-[15px] font-serif text-[#1A1410] focus:outline-none focus:border-[#B8922A] transition-colors peer placeholder-transparent" id="name" placeholder="Name" />
              <label htmlFor="name" className="absolute left-0 -top-4 text-[9px] font-mono tracking-[0.2em] uppercase text-[#B5A88A] transition-all peer-placeholder-shown:text-[11px] peer-placeholder-shown:top-2 peer-focus:-top-4 peer-focus:text-[9px] peer-focus:text-[#B8922A]">Legal Name / Entity</label>
            </div>

            <div className="relative group">
              <input type="email" required className="w-full bg-transparent border-b border-[#E8DFC8] py-2 text-[15px] font-serif text-[#1A1410] focus:outline-none focus:border-[#B8922A] transition-colors peer placeholder-transparent" id="email" placeholder="Email" />
              <label htmlFor="email" className="absolute left-0 -top-4 text-[9px] font-mono tracking-[0.2em] uppercase text-[#B5A88A] transition-all peer-placeholder-shown:text-[11px] peer-placeholder-shown:top-2 peer-focus:-top-4 peer-focus:text-[9px] peer-focus:text-[#B8922A]">Secure Email</label>
            </div>

            <div className="relative group">
              <select required className="w-full bg-transparent border-b border-[#E8DFC8] py-2 text-[14px] font-serif text-[#1A1410] focus:outline-none focus:border-[#B8922A] transition-colors appearance-none cursor-pointer" defaultValue="">
                <option value="" disabled className="text-[#B5A88A]">Select Capital Horizon</option>
                <option value="cash">Cash Acquisition (KES 35M - 150M)</option>
                <option value="mortgage">Leveraged Acquisition (30% Equity)</option>
                <option value="portfolio">Multi-Unit Portfolio Strategy</option>
              </select>
              <div className="absolute right-0 top-3 pointer-events-none text-[#B8922A] text-[10px]">▼</div>
            </div>

          </div>

          <div className="mt-[48px]">
            <MagneticButton className={`w-full py-[18px] bg-[#1A1410] text-[#FBF9F6] rounded-[2px] font-mono text-[10px] tracking-[0.4em] uppercase transition-all duration-500 relative overflow-hidden ${isSubmitting ? 'bg-[#F2ECE0] text-[#1A1410]' : 'hover:bg-[#B8922A]'}`}>
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="animate-spin font-serif text-[14px] leading-none text-[#1A1410]">⚬</span> Establishing Secure Line
                </span>
              ) : (
                "Request Private Consultation"
              )}
            </MagneticButton>
          </div>
        </form>
      </div>
      
    </div>
  );
}