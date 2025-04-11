'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/auth-store';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const { user, getUser, loading } = useAuthStore();

  const isProtectedRoute =
    pathname.startsWith('/forms') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/profile');

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (!loading && isProtectedRoute && !user) {
      router.push('/auth/login');
    }
  }, [loading, isProtectedRoute, user , router]);

  if (loading || (isProtectedRoute && !user)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-inherit text-white">
        <div className="flex flex-col items-center space-y-4">
          <h1 className="text-3xl md:text-5xl text-primary font-bold tracking-tight">FeedForms</h1>
          <p className="text-sm md:text-base text-muted-foreground text-center">
            Analyzing feedback, delivering insights...
          </p>
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
