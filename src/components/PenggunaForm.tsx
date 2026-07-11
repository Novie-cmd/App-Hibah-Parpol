/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Save, User, Mail, Shield, Landmark, UserCheck } from 'lucide-react';
import { Pengguna, Partai } from '../types';

interface PenggunaFormProps {
  pengguna: Pengguna | null; // null if adding new user
  partai: Partai[];
  onSave: (u: Pengguna) => void;
  onClose: () => void;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&q=80',
  'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=150&h=150&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&q=80'
];

export default function PenggunaForm({
  pengguna,
  partai,
  onSave,
  onClose
}: PenggunaFormProps) {
  const [namaLengkap, setNamaLengkap] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Pengguna['role']>('Operator Partai');
  const [status, setStatus] = useState<Pengguna['status']>('Aktif');
  const [partaiId, setPartaiId] = useState('');
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    if (pengguna) {
      setNamaLengkap(pengguna.namaLengkap);
      setUsername(pengguna.username);
      setEmail(pengguna.email);
      setRole(pengguna.role);
      setStatus(pengguna.status);
      setPartaiId(pengguna.partaiId || '');
      setAvatar(pengguna.avatar);
    } else {
      setNamaLengkap('');
      setUsername('');
      setEmail('');
      setRole('Operator Partai');
      setStatus('Aktif');
      // Default to first party if available
      setPartaiId(partai[0]?.id || '');
      // Random preset avatar
      setAvatar(AVATAR_PRESETS[Math.floor(Math.random() * AVATAR_PRESETS.length)]);
    }
  }, [pengguna, partai]);

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran berkas avatar maksimal 2 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setAvatar(event.target.result as string);
      }
    };
    reader.onerror = () => {
      alert("Gagal membaca berkas gambar.");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!namaLengkap || !username || !email) {
      alert("Nama Lengkap, Username, dan Email wajib diisi.");
      return;
    }

    // basic validations
    if (username.includes(' ')) {
      alert("Username tidak boleh mengandung spasi.");
      return;
    }

    if (role === 'Operator Partai' && !partaiId) {
      alert("Untuk role Operator Partai, silakan tentukan Partai Politik afiliasi.");
      return;
    }

    onSave({
      id: pengguna?.id || `u_${Date.now()}`,
      username: username.toLowerCase().trim(),
      namaLengkap: namaLengkap.trim(),
      email: email.trim(),
      role,
      status,
      partaiId: role === 'Operator Partai' ? partaiId : undefined,
      avatar: avatar || AVATAR_PRESETS[0]
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl border border-slate-150 max-w-md w-full overflow-hidden text-xs my-8">
        {/* Header */}
        <div className="p-4 border-b bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
              <User className="h-4 w-4" />
            </span>
            <span className="font-extrabold text-slate-800 text-sm">
              {pengguna ? 'Ubah Informasi Pengguna' : 'Tambah Pengguna Baru'}
            </span>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          {/* Avatar selector/upload */}
          <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-lg border border-slate-150">
            <div className="relative shrink-0">
              <img 
                src={avatar || AVATAR_PRESETS[0]} 
                alt="Avatar" 
                className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500 shadow-sm"
              />
              <label className="absolute bottom-0 right-0 bg-emerald-600 hover:bg-emerald-700 text-white p-1 rounded-full cursor-pointer shadow-xs border border-white transition flex items-center justify-center">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleAvatarFileChange} 
                  className="hidden" 
                />
                <span className="text-[8px] font-bold px-1 uppercase">Ganti</span>
              </label>
            </div>
            
            <div className="space-y-1.5">
              <span className="block font-bold text-slate-500 text-[10px] uppercase">Gunakan Foto atau Pilih Presets</span>
              <div className="flex gap-1.5 flex-wrap">
                {AVATAR_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatar(preset)}
                    className={`w-7 h-7 rounded-full overflow-hidden border transition transform hover:scale-105 active:scale-95 ${
                      avatar === preset ? 'border-emerald-600 ring-2 ring-emerald-500/30' : 'border-slate-200'
                    }`}
                  >
                    <img src={preset} alt={`preset ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Nama Lengkap */}
          <div>
            <label className="block text-slate-500 font-bold mb-1">Nama Lengkap</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <User className="h-3.5 w-3.5" />
              </span>
              <input
                type="text"
                required
                value={namaLengkap}
                onChange={(e) => setNamaLengkap(e.target.value)}
                placeholder="Contoh: Ahmad Heryawan, M.Si"
                className="w-full pl-9 p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800 focus:bg-white focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Username & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-500 font-bold mb-1">Username</label>
              <input
                type="text"
                required
                disabled={!!pengguna}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="operator_dpc"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800 focus:bg-white focus:ring-1 focus:ring-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed"
              />
              <span className="text-[9px] text-slate-400 font-medium mt-0.5 block">Hanya huruf kecil, angka, dan underscore.</span>
            </div>

            <div>
              <label className="block text-slate-500 font-bold mb-1">Alamat Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail className="h-3.5 w-3.5" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@partai.or.id"
                  className="w-full pl-9 p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800 focus:bg-white focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Role & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-500 font-bold mb-1">Peran Akses (Role)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Shield className="h-3.5 w-3.5" />
                </span>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as Pengguna['role'])}
                  className="w-full pl-9 p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800 focus:bg-white focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Admin Kesbangpol">Admin Kesbangpol</option>
                  <option value="Verifikator">Verifikator</option>
                  <option value="Operator Partai">Operator Partai</option>
                  <option value="Pimpinan">Pimpinan</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-500 font-bold mb-1">Status Keaktifan</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <UserCheck className="h-3.5 w-3.5" />
                </span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Pengguna['status'])}
                  className="w-full pl-9 p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800 focus:bg-white focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                  <option value="Menunggu Persetujuan">Menunggu Persetujuan</option>
                </select>
              </div>
            </div>
          </div>

          {/* Partai Politik (Hanya muncul jika Operator Partai) */}
          {role === 'Operator Partai' && (
            <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-lg space-y-1">
              <label className="block text-slate-600 font-extrabold mb-1 flex items-center gap-1.5 text-[10px] uppercase">
                <Landmark className="h-3.5 w-3.5 text-emerald-700" />
                Afiliasi Partai Politik
              </label>
              <select
                value={partaiId}
                onChange={(e) => setPartaiId(e.target.value)}
                required
                className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500"
              >
                <option value="">-- Pilih Partai Politik --</option>
                {partai.map(p => (
                  <option key={p.id} value={p.id}>{p.nama} ({p.singkatan})</option>
                ))}
              </select>
              <span className="text-[9px] text-emerald-700 block font-medium mt-0.5 leading-tight">
                Akun operator ini hanya akan memiliki otorisasi penuh untuk mengunggah berkas dan melacak data milik partai yang dipilih.
              </span>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="pt-4 border-t flex items-center justify-end gap-2 -mx-5 -mb-5 p-4 bg-slate-50">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:text-slate-800 rounded-lg font-extrabold transition cursor-pointer"
            >
              Batal
            </button>
            <button 
              type="submit" 
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-extrabold shadow-md transition transform active:scale-95 cursor-pointer flex items-center gap-1"
            >
              <Save className="h-3.5 w-3.5" />
              Simpan Akun
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
