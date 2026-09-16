'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@dksi.co.id');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      
      if (data.status === 'success' && data.token) {
        localStorage.setItem('dksi_admin_token', data.token);
        router.push('/admin/dashboard');
      } else {
        setError(data.message || 'Login gagal. Email/password salah.');
      }
    } catch (err) {
      setError('Koneksi error. Pastikan backend berjalan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">DKSI</h1>
          <p className="text-blue-300 text-lg">Admin Panel</p>
          <p className="text-gray-400 text-sm mt-2">Kelola konten website Anda</p>
        </div>

        {/* Login Card */}
        <form
          onSubmit={handleLogin}
          className="bg-white/10 backdrop-blur-md border border-blue-500/30 rounded-xl p-8 shadow-2xl"
        >
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
              <p className="text-red-200 text-sm">⚠️ {error}</p>
            </div>
          )}

          {/* Email Input */}
          <div className="mb-6">
            <label className="block text-white font-medium mb-3">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@dksi.co.id"
              className="w-full px-4 py-3 bg-white/10 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
              disabled={loading}
            />
          </div>

          {/* Password Input */}
          <div className="mb-8">
            <label className="block text-white font-medium mb-3">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              className="w-full px-4 py-3 bg-white/10 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
              disabled={loading}
            />
            <p className="text-gray-400 text-xs mt-2">Hubungi admin untuk reset password</p>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 text-white font-bold rounded-lg transition duration-300"
          >
            {loading ? '🔄 Sedang login...' : '🔓 Masuk'}
          </button>

          {/* Demo Text */}
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-blue-300 text-xs">
              <strong>Demo:</strong><br/>
              Email: admin@dksi.co.id<br/>
              Password: admin123
            </p>
          </div>
        </form>

        {/* Features Info */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="text-gray-300">
            <p className="text-2xl mb-2">✏️</p>
            <p className="text-xs">Edit Konten</p>
          </div>
          <div className="text-gray-300">
            <p className="text-2xl mb-2">💾</p>
            <p className="text-xs">Simpan Otomatis</p>
          </div>
          <div className="text-gray-300">
            <p className="text-2xl mb-2">🌐</p>
            <p className="text-xs">Live Update</p>
          </div>
        </div>
      </div>
    </div>
  );
}
