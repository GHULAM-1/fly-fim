"use client";
import React, { useState, useEffect } from "react";
import { Users as UsersIcon, RefreshCw, Clock, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActiveUser {
  sessionId: string;
  userType: 'Authenticated' | 'Anonymous';
  userEmail?: string;
  sessionDuration: number;
  lastActivity: number;
  browserInfo: string;
}

interface ActiveUsersResponse {
  success: boolean;
  count: number;
  users: ActiveUser[];
}

const ActiveUsers = () => {
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Format duration from milliseconds to readable string
  const formatDuration = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  // Format last activity time
  const formatLastActivity = (timestamp: number): string => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    if (seconds < 60) {
      return 'Just now';
    } else if (seconds < 120) {
      return '1 minute ago';
    } else {
      return `${Math.floor(seconds / 60)} minutes ago`;
    }
  };

  // Load active users
  const loadActiveUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/active-users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ActiveUsersResponse = await response.json();
      setActiveUsers(data.users || []);
    } catch (err) {
      console.error('Error loading active users:', err);
      setError('Failed to load active users: ' + (err as Error).message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Refresh active users
  const handleRefresh = () => {
    setRefreshing(true);
    loadActiveUsers();
  };

  // Fetch users on component mount
  useEffect(() => {
    loadActiveUsers();

    // Auto-refresh every 10 seconds
    const interval = setInterval(() => {
      loadActiveUsers();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (loading && !refreshing) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading active users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadActiveUsers} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Top Bar */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-[1200px] mx-auto px-[24px] xl:px-0 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-gray-800">Active Users</h1>
              <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-800 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">{activeUsers.length} online</span>
              </div>
            </div>
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Active Users Table */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="max-w-[1200px] mx-auto px-[24px] xl:px-0 py-6">
          <div className="bg-white rounded-lg border border-gray-200 max-h-[625px] flex flex-col relative">
            <div className="overflow-x-auto overflow-y-auto flex-1">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email / Session ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Browser / Device
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Session Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Activity
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {activeUsers.map((user) => (
                    <tr key={user.sessionId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <UsersIcon className={`w-5 h-5 mr-2 ${
                            user.userType === 'Authenticated'
                              ? 'text-green-600'
                              : 'text-gray-400'
                          }`} />
                          <span className={`text-sm font-medium ${
                            user.userType === 'Authenticated'
                              ? 'text-green-700'
                              : 'text-gray-600'
                          }`}>
                            {user.userType}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          {user.userEmail ? (
                            <span className="text-gray-900 font-medium">
                              {user.userEmail}
                            </span>
                          ) : (
                            <span className="text-gray-500 font-mono text-xs">
                              {user.sessionId.substring(0, 8)}...
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-600">
                          <Monitor className="w-4 h-4 mr-2 text-gray-400" />
                          {user.browserInfo}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-2 text-gray-400" />
                          {formatDuration(user.sessionDuration)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatLastActivity(user.lastActivity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {activeUsers.length === 0 && (
                <div className="text-center py-12">
                  <UsersIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No active users at the moment</p>
                  <p className="text-gray-400 text-sm mt-2">Users will appear here when they visit the website</p>
                </div>
              )}
            </div>
          </div>

          {/* Auto-refresh notice */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              Auto-refreshing every 10 seconds • Sessions timeout after 2 minutes of inactivity
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveUsers;
