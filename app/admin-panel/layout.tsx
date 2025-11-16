'use client';

import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import AdminPanelAuth from '@/components/AdminPanelAuth';

export default function AdminPanelLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider basePath="/api/admin/auth">
      <AdminPanelAuth>{children}</AdminPanelAuth>
    </SessionProvider>
  );
}

