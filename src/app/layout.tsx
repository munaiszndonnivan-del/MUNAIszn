import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MUNAISZN Business Manager',
  description: 'Business Management & POS for Kenyan Retail & Service Enterprises',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#060908] text-[#F3F7F4]">{children}</body>
    </html>
  );
}
