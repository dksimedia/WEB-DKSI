'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('admin@dksi.co.id');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [cmsData, setCmsData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.status === 'success') {
        setToken(data.token);
        setIsLoggedIn(true);
        localStorage.setItem('dksi_admin_token', data.token);
        await fetchCMS(data.token);
      } else {
        setError(data.message || 'Login gagal');
      }
    } catch (err) {
      setError('Koneksi error: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const fetchCMS = async (t: string) => {
    try {
      const res = await fetch(`${API_URL}/cms`, {
        headers: { 'Authorization': `Bearer ${t}` }
      });
      const data = await res.json();
      setCmsData(data);
    } catch (err) {
      console.error('CMS fetch error:', err);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setToken('');
    localStorage.removeItem('dksi_admin_token');
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('dksi_admin_token');
    if (savedToken) {
      setToken(savedToken);
      setIsLoggedIn(true);
      fetchCMS(savedToken);
    }
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">DKSI Admin</h1>
          <p className="text-slate-600 mb-6">Kelola konten website</p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-slate-700 font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
              disabled={loading}
            />
          </div>

          <div className="mb-6">
            <label className="block text-slate-700 font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="admin123"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Menghubungkan...' : 'Login'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900">DKSI CMS</h2>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Konten Website</h3>
          
          {cmsData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {Object.entries(cmsData).map(([key, value]: any) => (
                <div key={key} className="p-3 bg-slate-50 rounded border border-slate-200">
                  <p className="font-medium text-slate-700 text-sm">{key}</p>
                  <p className="text-slate-600 text-xs mt-1 truncate">
                    {typeof value === 'object' ? JSON.stringify(value).slice(0, 100) : String(value).slice(0, 100)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-600">Loading CMS data...</p>
          )}
        </div>
      </div>
    </div>
  );
}
