'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [cmsData, setCmsData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('hero');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [editData, setEditData] = useState<any>({});

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

  useEffect(() => {
    const savedToken = localStorage.getItem('dksi_admin_token');
    if (!savedToken) {
      router.push('/admin');
      return;
    }
    setToken(savedToken);
    fetchCMS(savedToken);
  }, []);

  const fetchCMS = async (t: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/cms/draft`, {
        headers: { 'Authorization': `Bearer ${t}` }
      });
      const data = await res.json();
      setCmsData(data);
      setEditData(data);
    } catch (err) {
      showMessage('Gagal load data: ' + (err instanceof Error ? err.message : 'Unknown'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg: string, type: 'success' | 'error' = 'success') => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/cms/draft`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editData)
      });
      if (res.ok) {
        showMessage('✓ Draft berhasil disimpan!', 'success');
        setCmsData(editData);
      } else {
        showMessage('Gagal simpan', 'error');
      }
    } catch (err) {
      showMessage('Error: ' + (err instanceof Error ? err.message : 'Unknown'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!window.confirm('Yakin ingin publikasikan perubahan? Ini akan memperbarui website.')) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/cms/publish`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        showMessage('✓ Konten sudah dipublikasikan! Website terupdate.', 'success');
      } else {
        showMessage('Gagal publikasikan', 'error');
      }
    } catch (err) {
      showMessage('Error: ' + (err instanceof Error ? err.message : 'Unknown'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleFieldChange = (section: string, field: string, value: any) => {
    setEditData({
      ...editData,
      [section]: {
        ...editData[section],
        [field]: value
      }
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('dksi_admin_token');
    router.push('/admin');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (!cmsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Data tidak ditemukan</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-blue-500/30 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">DKSI Admin Panel</h1>
            <p className="text-blue-300 text-sm">Kelola konten website dengan mudah</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Message Alert */}
      {message && (
        <div className={`px-6 py-3 mx-6 mt-4 rounded-lg text-white ${
          message.includes('✓') ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {message}
        </div>
      )}

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-blue-500/20">
              <p className="text-blue-400 text-xs uppercase font-bold mb-4">Bagian Web</p>
              <div className="space-y-2">
                {[
                  { id: 'hero', label: '🎯 Hero / Banner Utama' },
                  { id: 'trustBar', label: '⭐ Data Terpercaya' },
                  { id: 'about', label: '📖 Tentang Kami' },
                  { id: 'sectors', label: '🏢 Sektor Bisnis' },
                  { id: 'services', label: '💼 Layanan' },
                  { id: 'portfolio', label: '🎨 Portfolio' },
                  { id: 'contact', label: '📧 Kontak' },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition text-sm font-medium ${
                      activeTab === item.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Editor */}
          <div className="lg:col-span-3">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20">
              <h2 className="text-2xl font-bold text-white mb-6">Edit {activeTab}</h2>

              {/* Hero Section Editor */}
              {activeTab === 'hero' && (
                <div className="space-y-6">
                  <InputField
                    label="Judul Utama"
                    value={editData.hero?.mainHeadline || ''}
                    onChange={(v: string) => handleFieldChange('hero', 'mainHeadline', v)}
                    placeholder="Masukkan judul utama"
                  />
                  <TextareaField
                    label="Deskripsi"
                    value={editData.hero?.mainSubheading || ''}
                    onChange={(v: string) => handleFieldChange('hero', 'mainSubheading', v)}
                    placeholder="Deskripsi singkat"
                    rows={3}
                  />
                  <InputField
                    label="Tombol CTA - Teks"
                    value={editData.hero?.primaryCtaText || ''}
                    onChange={(v: string) => handleFieldChange('hero', 'primaryCtaText', v)}
                  />
                  <InputField
                    label="Tombol CTA - Link"
                    value={editData.hero?.primaryCtaLink || ''}
                    onChange={(v: string) => handleFieldChange('hero', 'primaryCtaLink', v)}
                    placeholder="contoh: /contact"
                  />
                </div>
              )}

              {/* Trust Bar Editor */}
              {activeTab === 'trustBar' && (
                <div className="space-y-6">
                  <InputField
                    label="Tahun Berdiri"
                    value={editData.trustBar?.year || ''}
                    onChange={(v: string) => handleFieldChange('trustBar', 'year', v)}
                  />
                  <InputField
                    label="Sertifikasi (ISO 9001)"
                    value={editData.trustBar?.iso || ''}
                    onChange={(v: string) => handleFieldChange('trustBar', 'iso', v)}
                  />
                  <InputField
                    label="Jumlah Proyek"
                    value={editData.trustBar?.projects || ''}
                    onChange={(v: string) => handleFieldChange('trustBar', 'projects', v)}
                  />
                </div>
              )}

              {/* About Section Editor */}
              {activeTab === 'about' && (
                <div className="space-y-6">
                  <InputField
                    label="Headline"
                    value={editData.about?.headline || ''}
                    onChange={(v: string) => handleFieldChange('about', 'headline', v)}
                  />
                  <TextareaField
                    label="Paragraf 1"
                    value={editData.about?.paragraphs?.[0] || ''}
                    onChange={(v: string) => {
                      const paras = editData.about?.paragraphs || ['', '', ''];
                      paras[0] = v;
                      handleFieldChange('about', 'paragraphs', paras);
                    }}
                    rows={4}
                  />
                  <TextareaField
                    label="Paragraf 2"
                    value={editData.about?.paragraphs?.[1] || ''}
                    onChange={(v: string) => {
                      const paras = editData.about?.paragraphs || ['', '', ''];
                      paras[1] = v;
                      handleFieldChange('about', 'paragraphs', paras);
                    }}
                    rows={4}
                  />
                </div>
              )}

              {/* Contact Section Editor */}
              {activeTab === 'contact' && (
                <div className="space-y-6">
                  <InputField
                    label="Email"
                    value={editData.contact?.email || ''}
                    onChange={(v: string) => handleFieldChange('contact', 'email', v)}
                    type="email"
                  />
                  <InputField
                    label="Nomor Telepon"
                    value={editData.contact?.phone || ''}
                    onChange={(v: string) => handleFieldChange('contact', 'phone', v)}
                  />
                  <InputField
                    label="Alamat"
                    value={editData.contact?.address || ''}
                    onChange={(v: string) => handleFieldChange('contact', 'address', v)}
                  />
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 flex gap-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-lg transition"
                >
                  {saving ? '💾 Menyimpan...' : '💾 Simpan Sebagai Draft'}
                </button>
                <button
                  onClick={handlePublish}
                  disabled={saving}
                  className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold rounded-lg transition"
                >
                  {saving ? '🚀 Publishing...' : '🚀 Publikasikan ke Web'}
                </button>
                <button
                  onClick={() => setEditData(cmsData)}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg transition"
                >
                  ↶ Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder = '', type = 'text' }: any) {
  return (
    <div>
      <label className="block text-white font-medium mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-white/10 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
      />
    </div>
  );
}

function TextareaField({ label, value, onChange, placeholder = '', rows = 3 }: any) {
  return (
    <div>
      <label className="block text-white font-medium mb-2">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-3 bg-white/10 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
      />
    </div>
  );
}
