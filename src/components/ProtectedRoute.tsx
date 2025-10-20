'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  allowedRoles: Array<'CLIENTE' | 'CORRETOR' | 'ADMIN'>;
  children: React.ReactNode;
}

export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || !role || !allowedRoles.includes(role as ProtectedRouteProps['allowedRoles'][number])) {
      router.replace('/auth/login');
    }
  }, [allowedRoles, router]);

  return <>{children}</>;
}
