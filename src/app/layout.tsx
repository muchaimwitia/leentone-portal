import type { Metadata } from 'next';
import { Cormorant_Garamond, DM_Sans, DM_Mono } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], variable: '--font-cormorant' });
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['300', '400', '500', '600'], variable: '--font-dm-sans' });
const dmMono = DM_Mono({ subsets: ['latin'], weight: ['300', '400', '500'], variable: '--font-dm-mono' });

export const metadata: Metadata = {
  title: 'Leentone Solutions Limited | Investment Portal',
  description: 'Nairobi’s Premier Luxury Residential Property Portfolio.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable} ${dmMono.variable} scroll-smooth`}>
      <body className="font-sans bg-bg text-ink antialiased min-h-screen overflow-x-hidden">
        <div className="noise-overlay"></div>
        {children}
      </body>
    </html>
  );
}