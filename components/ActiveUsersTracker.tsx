'use client';

import { useActiveUsersTracking } from '@/lib/hooks/useActiveUsersTracking';
import { useAuth } from '@/lib/hooks/useAuth';

/**
 * Component to track active users across the website
 * Automatically tracks both authenticated and anonymous users
 */
export default function ActiveUsersTracker() {
  const { user } = useAuth();

  // Track user activity with their email if authenticated
  useActiveUsersTracking({
    userEmail: user?.email,
  });

  // This component renders nothing
  return null;
}
