import { NextRequest, NextResponse } from 'next/server';

interface ActiveSession {
  sessionId: string;
  userEmail?: string;
  startTime: number;
  lastActivity: number;
  browserInfo: string;
}

// In-memory store for active sessions
const activeSessions = new Map<string, ActiveSession>();

// Auto-cleanup inactive sessions (>2 minutes)
const INACTIVE_THRESHOLD = 2 * 60 * 1000; // 2 minutes in milliseconds

function cleanupInactiveSessions() {
  const now = Date.now();
  for (const [sessionId, session] of activeSessions.entries()) {
    if (now - session.lastActivity > INACTIVE_THRESHOLD) {
      activeSessions.delete(sessionId);
    }
  }
}

// POST: Register or update active session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, userEmail, browserInfo } = body;

    if (!sessionId && !userEmail) {
      return NextResponse.json(
        { error: 'Session ID or user email is required' },
        { status: 400 }
      );
    }

    const now = Date.now();

    // For authenticated users, use email as the key (one entry per user)
    // For anonymous users, use sessionId as the key (one entry per browser)
    const storageKey = userEmail || sessionId;

    // If user is authenticated, remove any old anonymous sessions for this browser
    if (userEmail) {
      activeSessions.delete(sessionId);
    }

    const existingSession = activeSessions.get(storageKey);

    if (existingSession) {
      // Update existing session
      existingSession.lastActivity = now;
      existingSession.browserInfo = browserInfo || existingSession.browserInfo;
      if (userEmail) {
        existingSession.userEmail = userEmail;
      }
    } else {
      // Create new session
      activeSessions.set(storageKey, {
        sessionId: storageKey,
        userEmail: userEmail || undefined,
        startTime: now,
        lastActivity: now,
        browserInfo: browserInfo || 'Unknown',
      });
    }

    // Cleanup inactive sessions
    cleanupInactiveSessions();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating active session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET: Retrieve all active users
export async function GET() {
  try {
    // Cleanup before returning
    cleanupInactiveSessions();

    const activeUsers = Array.from(activeSessions.values()).map((session) => ({
      sessionId: session.sessionId,
      userType: session.userEmail ? 'Authenticated' : 'Anonymous',
      userEmail: session.userEmail,
      sessionDuration: Date.now() - session.startTime,
      lastActivity: session.lastActivity,
      browserInfo: session.browserInfo,
    }));

    return NextResponse.json({
      success: true,
      count: activeUsers.length,
      users: activeUsers,
    });
  } catch (error) {
    console.error('Error fetching active users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
