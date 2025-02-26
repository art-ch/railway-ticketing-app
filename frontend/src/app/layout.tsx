import type { Metadata } from 'next';
import { Noto_Sans, Doto } from 'next/font/google';
import './globals.css';

const notoSans = Noto_Sans({
  variable: '--font-noto-sans',
  subsets: ['latin']
});

const doto = Doto({
  variable: '--font-doto',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Railway Ticketing App',
  description: 'Railway is the best mode of transportation'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${notoSans.variable} ${doto.variable} font-primary antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
