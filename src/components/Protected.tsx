'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Role } from '@prisma/client';
import { ReactNode } from 'react';
import Link from 'next/link';

interface ProtectedProps {
  children: ReactNode;
  requiredRole?: Role[];
  fallback?: ReactNode;
}

export function Protected({ children, requiredRole, fallback }: ProtectedProps) {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner-border animate-spin" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback || (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p className="text-gray-600 mb-6">Please log in to continue.</p>
        <Link href="/login" className="btn btn-primary">
          Go to Login
        </Link>
      </div>
    );
  }

  if (requiredRole && !requiredRole.includes(user?.role as Role)) {
    return fallback || (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Insufficient Permissions</h2>
        <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
        <Link href="/" className="btn btn-primary">
          Go Home
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}

export function AdminOnly({ children }: { children: ReactNode }) {
  return (
    <Protected requiredRole={['ADMIN']}>
      {children}
    </Protected>
  );
}

export function LocalProOnly({ children }: { children: ReactNode }) {
  return (
    <Protected requiredRole={['LOCAL_PRO']}>
      {children}
    </Protected>
  );
}

export function CustomerOnly({ children }: { children: ReactNode }) {
  return (
    <Protected requiredRole={['CUSTOMER']}>
      {children}
    </Protected>
  );
}
