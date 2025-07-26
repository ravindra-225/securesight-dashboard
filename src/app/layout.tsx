// app/layout.tsx
// --- LATEST STATE (modification below) ---
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/src/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SecureSight Dashboard',
  description: 'CCTV Monitoring System Dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="pt-24"> {/* MODIFIED: Changed from pt-16 to pt-24 for more distance */}
          {children}
        </main>
      </body>
    </html>
  );
}