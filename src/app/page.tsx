'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import LandingPage from './landing.page';
import FullScreenLoader from '@/components/ui-components/loader.screen';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== 'authenticated') return;

    // Already signed in — send the user straight to their own dashboard.
    const role = session?.user?.role;
    const page =
      role === 'admin'
        ? 'admin'
        : role === 'faculty'
          ? 'faculty'
          : role === 'student'
            ? 'student'
            : 'staff';

    router.push(`/${page}/dashboard`);
  }, [session, status, router]);

  // Visitors who are not signed in get the landing page; everyone else sees a
  // loader for the moment it takes to bounce them to their dashboard.
  if (status === 'unauthenticated') {
    return <LandingPage />;
  }

  return <FullScreenLoader />;
}
