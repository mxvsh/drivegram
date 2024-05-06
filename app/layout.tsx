import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';

import GlobalProvider from '#/lib/providers/global';

import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'drivegram',
  description:
    'Personal cloud storage for Telegram',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className}`}>
        <GlobalProvider>
          {children}
        </GlobalProvider>
      </body>
    </html>
  );
}
