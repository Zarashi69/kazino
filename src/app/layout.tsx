import './globals.css';
import { ReactNode } from 'react';
import LayoutClient from '@/components/ui/layout-client';

export const metadata = {
  title: 'Билеты на концерты',
  description: 'Система бронирования билетов на концерты',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="font-sans bg-gradient-to-br from-[#0f0026] via-[#1a003a] to-[#0a001a] text-white overflow-x-hidden relative">
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
