/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Trash2, 
  Filter, 
  ShieldAlert, 
  Calendar,
  CheckCircle,
  Database
} from 'lucide-react';
import { AuditLog } from '../types';

interface AuditTrailViewProps {
  logs: AuditLog[];
  onClearLogs?: () => void;
  currentUserRole: string;
}

export default function AuditTrailView({
  logs,
  onClearLogs,
  currentUserRole
}: AuditTrailViewProps) {
  const [search, setSearch] = useState('');
  const [activityFilter, setActivityFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // Filtering
  const filteredLogs = logs
    .filter(log => {
      const matchesSearch = 
        log.username.toLowerCase().includes(search.toLowerCase()) ||
        log.aktivitas.toLowerCase().includes(search.toLowerCase()) ||
        log.objek.toLowerCase().includes(search.toLowerCase()) ||
        log.detail.toLowerCase().includes(search.toLowerCase());
        
      const matchesActivity = activityFilter === '' || log.aktivitas === activityFilter;
      const matchesRole = roleFilter === '' || log.role === roleFilter;
      
      return matchesSearch && matchesActivity && matchesRole;
    })
    // Chronologically descending
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Extracted unique list
  const activities = Array.from(new Set(logs.map(l => l.aktivitas)));
  const roles = Array.from(new Set(logs.map(l => l.role)));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden" id="audit_module">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-100 rounded-lg text-slate-700">
            <History className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">Catatan Aktivitas Sistem (Audit Trail)</h2>
            <p className="text-xs text-slate-500 mt-0.5">Log kronologis perubahan database, unggahan dokumen, penandatanganan NPHD, dan validasi verifikator.</p>
          </div>
        </div>

        {currentUserRole === 'Super Admin' && onClearLogs && (
          <button
            onClick={() => {
              if (confirm("Apakah Anda yakin ingin mengosongkan seluruh logs audit trail? Tindakan ini permanen.")) {
                onClearLogs();
              }
            }}
            className="text-xs text-rose-600 hover:text-white hover:bg-rose-600 bg-rose-50 border border-rose-200 px-3.5 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Bersihkan Logs
          </button>
        )}
      </div>

      {/* Filters Control */}
      <div className="p-4 border-b border-slate-100 bg-white grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Search Input */}
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari berdasarkan pengguna, aktivitas, objek, detail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition"
          />
        </div>

        {/* Filter Activity */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs">
          <Filter className="h-3.5 w-3.5 text-slate-400" />
          <select
            value={activityFilter}
            onChange={(e) => setActivityFilter(e.target.value)}
            className="bg-transparent w-full font-semibold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="">Semua Aktivitas</option>
            {activities.map((act, i) => (
              <option key={i} value={act}>{act}</option>
            ))}
          </select>
        </div>

        {/* Filter Role */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs">
          <ShieldAlert className="h-3.5 w-3.5 text-slate-400" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-transparent w-full font-semibold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="">Semua Hak Akses</option>
            {roles.map((r, i) => (
              <option key={i} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table listing */}
      <div className="overflow-x-auto max-h-[500px]">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200 select-none divide-x divide-slate-200/50">
              <th className="p-3 w-16 text-center">ID</th>
              <th className="p-3 w-36">Waktu Kejadian (WIB)</th>
              <th className="p-3 w-40">Pengguna</th>
              <th className="p-3 w-36">Aktivitas</th>
              <th className="p-3 w-48">Nama Objek</th>
              <th className="p-3">Rincian Detail Aktivitas</th>
              <th className="p-3 w-32">Alamat IP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400 italic">
                  Tidak ada catatan aktivitas yang cocok dengan kriteria pencarian Anda.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition">
                  <td className="p-3 text-center text-slate-400 font-mono font-bold">{log.id}</td>
                  <td className="p-3 text-slate-500 font-mono text-[11px]">
                    {new Date(log.timestamp).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[9px] text-slate-600 border border-slate-200">
                        {log.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 block text-[11px]">{log.username}</span>
                        <span className="text-[10px] text-slate-400 font-medium block leading-none">{log.role}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.aktivitas === 'Login' ? 'bg-indigo-150 text-indigo-800' :
                      log.aktivitas === 'Logout' ? 'bg-slate-150 text-slate-700' :
                      log.aktivitas === 'Tambah Data' ? 'bg-emerald-150 text-emerald-800' :
                      log.aktivitas === 'Edit' ? 'bg-amber-150 text-amber-800' :
                      log.aktivitas === 'Hapus' ? 'bg-rose-150 text-rose-800' :
                      log.aktivitas === 'Upload Dokumen' || log.aktivitas === 'Upload' ? 'bg-cyan-150 text-cyan-800' :
                      log.aktivitas === 'Verifikasi' || log.aktivitas === 'Approval' ? 'bg-blue-150 text-blue-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {log.aktivitas}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-slate-800">{log.objek}</td>
                  <td className="p-3 text-slate-600 font-sans text-[11px] leading-relaxed max-w-sm break-words">{log.detail}</td>
                  <td className="p-3 font-mono text-slate-400 text-[11px]">{log.ipAddress}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer statistics */}
      <div className="bg-slate-50 p-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
        <span>Menampilkan {filteredLogs.length} dari total {logs.length} catatan aktivitas</span>
        <span className="flex items-center gap-1">
          <Database className="h-3 w-3" />
          Arsip Audit Trail Terenkripsi
        </span>
      </div>
    </div>
  );
}
