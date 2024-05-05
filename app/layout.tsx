import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';

import Providers from '#/components/providers';

import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'drivegram',
  description: 'File management for Telegram',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.className}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
