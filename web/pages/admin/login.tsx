import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

export default function AdminLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [setupMode, setSetupMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to dashboard or intended page
        const redirect = router.query.redirect as string || '/admin/dashboard';
        router.push(redirect);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(`Network error: ${error.message || 'Please try again.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSetup = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username || 'admin',
          password: formData.password || 'admin123',
          email: 'admin@minevote.com'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setError('');
        alert('Admin user created successfully! You can now log in.');
        setSetupMode(false);
      } else {
        setError(data.error || 'Setup failed');
      }
    } catch (error: any) {
      console.error('Setup error:', error);
      setError(`Setup error: ${error.message || 'Please try again.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setIsLoading(true);
    setError('');

    try {
      // First test basic API
      const basicResponse = await fetch('/api/test', {
        method: 'GET',
      });

      if (!basicResponse.ok) {
        throw new Error(`Basic API test failed: ${basicResponse.status}`);
      }

      const basicData = await basicResponse.json();
      console.log('Basic API test:', basicData);

      // Then test admin API
      const response = await fetch('/api/admin/test', {
        method: 'GET',
      });

      const data = await response.json();

      if (response.ok) {
        setError('');
        alert(`Database connection successful!\n\nEnvironment check:\n- Supabase URL: ${data.environment.hasSupabaseUrl ? '✓' : '✗'}\n- Service Key: ${data.environment.hasSupabaseServiceKey ? '✓' : '✗'}\n- JWT Secret: ${data.environment.hasJwtSecret ? '✓' : '✗'}`);
      } else {
        setError(data.error || 'Connection test failed');
      }
    } catch (error: any) {
      console.error('Test error:', error);
      setError(`Test error: ${error.message || 'Please try again.'}`);
    } finally {
      setIsLoading(false);
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
        <title>Admin Login - MineVote</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-emerald-100">
              <span className="text-2xl">🛡️</span>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
              Admin Login
            </h2>
            <p className="mt-2 text-center text-sm text-gray-400">
              MineVote Administration Panel
            </p>
          </div>

          {/* Setup Section */}
          <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <h3 className="text-sm font-medium text-blue-300 mb-2">First Time Setup</h3>
            <p className="text-xs text-blue-200 mb-3">
              If this is your first time accessing the admin panel, you may need to create an admin user.
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleSetup}
                disabled={isLoading}
                className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Setting up...' : 'Create Admin User (admin/admin123)'}
              </button>
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isLoading}
                className="w-full px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-md transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Testing...' : 'Test Database Connection'}
              </button>
              <button
                type="button"
                onClick={async () => {
                  try {
                    const response = await fetch('/api/test');
                    const data = await response.json();
                    alert(`Basic API Test: ${data.message}`);
                  } catch (error) {
                    alert(`Basic API Test Failed: ${error}`);
                  }
                }}
                disabled={isLoading}
                className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition-colors disabled:opacity-50"
              >
                Test Basic API
              </button>
            </div>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your username"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>

            <div className="text-center">
              <Link
                href="/"
                className="text-sm text-emerald-400 hover:text-emerald-300"
              >
                ← Back to main site
              </Link>
            </div>
          </form>

          <div className="mt-8 text-center text-xs text-gray-500">
            <p>Secure admin access only</p>
            <p>All actions are logged and monitored</p>
          </div>
        </div>
      </div>
    </>
  );
}
