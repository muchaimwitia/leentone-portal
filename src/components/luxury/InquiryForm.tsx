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
  const [formData, setFormData] = useState({ name: '', email: '', horizon: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic(15);
    setIsSubmitting(true);

    try {
      // Send secure POST request to our new API route
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Transmission failed');

      // Add a slight delay for the luxury UI feel
      setTimeout(() => {
        setIsSubmitting(false);
        triggerHaptic([10, 50, 10]);
        onComplete();
      }, 1500);

    } catch (error) {
      console.error('Inquiry failed:', error);
      setIsSubmitting(false);
      // In a full production app, you would show a subtle error toast here
    }
  };

  return (
    <div className="w-full bg-[#121A2F] border border-[#1E293B] rounded-[2px] luxury-shadow overflow-hidden flex flex-col md:flex-row">
      
      {/* LEFT COLUMN: The Strategist Profile */}
      <div className="w-full md:w-[40%] bg-[#080D19] p-[32px] md:p-[48px] relative overflow-hidden flex flex-col justify-between border-r border-[#1E293B]">
        <div className="absolute -bottom-10 -left-10 font-serif text-[200px] text-[#1E293B] opacity-20 pointer-events-none italic">L</div>
        
        <div className="relative z-10">
          <p className="font-mono text-[9px] tracking-[0.3em] text-[#B89B5E] uppercase mb-[32px]">Direct Advisory</p>
          
          <div className="w-[80px] h-[100px] bg-[#121A2F] mb-[24px] relative overflow-hidden border border-[#1E293B]">
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop')] bg-cover bg-center grayscale mix-blend-luminosity opacity-80"></div>
          </div>
          
          <h3 className="font-serif text-[24px] text-[#FDFBF7] leading-tight mb-2">Muchai Mwitia</h3>
          <p className="font-mono text-[9px] tracking-[0.1em] text-[#94A3B8] uppercase mb-[24px]">Principal Director, Private Clients</p>
          
          <div className="w-[30px] h-[1px] bg-[#B89B5E] mb-[24px]"></div>
          
          <p className="text-[13px] text-[#94A3B8] leading-[1.8] font-light italic">
            "Acquisition is not merely about the asset; it is about absolute legal certainty and structural integrity. I look forward to engineering your portfolio."
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN: The Minimalist Form */}
      <div className="w-full md:w-[60%] p-[32px] md:p-[48px] bg-[#121A2F]">
        <form onSubmit={handleSubmit} className="flex flex-col h-full justify-between">
          <div className="space-y-[40px]">
            
            <div className="relative group">
              <input 
                type="text" 
                required 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-transparent border-b border-[#1E293B] py-2 text-[15px] font-serif text-[#FDFBF7] focus:outline-none focus:border-[#B89B5E] transition-colors peer placeholder-transparent" 
                id="name" 
                placeholder="Name" 
              />
              <label htmlFor="name" className="absolute left-0 -top-4 text-[9px] font-mono tracking-[0.2em] uppercase text-[#94A3B8] transition-all peer-placeholder-shown:text-[11px] peer-placeholder-shown:top-2 peer-focus:-top-4 peer-focus:text-[9px] peer-focus:text-[#B89B5E]">Legal Name / Entity</label>
            </div>

            <div className="relative group">
              <input 
                type="email" 
                required 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-transparent border-b border-[#1E293B] py-2 text-[15px] font-serif text-[#FDFBF7] focus:outline-none focus:border-[#B89B5E] transition-colors peer placeholder-transparent" 
                id="email" 
                placeholder="Email" 
              />
              <label htmlFor="email" className="absolute left-0 -top-4 text-[9px] font-mono tracking-[0.2em] uppercase text-[#94A3B8] transition-all peer-placeholder-shown:text-[11px] peer-placeholder-shown:top-2 peer-focus:-top-4 peer-focus:text-[9px] peer-focus:text-[#B89B5E]">Secure Email</label>
            </div>

            <div className="relative group">
              <select 
                required 
                value={formData.horizon}
                onChange={(e) => setFormData({...formData, horizon: e.target.value})}
                className="w-full bg-transparent border-b border-[#1E293B] py-2 text-[14px] font-serif text-[#FDFBF7] focus:outline-none focus:border-[#B89B5E] transition-colors appearance-none cursor-pointer"
              >
                <option value="" disabled className="text-[#1E293B]">Select Capital Horizon</option>
                <option value="cash" className="bg-[#080D19] text-[#FDFBF7]">Cash Acquisition (KES 35M - 150M)</option>
                <option value="mortgage" className="bg-[#080D19] text-[#FDFBF7]">Leveraged Acquisition (30% Equity)</option>
                <option value="portfolio" className="bg-[#080D19] text-[#FDFBF7]">Multi-Unit Portfolio Strategy</option>
              </select>
              <div className="absolute right-0 top-3 pointer-events-none text-[#B89B5E] text-[10px]">▼</div>
            </div>

          </div>

          <div className="mt-[48px]">
            <MagneticButton className={`w-full py-[18px] bg-[#FDFBF7] text-[#080D19] rounded-[2px] font-mono text-[10px] tracking-[0.4em] uppercase transition-all duration-500 relative overflow-hidden ${isSubmitting ? 'bg-[#1E293B] text-[#FDFBF7]' : 'hover:bg-[#B89B5E] hover:text-[#FDFBF7]'}`}>
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="animate-spin font-serif text-[14px] leading-none text-[#B89B5E]">⚬</span> Establishing Secure Line
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