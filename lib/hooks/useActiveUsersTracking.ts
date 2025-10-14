'use client';

import { useEffect } from 'react';
import { getSessionId, getBrowserInfo } from '@/lib/utils/sessionId';

interface UseActiveUsersTrackingProps {
  userEmail?: string;
}

/**
 * Hook to track active users on the website
 * Sends heartbeat every 30 seconds to keep session active
 */
export function useActiveUsersTracking({ userEmail }: UseActiveUsersTrackingProps = {}) {
  useEffect(() => {
    const sessionId = getSessionId();
    const browserInfo = getBrowserInfo();

    // Function to send heartbeat
    const sendHeartbeat = async () => {
      try {
        await fetch('/api/active-users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId,
            userEmail,
            browserInfo,
          }),
        });
      } catch (error) {
        console.error('Error sending heartbeat:', error);
      }
    };

    // Send initial heartbeat
    sendHeartbeat();

    // Send heartbeat every 30 seconds
    const interval = setInterval(sendHeartbeat, 30000);

    // Cleanup on unmount
    return () => {
      clearInterval(interval);
    };
  }, [userEmail]);
}
