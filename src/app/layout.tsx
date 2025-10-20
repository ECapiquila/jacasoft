import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import clsx from 'clsx';
import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: {
    default: 'Jacasoft Imobiliária',
    template: '%s | Jacasoft Imobiliária'
  },
  description: 'Marketplace imobiliário minimalista para compra e arrendamento com pagamentos offline e gestão completa.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-PT">
      <body className={clsx(inter.className, 'bg-neutral-50 min-h-screen')}>{children}</body>
    </html>
  );
}
