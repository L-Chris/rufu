import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Rufu',
  description: 'A dashboard with widgets similar to Glance, deployed on Deno.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
