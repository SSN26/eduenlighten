import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VoiceAssistant from '@/components/VoiceAssistant';

export const metadata: Metadata = {
  title: 'EduEnlighten Digital School | Empowering Minds. Unlocking Potential.',
  description:
    'A modern, scalable online education platform delivering Cambridge & ZIMSEC high-school pathways alongside practical Digital Skills training.',
  keywords: [
    'online school',
    'Cambridge IGCSE',
    'Cambridge A Level',
    'ZIMSEC O Level',
    'ZIMSEC A Level',
    'frontend web development',
    'backend API',
    'Zimbabwe education',
    'digital skills',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-[#060D17] text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <VoiceAssistant />
      </body>
    </html>
  );
}
