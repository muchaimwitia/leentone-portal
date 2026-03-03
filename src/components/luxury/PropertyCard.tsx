'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Property } from '@/types/investment';

interface PropertyCardProps {
  property: Property;
  formatPrice: (kes: number) => string;
  currency: string;
  onSelect: (p: Property) => void;
}

const PROPERTY_GALLERY: Record<string, string[]> = {
  p1: [
    'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/276554/pexels-photo-276554.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ],
  p2: [
    'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/53610/large-home-residential-house-architecture-53610.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/1743227/pexels-photo-1743227.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/3935333/pexels-photo-3935333.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ],
  p3: [
    'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/2119714/pexels-photo-2119714.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/462235/pexels-photo-462235.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ],
  p4: [
    'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/2724748/pexels-photo-2724748.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ],
};

export default function PropertyCard({ property, formatPrice, currency, onSelect }: PropertyCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const imgs = PROPERTY_GALLERY[property.id] ?? [];
  const coverImg = imgs[0];

  // Lock body scroll when modal open
  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [modalOpen]);

  const openModal = () => { setModalOpen(true); setActiveImg(0); };
  const closeModal = () => setModalOpen(false);

  return (
    <>
      {/* ══ CARD ══ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        onClick={openModal}
        className="group relative bg-[#121A2F] border border-[#1E293B] overflow-hidden rounded-[2px] cursor-pointer hover:border-[#B89B5E] transition-all duration-500 luxury-shadow"
      >
        <div className="relative h-[240px] w-full overflow-hidden bg-[#0B1325]">
          <div className="absolute inset-0 bg-gradient-to-t from-[#080D19] to-transparent z-10 opacity-60" />

          {/* Cover photo */}
          {coverImg && (
            <img
              src={coverImg}
              alt={property.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              onError={e => { e.currentTarget.style.display = 'none'; }}
            />
          )}

          <div className="absolute top-4 right-4 z-20 flex gap-2">
            {property.v && (
              <span className="bg-[#B89B5E] text-[#080D19] text-[8px] font-mono uppercase tracking-widest px-2 py-1 rounded-[1px]">Verified</span>
            )}
            {property.off && (
              <span className="bg-[#8A2525] text-[#FDFBF7] text-[8px] font-mono uppercase tracking-widest px-2 py-1 rounded-[1px]">Private</span>
            )}
          </div>

          {/* Gallery count hint */}
          {imgs.length > 1 && (
            <div className="absolute bottom-3 right-3 z-20 font-mono text-[7px] tracking-[0.2em] text-[#94A3B8] bg-[#080D19]/70 px-2 py-1 rounded-[1px]">
              1 / {imgs.length} photos
            </div>
          )}
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

          <div className="flex flex-wrap gap-2 mb-4">
            {property.feats.slice(0, 2).map((f, i) => (
              <span key={i} className="text-[9px] font-mono text-[#94A3B8] border border-[#1E293B] px-2 py-1 rounded-[2px]">{f}</span>
            ))}
          </div>

          {/* Card CTA hint */}
          <div className="flex items-center gap-2 pt-3 border-t border-[#1E293B]">
            <span className="font-mono text-[8px] tracking-[0.25em] uppercase text-[#B89B5E] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              View Property →
            </span>
          </div>
        </div>
      </motion.div>

      {/* ══ MODAL ══ */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 9999,
              backgroundColor: 'rgba(8,13,25,0.92)',
              backdropFilter: 'blur(12px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 'clamp(12px,3vw,40px)',
              overflowY: 'auto',
            }}
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'relative', width: '100%', maxWidth: '960px',
                backgroundColor: '#0d1526', border: '1px solid #1E293B',
                borderRadius: '2px', overflow: 'hidden',
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Close */}
              <button
                onClick={closeModal}
                style={{
                  position: 'absolute', top: '16px', right: '16px', zIndex: 20,
                  fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.2em',
                  textTransform: 'uppercase', color: '#94A3B8',
                  border: '1px solid #1E293B', padding: '6px 12px',
                  backgroundColor: '#080D19', cursor: 'pointer', borderRadius: '2px',
                }}
              >
                ✕ Close
              </button>

              {/* Gallery */}
              <div style={{ position: 'relative', width: '100%', height: 'clamp(220px,40vw,480px)', backgroundColor: '#080D19', overflow: 'hidden' }}>
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImg}
                    src={imgs[activeImg]}
                    alt={property.name}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.5 }}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </AnimatePresence>

                {/* Gradient */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, #0d1526 100%)', pointerEvents: 'none' }} />

                {/* Badges */}
                <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', gap: '8px', zIndex: 10 }}>
                  {property.v && <span style={{ backgroundColor: '#B89B5E', color: '#080D19', fontFamily: 'monospace', fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: '1px' }}>Verified</span>}
                  {property.off && <span style={{ backgroundColor: '#8A2525', color: '#FDFBF7', fontFamily: 'monospace', fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: '1px' }}>Private</span>}
                </div>

                {/* Thumbnail strip */}
                <div style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 10 }}>
                  {imgs.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      style={{
                        width: 'clamp(48px,8vw,72px)', height: 'clamp(32px,5vw,48px)',
                        border: i === activeImg ? '1px solid #B89B5E' : '1px solid #1E293B',
                        borderRadius: '1px', overflow: 'hidden', cursor: 'pointer',
                        opacity: i === activeImg ? 1 : 0.55,
                        transition: 'all 0.3s ease', padding: 0, flexShrink: 0,
                      }}
                    >
                      <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Details */}
              <div style={{ padding: 'clamp(20px,4vw,40px)' }}>

                {/* Name + price */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
                  <div>
                    <p style={{ fontFamily: 'monospace', fontSize: 'clamp(7px,1.2vw,9px)', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#B89B5E', marginBottom: '6px' }}>{property.loc}</p>
                    <h2 style={{ fontFamily: 'serif', fontSize: 'clamp(20px,3.5vw,36px)', color: '#FDFBF7', fontWeight: 300, lineHeight: 1.15, margin: 0 }}>{property.name}</h2>
                    {property.ref && <p style={{ fontFamily: 'monospace', fontSize: '8px', color: '#64748B', letterSpacing: '0.2em', marginTop: '6px' }}>REF: {property.ref}</p>}
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ fontFamily: 'monospace', fontSize: 'clamp(14px,2vw,20px)', color: '#B89B5E', fontWeight: 700, margin: 0 }}>{formatPrice(property.kes)}</p>
                    <p style={{ fontFamily: 'monospace', fontSize: '8px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: '4px' }}>Est. Market Value · {currency}</p>
                  </div>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1px', backgroundColor: '#1E293B', border: '1px solid #1E293B', marginBottom: '24px' }}>
                  {[
                    { label: 'Bedrooms',  value: property.beds },
                    { label: 'Bathrooms', value: property.baths },
                    { label: 'SQ Metres', value: property.sqm },
                    { label: 'Ref No.',   value: property.ref?.split('-')[2] ?? 'PRV' },
                  ].map((s, i) => (
                    <div key={i} style={{ backgroundColor: '#0f1829', padding: 'clamp(12px,2vw,20px)', textAlign: 'center' }}>
                      <p style={{ fontFamily: 'serif', fontSize: 'clamp(18px,2.5vw,28px)', color: '#FDFBF7', margin: 0, lineHeight: 1 }}>{s.value}</p>
                      <p style={{ fontFamily: 'monospace', fontSize: 'clamp(7px,1vw,9px)', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: '4px' }}>{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Features */}
                <div style={{ marginBottom: '32px' }}>
                  <p style={{ fontFamily: 'monospace', fontSize: '8px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#B89B5E', marginBottom: '12px' }}>Property Features</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {property.feats.map((f, i) => (
                      <span key={i} style={{ fontFamily: 'monospace', fontSize: 'clamp(8px,1.2vw,10px)', color: '#94A3B8', border: '1px solid #1E293B', padding: '6px 12px', borderRadius: '2px', backgroundColor: '#080D19' }}>{f}</span>
                    ))}
                  </div>
                </div>

                {/* CTA buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', borderTop: '1px solid #1E293B', paddingTop: '24px' }}>
                  <button
                    onClick={() => { closeModal(); onSelect(property); }}
                    style={{
                      padding: 'clamp(14px,2vw,20px)',
                      backgroundColor: '#B89B5E', color: '#080D19',
                      fontFamily: 'monospace', fontSize: 'clamp(8px,1.2vw,10px)',
                      letterSpacing: '0.3em', textTransform: 'uppercase',
                      border: 'none', cursor: 'pointer', borderRadius: '2px',
                      fontWeight: 700, transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#d4b06e')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#B89B5E')}
                  >
                    View Analysis →
                  </button>
                  <button
                    onClick={closeModal}
                    style={{
                      padding: 'clamp(14px,2vw,20px)',
                      backgroundColor: 'transparent', color: '#FDFBF7',
                      fontFamily: 'monospace', fontSize: 'clamp(8px,1.2vw,10px)',
                      letterSpacing: '0.3em', textTransform: 'uppercase',
                      border: '1px solid #1E293B', cursor: 'pointer', borderRadius: '2px',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#B89B5E'; e.currentTarget.style.color = '#B89B5E'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#1E293B'; e.currentTarget.style.color = '#FDFBF7'; }}
                  >
                    Submit Inquiry →
                  </button>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}