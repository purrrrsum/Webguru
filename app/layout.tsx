import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'thesupport.agency | Premium Creative Services',
  description: 'On-demand design, video editing, content creation, and meticulous proofreading for marketing teams. Affordable subscriptions and fast turnarounds.',
  keywords: ['design', 'video editing', 'content creation', 'proofreading', 'creative agency', 'marketing support', 'subscription agency'],
  openGraph: {
    title: 'thesupport.agency | Premium Creative Services',
    description: 'On-demand design, video editing, content creation, and meticulous proofreading for marketing teams.',
    type: 'website',
    locale: 'en_US',
    siteName: 'thesupport.agency',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'thesupport.agency | Premium Creative Services',
    description: 'On-demand design, video editing, content creation, and meticulous proofreading for marketing teams.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

