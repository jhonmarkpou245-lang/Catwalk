import type { Metadata } from 'next';
import { Cairo, Playfair_Display } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import './globals.css';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cairo',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'كاتووك | Catwalk Haute Couture',
  description: 'بوتيك كاتووك للأزياء النسائية الراقية وتصاميم الهوت كوتور الفاخرة',
  keywords: ['أزياء نسائية', 'فساتين سهرة', 'هوت كوتور', 'كاتووك', 'Catwalk', 'تصاميم فاخرة'],
  openGraph: {
    title: 'كاتووك | Catwalk Haute Couture',
    description: 'بوتيك كاتووك للأزياء النسائية الراقية وتصاميم الهوت كوتور الفاخرة',
    locale: 'ar_SA',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col bg-surface-soft text-noir font-body antialiased selection:bg-gold-accent selection:text-noir">
        <Header />
        <div className="flex-1">
          {children}
        </div>
        <Footer />
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#111111',
              color: '#FAF8F5',
              fontFamily: 'var(--font-cairo)',
              border: '1px solid #D4942B',
              borderRadius: '0.25rem',
              padding: '12px 20px',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
            },
            success: {
              iconTheme: {
                primary: '#D4942B',
                secondary: '#FAF8F5',
              },
            },
            error: {
              iconTheme: {
                primary: '#E53E3E',
                secondary: '#FAF8F5',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
