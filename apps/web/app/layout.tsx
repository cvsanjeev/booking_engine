import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Service Apartments - Book Your Stay',
  description: 'Modern service apartments for business and leisure travelers',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        {children}
      </body>
    </html>
  );
}