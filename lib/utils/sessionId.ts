/**
 * Generate a unique session ID for tracking anonymous users
 * Uses crypto.randomUUID() if available, falls back to timestamp-based ID
 */
export function generateSessionId(): string {
  if (typeof window === 'undefined') return '';

  try {
    // Try to use crypto.randomUUID() (modern browsers)
    if (window.crypto && window.crypto.randomUUID) {
      return window.crypto.randomUUID();
    }
  } catch (e) {
    // Fallback if crypto.randomUUID() is not available
  }

  // Fallback: Generate UUID v4 manually
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}


/**
 * Get or create session ID from localStorage
 * Session ID persists across all tabs in the same browser
 * This ensures multiple tabs count as one user
 */
export function getSessionId(): string {
  if (typeof window === 'undefined') return '';

  const STORAGE_KEY = 'fly_fim_session_id';

  try {
    // Try to get existing session ID from localStorage
    let sessionId = localStorage.getItem(STORAGE_KEY);

    if (!sessionId) {
      // Generate new session ID if none exists
      sessionId = generateSessionId();
      localStorage.setItem(STORAGE_KEY, sessionId);
    }

    return sessionId;
  } catch (e) {
    // If localStorage is not available, generate a temporary ID
    return generateSessionId();
  }
}

/**
 * Get browser and device information
 */
export function getBrowserInfo(): string {
  if (typeof window === 'undefined') return 'Unknown';

  const userAgent = window.navigator.userAgent;

  // Detect browser
  let browser = 'Unknown';
  if (userAgent.includes('Firefox')) browser = 'Firefox';
  else if (userAgent.includes('Chrome')) browser = 'Chrome';
  else if (userAgent.includes('Safari')) browser = 'Safari';
  else if (userAgent.includes('Edge')) browser = 'Edge';
  else if (userAgent.includes('Opera')) browser = 'Opera';

  // Detect device
  let device = 'Desktop';
  if (/Mobile|Android|iPhone|iPad|iPod/.test(userAgent)) {
    if (/iPad/.test(userAgent)) device = 'iPad';
    else if (/iPhone|iPod/.test(userAgent)) device = 'iPhone';
    else if (/Android/.test(userAgent)) device = 'Android';
    else device = 'Mobile';
  }

  return `${browser} on ${device}`;
}
