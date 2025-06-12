'use client';

import AdminProtected from '@/components/AdminProtected';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProtected>
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </AdminProtected>
  );
} 