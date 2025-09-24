import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useServersRealtime, useUsersRealtime, useVotesRealtime, RealtimePayload } from '../../hooks/useAdminRealtime';

interface DashboardStats {
  totalServers: number;
  totalUsers: number;
  totalVotes: number;
  pendingServers: number;
  bannedUsers: number;
  votesToday: number;
  recentActivity: any[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalServers: 0,
    totalUsers: 0,
    totalVotes: 0,
    pendingServers: 0,
    bannedUsers: 0,
    votesToday: 0,
    recentActivity: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchDashboardStats();
  }, []);

  // Real-time updates
  useServersRealtime((payload: RealtimePayload) => {
    if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
      fetchDashboardStats();
    }
  });

  useUsersRealtime((payload: RealtimePayload) => {
    if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
      fetchDashboardStats();
    }
  });

  useVotesRealtime((payload: RealtimePayload) => {
    if (payload.eventType === 'INSERT') {
      fetchDashboardStats();
    }
  });

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard - MineVote</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gray-900">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <Link href="/admin/dashboard" className="flex items-center space-x-2 text-emerald-400 text-xl font-bold">
                  <span className="w-8 h-8 flex items-center justify-center">🛡️</span>
                  <span>MineVote Admin</span>
                </Link>
                
                <nav className="hidden md:flex space-x-8">
                  <Link href="/admin/dashboard" className="text-emerald-400 font-medium">Dashboard</Link>
                  <Link href="/admin/servers" className="text-gray-300 hover:text-white">Servers</Link>
                  <Link href="/admin/users" className="text-gray-300 hover:text-white">Users</Link>
                  <Link href="/admin/votes" className="text-gray-300 hover:text-white">Votes</Link>
                  <Link href="/admin/reports" className="text-gray-300 hover:text-white">Reports</Link>
                  <Link href="/admin/settings" className="text-gray-300 hover:text-white">Settings</Link>
                </nav>
              </div>
              
              <div className="flex items-center space-x-4">
                <Link href="/" className="text-gray-300 hover:text-white text-sm">
                  View Site
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 mt-2">Welcome to the MineVote administration panel</p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">🖥️</div>
                    <div>
                      <p className="text-gray-400 text-sm">Total Servers</p>
                      <p className="text-white text-2xl font-bold">{stats.totalServers.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">👥</div>
                    <div>
                      <p className="text-gray-400 text-sm">Total Users</p>
                      <p className="text-white text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">🗳️</div>
                    <div>
                      <p className="text-gray-400 text-sm">Total Votes</p>
                      <p className="text-white text-2xl font-bold">{stats.totalVotes.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">⏳</div>
                    <div>
                      <p className="text-gray-400 text-sm">Pending Servers</p>
                      <p className="text-white text-2xl font-bold">{stats.pendingServers.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">🚫</div>
                    <div>
                      <p className="text-gray-400 text-sm">Banned Users</p>
                      <p className="text-white text-2xl font-bold">{stats.bannedUsers.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">📊</div>
                    <div>
                      <p className="text-gray-400 text-sm">Votes Today</p>
                      <p className="text-white text-2xl font-bold">{stats.votesToday.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">📈</div>
                    <div>
                      <p className="text-gray-400 text-sm">Growth Rate</p>
                      <p className="text-white text-2xl font-bold">+12.5%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-800 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
                  <div className="space-y-3">
                    <Link
                      href="/admin/servers?filter=pending"
                      className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md text-center"
                    >
                      Review Pending Servers ({stats.pendingServers})
                    </Link>
                    <Link
                      href="/admin/reports"
                      className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-center"
                    >
                      View Reports
                    </Link>
                    <Link
                      href="/admin/users?filter=banned"
                      className="block w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-md text-center"
                    >
                      Manage Banned Users ({stats.bannedUsers})
                    </Link>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
                  <div className="space-y-3">
                    {stats.recentActivity.length > 0 ? (
                      stats.recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center space-x-3 text-sm">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <span className="text-gray-300">{activity.description}</span>
                          <span className="text-gray-500 ml-auto">{activity.time}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm">No recent activity</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}
