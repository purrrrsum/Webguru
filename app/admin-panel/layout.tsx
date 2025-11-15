import { ReactNode } from 'react';
import AdminPanelAuth from '@/components/AdminPanelAuth';

export default function AdminPanelLayout({ children }: { children: ReactNode }) {
  return <AdminPanelAuth>{children}</AdminPanelAuth>;
}

