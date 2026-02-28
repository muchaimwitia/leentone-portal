'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Disable custom cursor on mobile/touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;
    
    setIsVisible(true);

    const moveCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Detect if hovering over a clickable element
      const target = e.target as HTMLElement;
      setIsPointer(
        window.getComputedStyle(target).cursor === 'pointer' || 
        target.tagName.toLowerCase() === 'button' || 
        target.tagName.toLowerCase() === 'a'
      );
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* The main trailing ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-[#B8922A] rounded-full pointer-events-none z-[9999] flex items-center justify-center mix-blend-difference"
        animate={{
          x: position.x - 16, // Center the 32px ring
          y: position.y - 16,
          scale: isPointer ? 1.8 : 1,
          backgroundColor: isPointer ? 'rgba(184, 146, 42, 0.15)' : 'transparent'
        }}
        transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.6 }}
      >
        {/* The tiny precise center dot */}
        <motion.div 
          className="w-1 h-1 bg-[#C9A84C] rounded-full"
          animate={{ opacity: isPointer ? 0 : 1 }}
        />
      </motion.div>
    </>
  );
}