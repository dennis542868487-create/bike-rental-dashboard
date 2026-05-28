import type { Metadata } from 'next';
import { ServiceWorkerRegister } from '@/components/service-worker-register';
import './globals.css';

export const metadata: Metadata = {
  title: 'Wander Bike Dashboard',
  description: 'Internal rental dashboard for Wander Bike',
  manifest: '/manifest.webmanifest',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
