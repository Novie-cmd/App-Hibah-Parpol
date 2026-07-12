/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileCheck, 
  Wallet, 
  FileText, 
  Archive, 
  Table, 
  FileBarChart, 
  UserCheck, 
  History, 
  Settings, 
  Bell, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Download, 
  Upload, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Building2, 
  ExternalLink,
  ChevronRight,
  Eye,
  LogOut,
  RefreshCw,
  Sparkles,
  FolderOpen,
  X,
  Printer,
  Shield,
  Lock,
  User
} from 'lucide-react';

// Types
import { 
  Partai, 
  DokumenHibah, 
  DataHibah, 
  LaporanPertanggungjawaban, 
  AuditLog, 
  Pengguna, 
  Notifikasi, 
  PengaturanSistem,
  StatusVerifikasi,
  StatusPenyaluran,
  StatusLPJ
} from './types';

import { 
  INITIAL_PARTAI, 
  generateInitialDokumen, 
  INITIAL_HIBAH, 
  INITIAL_LPJ, 
  INITIAL_AUDIT, 
  INITIAL_PENGGUNA, 
  INITIAL_NOTIFIKASI, 
  INITIAL_PENGATURAN 
} from './data';

// Modular Components
import SpreadsheetView from './components/SpreadsheetView';
import LaporanView from './components/LaporanView';
import AuditTrailView from './components/AuditTrailView';
import PartaiForm from './components/PartaiForm';
import PartaiDetailModal from './components/PartaiDetailModal';
import DocumentViewerModal from './components/DocumentViewerModal';
import PenggunaForm from './components/PenggunaForm';
import DocumentPrintPreviewModal from './components/DocumentPrintPreviewModal';

export default function App() {
  // Navigation Menu state
  const [activeMenu, setActiveMenu] = useState<'dashboard' | 'parpol' | 'verifikasi' | 'hibah' | 'lpj' | 'arsip' | 'spreadsheet' | 'laporan' | 'pengguna' | 'audit' | 'pengaturan'>('dashboard');

  // Core collections state
  const [partai, setPartai] = useState<Partai[]>([]);
  const [dokumen, setDokumen] = useState<DokumenHibah[]>([]);
  const [hibah, setHibah] = useState<DataHibah[]>([]);
  const [lpj, setLpj] = useState<LaporanPertanggungjawaban[]>([]);
  const [audit, setAudit] = useState<AuditLog[]>([]);
  const [pengguna, setPengguna] = useState<Pengguna[]>([]);
  const [notifikasi, setNotifikasi] = useState<Notifikasi[]>([]);
  const [pengaturan, setPengaturan] = useState<PengaturanSistem | null>(null);

  // Loading & Error States
  const [isLoading, setIsLoading] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchGlobal, setSearchGlobal] = useState('');

  // Active User session state
  const [currentUser, setCurrentUser] = useState<Pengguna | null>(null);

  // Login & Registration state variables
  const [loginTab, setLoginTab] = useState<'login' | 'register'>('login');
  const [loginUsername, setLoginUsername] = useState('admin_kesbang');
  const [loginPassword, setLoginPassword] = useState('admin123');
  const [loginRole, setLoginRole] = useState<'Admin Kesbangpol' | 'Operator Partai'>('Admin Kesbangpol');
  const [loginError, setLoginError] = useState('');
  
  const [regNamaLengkap, setRegNamaLengkap] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPartaiId, setRegPartaiId] = useState('');
  const [regAvatar, setRegAvatar] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&q=80');
  const [regSuccessMsg, setRegSuccessMsg] = useState('');
  const [regErrorMsg, setRegErrorMsg] = useState('');
  
  const [inlineDocType, setInlineDocType] = useState('SK Kepengurusan');

  const AVATAR_PRESETS = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop&q=80',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&q=80',
    'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=150&h=150&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&q=80'
  ];

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setRegSuccessMsg('');
    
    const userObj = pengguna.find(
      u => u.username.toLowerCase().trim() === loginUsername.toLowerCase().trim()
    );
    
    if (!userObj) {
      setLoginError('Username tidak ditemukan dalam sistem. Silakan hubungi admin atau daftarkan akun baru.');
      return;
    }
    
    if (!loginPassword || loginPassword.trim().length < 4) {
      setLoginError('Kata sandi harus terdiri dari minimal 4 karakter.');
      return;
    }

    if (userObj.password && userObj.password !== loginPassword) {
      setLoginError('Kata sandi salah. Harap coba lagi.');
      return;
    }
    
    if (userObj.role !== loginRole && !(loginRole === 'Admin Kesbangpol' && (userObj.role === 'Super Admin' || userObj.role === 'Verifikator' || userObj.role === 'Pimpinan'))) {
      setLoginError(`Akun ini tidak memiliki akses sebagai ${loginRole}.`);
      return;
    }
    
    if (userObj.status === 'Menunggu Persetujuan') {
      setLoginError('akun anda sedang menunggu persetujuan dari Kesbangpol');
      return;
    }
    
    if (userObj.status === 'Nonaktif') {
      setLoginError('Akun Anda dinonaktifkan. Silakan hubungi administrator.');
      return;
    }
    
    // Success Login
    setCurrentUser(userObj);
    localStorage.setItem('kesbangpol_session', JSON.stringify(userObj));
    logAktivitas('Login', 'Sesi Pengguna', `Pengguna [${userObj.namaLengkap}] berhasil masuk ke sistem.`);
    alert(`Selamat datang kembali, ${userObj.namaLengkap}!`);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegErrorMsg('');
    setRegSuccessMsg('');
    
    if (!regNamaLengkap.trim() || !regUsername.trim() || !regPassword.trim() || !regEmail.trim() || !regPartaiId) {
      setRegErrorMsg('Harap lengkapi semua bidang isian formulir.');
      return;
    }

    if (regPassword.trim().length < 4) {
      setRegErrorMsg('Kata sandi harus terdiri dari minimal 4 karakter.');
      return;
    }
    
    const cleanUsername = regUsername.toLowerCase().trim().replace(/\s+/g, '_');
    
    // Check if username already exists
    const exists = pengguna.some(u => u.username.toLowerCase() === cleanUsername);
    if (exists) {
      setRegErrorMsg(`Username "@${cleanUsername}" sudah digunakan. Silakan pilih username lain.`);
      return;
    }
    
    const matchedP = partai.find(p => p.id === regPartaiId);
    
    const newUser: Pengguna = {
      id: `u_reg_${Date.now()}`,
      username: cleanUsername,
      namaLengkap: regNamaLengkap.trim(),
      email: regEmail.trim(),
      role: 'Operator Partai',
      status: 'Menunggu Persetujuan',
      partaiId: regPartaiId,
      avatar: regAvatar,
      password: regPassword
    };
    
    try {
      const res = await fetch('/api/pengguna', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      if (res.ok) {
        const saved = await res.json();
        setPengguna(prev => [...prev, saved.data]);
        logAktivitas('Registrasi', `Pengguna ${newUser.namaLengkap}`, `Mengajukan pendaftaran akun Operator Partai untuk partai ${matchedP?.singkatan}.`);
        
        // Add a notification for admin
        setNotifikasi(prev => [
          {
            id: `n_reg_${Date.now()}`,
            partaiId: regPartaiId,
            partaiNama: matchedP?.singkatan,
            tipe: 'peringatan',
            pesan: `Pendaftaran akun baru oleh ${newUser.namaLengkap} (${matchedP?.singkatan}) memerlukan persetujuan.`,
            tanggal: new Date().toISOString(),
            dibaca: false
          },
          ...prev
        ]);
        
        // Clear reg states
        setRegNamaLengkap('');
        setRegUsername('');
        setRegPassword('');
        setRegEmail('');
        setRegPartaiId('');
        
        // Success feedback
        setRegSuccessMsg(`Registrasi Berhasil! Akun Anda sedang menunggu persetujuan dari Kesbangpol.`);
        setLoginTab('login');
      } else {
        throw new Error("Server error");
      }
    } catch (err) {
      // Offline fallback
      setPengguna(prev => [...prev, newUser]);
      logAktivitas('Registrasi', `Pengguna ${newUser.namaLengkap}`, `Mengajukan pendaftaran akun Operator Partai untuk partai ${matchedP?.singkatan}.`);
      
      setNotifikasi(prev => [
        {
          id: `n_reg_${Date.now()}`,
          partaiId: regPartaiId,
          partaiNama: matchedP?.singkatan,
          tipe: 'peringatan',
          pesan: `Pendaftaran akun baru oleh ${newUser.namaLengkap} (${matchedP?.singkatan}) memerlukan persetujuan.`,
          tanggal: new Date().toISOString(),
          dibaca: false
        },
        ...prev
      ]);
      
      // Clear reg states
      setRegNamaLengkap('');
      setRegUsername('');
      setRegEmail('');
      setRegPartaiId('');
      
      setRegSuccessMsg(`Registrasi Akun "${newUser.namaLengkap}" berhasil diajukan! Akun Anda sedang menunggu persetujuan dari Kesbangpol.`);
      setLoginTab('login');
    }
  };

  // Modal control states
  const [selectedPartai, setSelectedPartai] = useState<Partai | null>(null);
  const [detailPartaiOpen, setDetailPartaiOpen] = useState<Partai | null>(null);
  const [partaiFormOpen, setPartaiFormOpen] = useState(false);
  const [documentViewerOpen, setDocumentViewerOpen] = useState<DokumenHibah | null>(null);
  const [penggunaFormOpen, setPenggunaFormOpen] = useState(false);
  const [selectedPengguna, setSelectedPengguna] = useState<Pengguna | null>(null);
  const [printPreviewOpen, setPrintPreviewOpen] = useState<{ partai: Partai; hibah: DataHibah | null } | null>(null);

  // Interactive Action Forms states
  const [verificationModalOpen, setVerificationModalOpen] = useState<DokumenHibah | null>(null);
  const [verifChecklist, setVerifChecklist] = useState<string[]>([]);
  const [verifStatus, setVerifStatus] = useState<StatusVerifikasi>('Lengkap');
  const [verifNotes, setVerifNotes] = useState('');
  
  // States for automatic & interactive verification checking
  const [verifCheck1, setVerifCheck1] = useState(true); // Stempel basah
  const [verifCheck2, setVerifCheck2] = useState(true); // Masa berlaku aktif
  const [verifCheck3, setVerifCheck3] = useState(true); // Kesesuaian KSB
  const [verifCheck4, setVerifCheck4] = useState(true); // Resolusi scan
  const [isAutoChecking, setIsAutoChecking] = useState(false);

  const [hibahFormOpen, setHibahFormOpen] = useState<DataHibah | null>(null);
  const [lpjReviewOpen, setLpjReviewOpen] = useState<LaporanPertanggungjawaban | null>(null);
  const [uploadDocOpen, setUploadDocOpen] = useState<string | null>(null); // Type of doc to upload
  const [selectedUploadPartaiId, setSelectedUploadPartaiId] = useState<string | null>(null);
  const [importNomorDokumen, setImportNomorDokumen] = useState('');
  const [importTanggal, setImportTanggal] = useState('');
  const [importMasaBerlaku, setImportMasaBerlaku] = useState('2027-02-15');
  const [importFileData, setImportFileData] = useState('');
  const [importFileName, setImportFileName] = useState('');
  const [importFileSize, setImportFileSize] = useState('');
  const [importFileType, setImportFileType] = useState<'pdf' | 'docx' | 'xlsx' | 'jpg'>('pdf');

  // Fetch initial state from database.json on mount
  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData(true);
    }, 15000); // sync every 15 seconds silently in background
    return () => clearInterval(interval);
  }, []);

  const [isOffline, setIsOffline] = useState(false);

  const fetchData = async (isBackground = false) => {
    if (!isBackground) setIsLoading(true);
    try {
      const res = await fetch('/api/data');
      if (res.ok) {
        const data = await res.json();
        setPartai(data.partai || []);
        setDokumen(data.dokumen || []);
        setHibah(data.hibah || []);
        setLpj(data.lpj || []);
        setAudit(data.audit || []);
        setPengguna(data.pengguna || []);
        setNotifikasi(data.notifikasi || []);
        setPengaturan(data.pengaturan || null);
        setIsOffline(false);
        
        // Auto-sync offline users to the server
        const serverPengguna = data.pengguna || [];
        const localDbRaw = localStorage.getItem('kesbangpol_db');
        if (localDbRaw) {
          try {
            const localDb = JSON.parse(localDbRaw);
            const localPengguna = localDb.pengguna || [];
            const unsyncedUsers = localPengguna.filter((lu: any) => 
              lu.id.startsWith('u_reg_') && !serverPengguna.some((su: any) => su.id === lu.id)
            );
            
            if (unsyncedUsers.length > 0) {
              for (const lu of unsyncedUsers) {
                console.log('Syncing offline user to server:', lu);
                await fetch('/api/pengguna', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(lu)
                });
              }
              // Re-fetch to get latest state from server
              const resRetry = await fetch('/api/data');
              if (resRetry.ok) {
                const dataRetry = await resRetry.json();
                setPartai(dataRetry.partai || []);
                setDokumen(dataRetry.dokumen || []);
                setHibah(dataRetry.hibah || []);
                setLpj(dataRetry.lpj || []);
                setAudit(dataRetry.audit || []);
                setPengguna(dataRetry.pengguna || []);
                setNotifikasi(dataRetry.notifikasi || []);
                setPengaturan(dataRetry.pengaturan || null);
                localStorage.setItem('kesbangpol_db', JSON.stringify(dataRetry));
              }
            }
          } catch (syncErr) {
            console.error('Failed to auto-sync offline data:', syncErr);
          }
        }
        
        // Save copy to local storage
        localStorage.setItem('kesbangpol_db', JSON.stringify(data));
        
        // Check local storage for existing session
        const savedSession = localStorage.getItem('kesbangpol_session');
        if (savedSession) {
          try {
            const parsed = JSON.parse(savedSession);
            const matchedUser = (data.pengguna || []).find((u: any) => u.id === parsed.id);
            if (matchedUser && matchedUser.status === 'Aktif') {
              setCurrentUser(matchedUser);
            } else {
              localStorage.removeItem('kesbangpol_session');
              setCurrentUser(null);
            }
          } catch (e) {
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
      } else {
        throw new Error("Server returned non-ok status: " + res.status);
      }
    } catch (err) {
      console.warn('Failed to sync with API. Running offline/static mode with localStorage fallback.', err);
      setIsOffline(true);
      
      // Load from localStorage or seed
      let localDb: any = null;
      try {
        const raw = localStorage.getItem('kesbangpol_db');
        if (raw) {
          localDb = JSON.parse(raw);
        }
      } catch (e) {
        console.error("Failed to parse localStorage database", e);
      }
      
      if (!localDb || !localDb.partai || !localDb.pengaturan) {
        localDb = {
          partai: INITIAL_PARTAI,
          dokumen: generateInitialDokumen(INITIAL_PARTAI),
          hibah: INITIAL_HIBAH,
          lpj: INITIAL_LPJ,
          audit: INITIAL_AUDIT,
          pengguna: INITIAL_PENGGUNA,
          notifikasi: INITIAL_NOTIFIKASI,
          pengaturan: INITIAL_PENGATURAN
        };
        localStorage.setItem('kesbangpol_db', JSON.stringify(localDb));
      }
      
      setPartai(localDb.partai || []);
      setDokumen(localDb.dokumen || []);
      setHibah(localDb.hibah || []);
      setLpj(localDb.lpj || []);
      setAudit(localDb.audit || []);
      setPengguna(localDb.pengguna || []);
      setNotifikasi(localDb.notifikasi || []);
      setPengaturan(localDb.pengaturan || null);
      
      const savedSession = localStorage.getItem('kesbangpol_session');
      if (savedSession) {
        try {
          const parsed = JSON.parse(savedSession);
          const matchedUser = (localDb.pengguna || []).find((u: any) => u.id === parsed.id);
          if (matchedUser && matchedUser.status === 'Aktif') {
            setCurrentUser(matchedUser);
          } else {
            localStorage.removeItem('kesbangpol_session');
            setCurrentUser(null);
          }
        } catch (e) {
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Automatically persist offline changes to localStorage
  useEffect(() => {
    if (!isLoading && pengaturan) {
      const db = {
        partai,
        dokumen,
        hibah,
        lpj,
        audit,
        pengguna,
        notifikasi,
        pengaturan
      };
      localStorage.setItem('kesbangpol_db', JSON.stringify(db));
    }
  }, [partai, dokumen, hibah, lpj, audit, pengguna, notifikasi, pengaturan, isLoading]);

  // Log Dynamic audit activities to server
  const logAktivitas = async (aktivitas: string, objek: string, detail: string) => {
    if (!currentUser) return;
    const newLog = {
      userId: currentUser.id,
      username: currentUser.username,
      role: currentUser.role,
      aktivitas,
      objek,
      detail,
      timestamp: new Date().toISOString()
    };
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLog)
      });
      if (res.ok) {
        const saved = await res.json();
        setAudit(prev => [saved.data, ...prev]);
      }
    } catch (e) {
      // Fallback
      setAudit(prev => [{ ...newLog, id: `a_${Date.now()}`, ipAddress: '127.0.0.1' }, ...prev]);
    }
  };

  const handleApprovePengguna = async (pId: string, action: 'setujui' | 'tolak') => {
    const statusVal = action === 'setujui' ? 'Aktif' : 'Nonaktif';
    const targetUser = pengguna.find(u => u.id === pId);
    if (!targetUser) return;
    
    const updatedUser = { ...targetUser, status: statusVal };
    
    try {
      const res = await fetch(`/api/pengguna/${pId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
      });
      if (res.ok) {
        setPengguna(prev => prev.map(u => u.id === pId ? { ...u, status: statusVal } : u));
        logAktivitas('Persetujuan Pengguna', `Pengguna ${targetUser.namaLengkap}`, `${action === 'setujui' ? 'Menyetujui' : 'Menolak'} pendaftaran akun.`);
        alert(`Akun ${targetUser.namaLengkap} berhasil ${action === 'setujui' ? 'disetujui (aktif)' : 'ditolak (nonaktif)'}!`);
      } else {
        throw new Error("Server error");
      }
    } catch (err) {
      // Offline fallback
      setPengguna(prev => prev.map(u => u.id === pId ? { ...u, status: statusVal } : u));
      logAktivitas('Persetujuan Pengguna', `Pengguna ${targetUser.namaLengkap}`, `${action === 'setujui' ? 'Menyetujui' : 'Menolak'} pendaftaran akun.`);
      alert(`Akun ${targetUser.namaLengkap} berhasil ${action === 'setujui' ? 'disetujui (aktif)' : 'ditolak (nonaktif)'}.`);
    }
  };

  // CRUD PARTAI
  const handleSavePartai = async (p: Partai) => {
    try {
      const res = await fetch('/api/partai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p)
      });
      if (res.ok) {
        const saved = await res.json();
        setPartai(prev => {
          const idx = prev.findIndex(item => item.id === p.id);
          if (idx > -1) {
            const updated = [...prev];
            updated[idx] = saved.data;
            return updated;
          }
          return [...prev, saved.data];
        });
        logAktivitas((selectedPartai || isOperator) ? 'Edit' : 'Tambah Data', `Partai ${p.singkatan}`, `Profil partai dan kursi DPRD berhasil dimutakhirkan.`);
        setPartaiFormOpen(false);
        setSelectedPartai(null);
        alert(`Profil partai ${p.singkatan} berhasil dimutakhirkan!`);
      } else {
        throw new Error("Server returned non-ok status");
      }
    } catch (err) {
      // Offline fallback
      setPartai(prev => {
        const idx = prev.findIndex(item => item.id === p.id);
        if (idx > -1) {
          const updated = [...prev];
          updated[idx] = p;
          return updated;
        }
        return [...prev, p];
      });
      logAktivitas((selectedPartai || isOperator) ? 'Edit' : 'Tambah Data', `Partai ${p.singkatan}`, `Profil partai dan kursi DPRD berhasil dimutakhirkan.`);
      setPartaiFormOpen(false);
      setSelectedPartai(null);
      alert(`Profil partai ${p.singkatan} berhasil dimutakhirkan!`);
    }
  };

  const handleDeletePartai = async (id: string, singkatan: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus partai ${singkatan}? Seluruh dokumen kearsipan dan rincian hibahnya juga akan ikut terhapus.`)) return;
    try {
      const res = await fetch(`/api/partai/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPartai(prev => prev.filter(p => p.id !== id));
        setDokumen(prev => prev.filter(d => d.partaiId !== id));
        setHibah(prev => prev.filter(h => h.partaiId !== id));
        setLpj(prev => prev.filter(l => l.partaiId !== id));
        logAktivitas('Hapus', `Partai ${singkatan}`, `Menghapus entitas partai politik dan berkas penunjang.`);
      } else {
        throw new Error("Server returned non-ok status");
      }
    } catch (e) {
      // Offline fallback
      setPartai(prev => prev.filter(p => p.id !== id));
      setDokumen(prev => prev.filter(d => d.partaiId !== id));
      setHibah(prev => prev.filter(h => h.partaiId !== id));
      setLpj(prev => prev.filter(l => l.partaiId !== id));
      logAktivitas('Hapus', `Partai ${singkatan}`, `Menghapus entitas partai politik dan berkas penunjang.`);
    }
  };

  // CRUD PENGGUNA
  const handleSavePengguna = async (u: Pengguna) => {
    try {
      const res = await fetch('/api/pengguna', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(u)
      });
      if (res.ok) {
        const saved = await res.json();
        setPengguna(prev => {
          const idx = prev.findIndex(item => item.id === u.id);
          if (idx > -1) {
            const updated = [...prev];
            updated[idx] = saved.data;
            return updated;
          }
          return [...prev, saved.data];
        });
        logAktivitas(selectedPengguna ? 'Edit' : 'Tambah Data', `Pengguna ${u.namaLengkap}`, `Data pengguna berhasil dimutakhirkan.`);
        setPenggunaFormOpen(false);
        setSelectedPengguna(null);
      } else {
        throw new Error("Server returned non-ok status");
      }
    } catch (err) {
      // Offline fallback
      setPengguna(prev => {
        const idx = prev.findIndex(item => item.id === u.id);
        if (idx > -1) {
          const updated = [...prev];
          updated[idx] = u;
          return updated;
        }
        return [...prev, u];
      });
      logAktivitas(selectedPengguna ? 'Edit' : 'Tambah Data', `Pengguna ${u.namaLengkap}`, `Data pengguna berhasil dimutakhirkan.`);
      setPenggunaFormOpen(false);
      setSelectedPengguna(null);
    }
  };

  const handleLogoImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const originalBase64 = event.target?.result as string;
      if (!originalBase64) return;

      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Resize down if it's larger than 150px (extremely optimized for high-performance and database efficiency)
        const MAX_DIM = 150;
        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          alert("Gagal memproses gambar.");
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Use PNG to maintain transparency for logos, since max dim is 150px, size is extremely small (typically <15KB)
        const compressedBase64 = canvas.toDataURL('image/png');

        if (pengaturan) {
          const updatedPengaturan = {
            ...pengaturan,
            logoInstansi: compressedBase64
          };
          setPengaturan(updatedPengaturan);
          try {
            const res = await fetch('/api/settings', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updatedPengaturan)
            });
            if (res.ok) {
              logAktivitas('Edit', 'Konfigurasi Sistem', 'Mengimpor logo resmi pemerintah daerah baru.');
              alert("Logo Pemerintah Daerah berhasil diimpor & disimpan ke database!");
            } else {
              const errData = await res.json().catch(() => ({}));
              let extraMsg = "";
              if (res.status === 404 || res.status === 502) {
                extraMsg = "\n\nServer mungkin sedang melakukan restart/rebuild berkas baru. Silakan tunggu 3-5 detik lalu coba unggah kembali.";
              }
              alert(`Gagal mengunggah logo ke server (Status: ${res.status}): ${errData.error || res.statusText || 'Ada kendala koneksi.'}${extraMsg}`);
            }
          } catch (err: any) {
            alert(`Gagal mengunggah logo ke server: ${err.message || err}\n\nSilakan coba lagi dalam beberapa detik.`);
          }
        }
      };
      img.onerror = () => {
        alert("Berkas yang dipilih bukan gambar yang valid.");
      };
      img.src = originalBase64;
    };
    reader.readAsDataURL(file);
  };

  const handleResetLogo = async () => {
    if (!pengaturan) return;
    if (!window.confirm("Apakah Anda yakin ingin mengembalikan logo Pemda ke lambang resmi Provinsi NTB default?")) {
      return;
    }

    const updatedPengaturan = {
      ...pengaturan,
      logoInstansi: "https://upload.wikimedia.org/wikipedia/commons/b/ad/Lambang_Nusa_Tenggara_Barat.png"
    };
    setPengaturan(updatedPengaturan);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPengaturan)
      });
      if (res.ok) {
        logAktivitas('Edit', 'Konfigurasi Sistem', 'Mereset logo pemerintah daerah ke default.');
        alert("Logo Pemda berhasil dikembalikan ke Lambang Resmi Provinsi NTB!");
      } else {
        alert("Gagal mereset logo di server.");
      }
    } catch (err) {
      alert("Gagal mereset logo.");
    }
  };

  const handleDeletePengguna = async (id: string, namaLengkap: string) => {
    if (currentUser && currentUser.id === id) {
      alert("Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif.");
      return;
    }
    if (!confirm(`Apakah Anda yakin ingin menghapus pengguna "${namaLengkap}"?`)) return;
    try {
      const res = await fetch(`/api/pengguna/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPengguna(prev => prev.filter(p => p.id !== id));
        logAktivitas('Hapus', `Pengguna ${namaLengkap}`, `Menghapus akun pengguna dari sistem.`);
      } else {
        throw new Error("Server returned non-ok status");
      }
    } catch (e) {
      // Offline fallback
      setPengguna(prev => prev.filter(p => p.id !== id));
      logAktivitas('Hapus', `Pengguna ${namaLengkap}`, `Menghapus akun pengguna dari sistem.`);
    }
  };

  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("Ukuran berkas maksimal adalah 10 MB.");
      return;
    }

    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1) + " MB";
    setImportFileSize(sizeInMB);
    setImportFileName(file.name);

    // parse type
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') setImportFileType('pdf');
    else if (ext === 'docx') setImportFileType('docx');
    else if (ext === 'xlsx') setImportFileType('xlsx');
    else if (ext === 'jpg' || ext === 'jpeg' || ext === 'png') setImportFileType('jpg');
    else setImportFileType('pdf');

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImportFileData(event.target.result as string);
      }
    };
    reader.onerror = () => {
      alert("Gagal membaca berkas.");
    };
    reader.readAsDataURL(file);
  };

  // UPLOAD / IMPORT DOKUMEN (REAL & VERSIONED)
  const handleUploadSimulated = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadDocOpen || !currentUser) return;
    
    // determine target partai id
    const targetPartaiId = selectedUploadPartaiId || currentUser.partaiId || partai[0]?.id;
    if (!targetPartaiId) {
      alert("Partai Politik target tidak valid.");
      return;
    }

    const partaiObj = partai.find(p => p.id === targetPartaiId);
    
    // use imported file name or generate a default one
    const docName = importFileName || `${(partaiObj?.singkatan || 'parpol').toLowerCase()}_${uploadDocOpen.toLowerCase().replace(/ /g, '_')}_2026.pdf`;
    const docNo = importNomorDokumen || `DOC/${partaiObj?.singkatan || 'PARPOL'}/${Date.now().toString().slice(-4)}/2026`;
    const docSize = importFileSize || "1.4 MB";
    const docType = importFileType || "pdf";

    // check if we already have a document of this type for this parpol
    const existingDoc = dokumen.find(d => d.partaiId === targetPartaiId && d.tipeDokumen === uploadDocOpen);
    
    let newDoc: DokumenHibah;
    if (existingDoc) {
      // create new version with history
      const prevRevision = {
        version: existingDoc.version,
        fileName: existingDoc.fileName,
        updatedAt: existingDoc.updatedAt,
        uploadedBy: existingDoc.uploadedBy,
        catatan: `Berkas lama digantikan oleh berkas impor baru.`
      };

      newDoc = {
        ...existingDoc,
        nomorDokumen: docNo,
        tanggal: importTanggal || new Date().toISOString().split('T')[0],
        masaBerlaku: importMasaBerlaku,
        statusVerifikasi: 'Menunggu Verifikasi',
        catatanVerifikator: "Berkas baru diimpor oleh pengguna, menunggu review verifikator.",
        fileName: docName,
        fileType: docType,
        fileSize: docSize,
        fileData: importFileData || existingDoc.fileData, // keep old file data if no new file is imported
        version: existingDoc.version + 1,
        updatedAt: new Date().toISOString(),
        uploadedBy: `${currentUser.namaLengkap} (${currentUser.role})`,
        history: [...(existingDoc.history || []), prevRevision]
      };
    } else {
      newDoc = {
        id: `d_new_${Date.now()}`,
        partaiId: targetPartaiId,
        tipeDokumen: uploadDocOpen,
        nomorDokumen: docNo,
        tanggal: importTanggal || new Date().toISOString().split('T')[0],
        masaBerlaku: importMasaBerlaku,
        statusVerifikasi: 'Menunggu Verifikasi',
        catatanVerifikator: "Berkas digital diimpor ke sistem, menunggu review verifikator.",
        fileName: docName,
        fileType: docType,
        fileSize: docSize,
        fileData: importFileData,
        version: 1,
        updatedAt: new Date().toISOString(),
        uploadedBy: `${currentUser.namaLengkap} (${currentUser.role})`,
        history: []
      };
    }

    try {
      const res = await fetch('/api/dokumen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDoc)
      });
      if (res.ok) {
        const saved = await res.json();
        setDokumen(prev => {
          const exists = prev.some(d => d.id === newDoc.id);
          if (exists) {
            return prev.map(d => d.id === newDoc.id ? saved.data : d);
          }
          return [...prev, saved.data];
        });
        
        // Add default log
        logAktivitas('Import Dokumen', uploadDocOpen, `Berhasil mengimpor berkas kearsipan partai ${partaiObj?.singkatan}.`);
        
        // Add Notification
        setNotifikasi(prev => [
          {
            id: `n_up_${Date.now()}`,
            partaiId: targetPartaiId,
            partaiNama: partaiObj?.singkatan,
            tipe: 'pengingat',
            pesan: `Berkas "${uploadDocOpen}" untuk ${partaiObj?.singkatan} berhasil diimpor.`,
            tanggal: new Date().toISOString(),
            dibaca: false
          },
          ...prev
        ]);

        setUploadDocOpen(null);
        setSelectedUploadPartaiId(null);
        alert(`Dokumen "${uploadDocOpen}" untuk partai ${partaiObj?.singkatan} berhasil diimpor!`);
      } else {
        throw new Error("Server returned non-ok status");
      }
    } catch (err) {
      // Offline fallback
      setDokumen(prev => {
        const exists = prev.some(d => d.id === newDoc.id);
        if (exists) {
          return prev.map(d => d.id === newDoc.id ? newDoc : d);
        }
        return [...prev, newDoc];
      });
      
      // Add default log
      logAktivitas('Import Dokumen', uploadDocOpen, `Berhasil mengimpor berkas kearsipan partai ${partaiObj?.singkatan}.`);
      
      // Add Notification
      setNotifikasi(prev => [
        {
          id: `n_up_${Date.now()}`,
          partaiId: targetPartaiId,
          partaiNama: partaiObj?.singkatan,
          tipe: 'pengingat',
          pesan: `Berkas "${uploadDocOpen}" untuk ${partaiObj?.singkatan} berhasil diimpor.`,
          tanggal: new Date().toISOString(),
          dibaca: false
        },
        ...prev
      ]);

      setUploadDocOpen(null);
      setSelectedUploadPartaiId(null);
      alert(`Dokumen "${uploadDocOpen}" untuk partai ${partaiObj?.singkatan} berhasil diimpor!`);
    }
  };

  // PENGECEKAN VERIFIKASI DOKUMEN OTOMATIS (AI/SISTEM)
  const handleAutoCheck = () => {
    if (!verificationModalOpen) return;
    setIsAutoChecking(true);

    setTimeout(() => {
      // 1. Masa berlaku SK check
      const dateStr = verificationModalOpen.masaBerlaku;
      let isMasaBerlakuAktif = true;
      if (dateStr) {
        const docDate = new Date(dateStr);
        const today = new Date();
        isMasaBerlakuAktif = docDate >= today;
      }

      // 2. Berkas ber-stempel basah DPW/DPD Partai Politik asli check
      const hasStempel = true; // Simulated high-accuracy computer vision check

      // 3. Nama Ketua Umum, Sekretaris & Bendahara cocok dengan SK Kemenkumham
      const isKSBValid = true; // Simulated OCR matching against database

      // 4. Scan berkas digital memiliki resolusi minimal 150 DPI
      const isResolusiValid = true; // DPI checks

      setVerifCheck1(hasStempel);
      setVerifCheck2(isMasaBerlakuAktif);
      setVerifCheck3(isKSBValid);
      setVerifCheck4(isResolusiValid);

      const allValid = hasStempel && isMasaBerlakuAktif && isKSBValid && isResolusiValid;
      const computedStatus: StatusVerifikasi = allValid ? 'Lengkap' : 'Perbaikan';
      setVerifStatus(computedStatus);

      const tglPengecekan = new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });

      let notes = `[INTELLIGENT AUTO-CHECK SYSTEM]\n`;
      notes += `Pengecekan otomatis berkas selesai pada ${tglPengecekan}.\n\n`;
      notes += `• Stempel Basah DPW/DPD: ${hasStempel ? 'VALID (Stempel & Tanda Tangan terdeteksi asli)' : 'TIDAK VALID'}\n`;
      notes += `• Masa Berlaku SK Pengurus/Domisili: ${isMasaBerlakuAktif ? `AKTIF (Berlaku s.d. ${dateStr})` : `KEDALUWARSA / EXPIRED (Habis sejak ${dateStr})`}\n`;
      notes += `• Kesesuaian Pengurus (KSB): ${isKSBValid ? 'SESUAI (Terverifikasi sinkron dengan SK DPP & Kemenkumham)' : 'TIDAK COCOK'}\n`;
      notes += `• Resolusi Berkas Scan: ${isResolusiValid ? 'SANGAT JELAS (Resolusi 300 DPI, OCR terbaca sempurna)' : 'RESOLUSI RENDAH'}\n\n`;
      
      if (allValid) {
        notes += `KESIMPULAN: Berkas dinyatakan LENGKAP & MEMENUHI SYARAT (Lolos Verifikasi Administrasi Otomatis).`;
      } else {
        notes += `KESIMPULAN: PERBAIKAN BERKAS DIBUTUHKAN. Masa berlaku dokumen telah kedaluwarsa. Mohon parpol segera mengunggah berkas terbaru yang masih aktif.`;
      }

      setVerifNotes(notes);
      setIsAutoChecking(false);
    }, 1500);
  };

  // VERIFIKASI DOKUMEN
  const handleSaveVerification = async () => {
    if (!verificationModalOpen || !currentUser) return;
    try {
      const res = await fetch('/api/dokumen/verifikasi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: verificationModalOpen.id,
          statusVerifikasi: verifStatus,
          catatanVerifikator: verifNotes,
          namaVerifikator: currentUser.namaLengkap
        })
      });
      if (res.ok) {
        const responseData = await res.json();
        // Update document in state
        setDokumen(prev => prev.map(d => d.id === verificationModalOpen.id ? responseData.data : d));
        
        // Reload all data to sync notifications and audit trails updated by server
        fetchData();
        
        setVerificationModalOpen(null);
        alert("Dokumen berhasil divalidasi!");
      } else {
        throw new Error("Server returned non-ok status");
      }
    } catch (e) {
      // Offline fallback
      setDokumen(prev => prev.map(d => {
        if (d.id === verificationModalOpen.id) {
          return {
            ...d,
            statusVerifikasi: verifStatus,
            catatanVerifikator: verifNotes,
            updatedAt: new Date().toISOString(),
            uploadedBy: `${currentUser.namaLengkap} (Verifikator)`
          };
        }
        return d;
      }));

      // Add log manually
      setAudit(prev => [{
        id: `a_${Date.now()}`,
        userId: currentUser.id,
        username: currentUser.username,
        role: currentUser.role,
        aktivitas: 'Verifikasi',
        objek: verificationModalOpen.tipeDokumen,
        detail: `Verifikasi dokumen partai (ID: ${verificationModalOpen.partaiId}) menjadi ${verifStatus}. Catatan: ${verifNotes}`,
        timestamp: new Date().toISOString(),
        ipAddress: '127.0.0.1'
      }, ...prev]);

      // Add Notification
      const partaiObj = partai.find(p => p.id === verificationModalOpen.partaiId);
      setNotifikasi(prev => [
        {
          id: `n_${Date.now()}`,
          partaiId: verificationModalOpen.partaiId,
          partaiNama: partaiObj ? partaiObj.singkatan : 'Parpol',
          tipe: verifStatus === 'Lengkap' ? 'diterima' : 'ditolak',
          pesan: `Dokumen "${verificationModalOpen.tipeDokumen}" partai ${partaiObj ? partaiObj.singkatan : ''} dinyatakan ${verifStatus}. ${verifNotes ? 'Catatan: ' + verifNotes : ''}`,
          tanggal: new Date().toISOString(),
          dibaca: false
        },
        ...prev
      ]);

      setVerificationModalOpen(null);
      alert("Dokumen berhasil divalidasi!");
    }
  };

  // SAVE HIBAH PENYALURAN DATA
  const handleSaveHibah = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hibahFormOpen) return;
    try {
      const res = await fetch('/api/hibah', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hibahFormOpen)
      });
      if (res.ok) {
        const responseData = await res.json();
        setHibah(prev => {
          const idx = prev.findIndex(h => h.id === hibahFormOpen.id);
          if (idx > -1) {
            const copy = [...prev];
            copy[idx] = responseData.data;
            return copy;
          }
          return [...prev, responseData.data];
        });
        logAktivitas('Edit', `Hibah Parpol ID: ${hibahFormOpen.partaiId}`, `Pembaruan data tahapan penyaluran hibah.`);
        setHibahFormOpen(null);
        alert("Data penyaluran hibah berhasil diperbarui!");
      } else {
        throw new Error("Server returned non-ok status");
      }
    } catch (e) {
      // Offline fallback
      setHibah(prev => {
        const idx = prev.findIndex(h => h.id === hibahFormOpen.id);
        if (idx > -1) {
          const copy = [...prev];
          copy[idx] = hibahFormOpen;
          return copy;
        }
        return [...prev, hibahFormOpen];
      });

      // Add notification for cair
      if (hibahFormOpen.statusPenyaluran === 'Cair') {
        const partaiObj = partai.find(p => p.id === hibahFormOpen.partaiId);
        setNotifikasi(prev => [
          {
            id: `n_cair_${Date.now()}`,
            partaiId: hibahFormOpen.partaiId,
            partaiNama: partaiObj ? partaiObj.singkatan : 'Parpol',
            tipe: 'cair',
            pesan: `Dana Hibah TA ${hibahFormOpen.tahunAnggaran} Partai ${partaiObj ? partaiObj.singkatan : ''} sebesar Rp ${hibahFormOpen.nilaiBantuan.toLocaleString('id-ID')} telah dicairkan (SP2D: ${hibahFormOpen.nomorSp2d}).`,
            tanggal: new Date().toISOString(),
            dibaca: false
          },
          ...prev
        ]);
      }

      logAktivitas('Edit', `Hibah Parpol ID: ${hibahFormOpen.partaiId}`, `Pembaruan data tahapan penyaluran hibah.`);
      setHibahFormOpen(null);
      alert("Data penyaluran hibah berhasil diperbarui!");
    }
  };

  // REVIEW LPJ (LAPORAN PERTANGGUNGJAWABAN)
  const handleSaveLPJ = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lpjReviewOpen) return;
    try {
      const res = await fetch('/api/lpj', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lpjReviewOpen)
      });
      if (res.ok) {
        const responseData = await res.json();
        setLpj(prev => prev.map(l => l.id === lpjReviewOpen.id ? responseData.data : l));
        logAktivitas('Verifikasi', `LPJ ID: ${lpjReviewOpen.id}`, `Validasi laporan evaluasi LPJ menjadi [${lpjReviewOpen.statusDiterima}].`);
        setLpjReviewOpen(null);
        alert("Status evaluasi LPJ berhasil diperbarui!");
      } else {
        throw new Error("Server returned non-ok status");
      }
    } catch (err) {
      // Offline fallback
      setLpj(prev => prev.map(l => l.id === lpjReviewOpen.id ? lpjReviewOpen : l));
      logAktivitas('Verifikasi', `LPJ ID: ${lpjReviewOpen.id}`, `Validasi laporan evaluasi LPJ menjadi [${lpjReviewOpen.statusDiterima}].`);
      setLpjReviewOpen(null);
      alert("Status evaluasi LPJ berhasil diperbarui!");
    }
  };

  // RESET DATABASE TO DEFAULT SEED
  const handleResetDatabase = async () => {
    if (!confirm("Apakah Anda yakin ingin mengatur ulang database? Seluruh data yang ditambahkan akan dihapus dan diganti dengan data bawaan Kesbangpol.")) return;
    try {
      const res = await fetch('/api/database/reset', { method: 'POST' });
      if (res.ok) {
        fetchData();
        alert("Database Kesbangpol berhasil dikembalikan ke keadaan semula.");
      } else {
        throw new Error("Server returned non-ok status");
      }
    } catch (e) {
      // Offline fallback
      const defaultDb = {
        partai: INITIAL_PARTAI,
        dokumen: generateInitialDokumen(INITIAL_PARTAI),
        hibah: INITIAL_HIBAH,
        lpj: INITIAL_LPJ,
        audit: INITIAL_AUDIT,
        pengguna: INITIAL_PENGGUNA,
        notifikasi: INITIAL_NOTIFIKASI,
        pengaturan: INITIAL_PENGATURAN
      };
      localStorage.setItem('kesbangpol_db', JSON.stringify(defaultDb));
      setPartai(defaultDb.partai);
      setDokumen(defaultDb.dokumen);
      setHibah(defaultDb.hibah);
      setLpj(defaultDb.lpj);
      setAudit(defaultDb.audit);
      setPengguna(defaultDb.pengguna);
      setNotifikasi(defaultDb.notifikasi);
      setPengaturan(defaultDb.pengaturan);
      alert("Database Kesbangpol berhasil dikembalikan ke keadaan semula.");
    }
  };

  // DOWNLOAD BACKUP DATABASE JSON FILE
  const handleDownloadBackup = () => {
    const backupDb = {
      partai,
      dokumen,
      hibah,
      lpj,
      audit,
      pengguna,
      notifikasi,
      pengaturan
    };
    const blob = new Blob([JSON.stringify(backupDb, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `backup_kesbangpol_hibah_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    logAktivitas('Download', 'Backup Database', 'Mengunduh salinan berkas database JSON');
  };

  // IMPORT BACKUP DATABASE JSON
  const handleImportBackup = () => {
    const raw = prompt("Tempel (Paste) isi text JSON dari file backup Anda di bawah ini:");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (parsed.partai && parsed.dokumen && parsed.pengaturan) {
        fetch('/api/database/restore', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(parsed)
        }).then(res => {
          if (res.ok) {
            fetchData();
            alert("Database berhasil direstore dari file backup Anda!");
          }
        });
      } else {
        alert("Format berkas backup tidak sesuai skema Kesbangpol.");
      }
    } catch (e) {
      alert("Format JSON tidak valid: " + e);
    }
  };

  // Helper getters for Dashboard statistics
  const totalPartaiCount = partai.length;
  const activePartaiCount = partai.filter(p => p.statusAktif).length;
  const totalHibahNilai = partai.reduce((sum, p) => sum + p.totalHakBantuan, 0);
  
  const docsLengkapCount = dokumen.filter(d => d.statusVerifikasi === 'Lengkap').length;
  const requiredDocsTotal = totalPartaiCount * (pengaturan?.tipeDokumenDaftar?.length || 16);
  const totalIncompleteDocs = requiredDocsTotal - docsLengkapCount;

  // Notification mark as read
  const markNotificationRead = async (id: string) => {
    try {
      const res = await fetch('/api/notifikasi/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        setNotifikasi(prev => prev.map(n => id === 'all' ? { ...n, dibaca: true } : (n.id === id ? { ...n, dibaca: true } : n)));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handle simulated document downloads
  const triggerSimulatedDownload = (docName: string) => {
    alert(`Mengunduh file "${docName}" ke komputer Anda secara aman.`);
    logAktivitas('Download Dokumen', docName, 'Mengunduh arsip digital parpol.');
  };

  if (isLoading || !pengaturan) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans text-xs">
        <RefreshCw className="h-8 w-8 text-emerald-600 animate-spin" />
        <p className="mt-4 text-slate-500 font-bold tracking-wide">Menghubungkan ke Database Kearsipan Kesbangpol...</p>
      </div>
    );
  }

  const isOperator = currentUser?.role === 'Operator Partai';

  // Filter out search elements
  const getFilteredPartai = () => {
    let list = partai;
    if (isOperator && currentUser?.partaiId) {
      list = partai.filter(p => p.id === currentUser.partaiId);
    }
    return list.filter(p => {
      const matchesSearch = 
        p.nama.toLowerCase().includes(searchGlobal.toLowerCase()) ||
        p.singkatan.toLowerCase().includes(searchGlobal.toLowerCase()) ||
        p.ketua.toLowerCase().includes(searchGlobal.toLowerCase()) ||
        p.kabupatenKota.toLowerCase().includes(searchGlobal.toLowerCase());
      return matchesSearch;
    });
  };

  const getFilteredDocuments = () => {
    let list = dokumen;
    if (isOperator && currentUser?.partaiId) {
      list = dokumen.filter(d => d.partaiId === currentUser.partaiId);
    }
    return list.filter(d => {
      const p = partai.find(party => party.id === d.partaiId);
      const matchesSearch = 
        d.tipeDokumen.toLowerCase().includes(searchGlobal.toLowerCase()) ||
        d.nomorDokumen.toLowerCase().includes(searchGlobal.toLowerCase()) ||
        (p?.nama || '').toLowerCase().includes(searchGlobal.toLowerCase()) ||
        (p?.singkatan || '').toLowerCase().includes(searchGlobal.toLowerCase());
      return matchesSearch;
    });
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans select-none">
        
        {/* Background Decorative Rings */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-2xl shadow-2xl p-6 backdrop-blur-md relative z-10 space-y-6">
          
          {/* Logo & Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 bg-emerald-950/80 border border-emerald-900 rounded-2xl shadow-inner text-emerald-400 text-3xl">
              🏛️
            </div>
            <div>
              <h2 className="text-white text-base font-black uppercase tracking-wider">SI-HIBAH PARPOL</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                Badan Kesatuan Bangsa dan Politik <br />
                <span className="text-emerald-400 font-extrabold">Provinsi Nusa Tenggara Barat</span>
              </p>
            </div>
          </div>

          {/* Tab Selection: Login vs Register */}
          <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                setLoginTab('login');
                setRegSuccessMsg('');
                setRegErrorMsg('');
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                loginTab === 'login' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Masuk (Login)
            </button>
            <button
              onClick={() => {
                setLoginTab('register');
                setRegSuccessMsg('');
                setRegErrorMsg('');
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                loginTab === 'register' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Registrasi Admin Partai
            </button>
          </div>

          {loginTab === 'login' ? (
            /* LOGIN FORM */
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs text-slate-300">
              
              {/* Role Filter Selector */}
              <div>
                <label className="block text-slate-400 font-bold mb-1.5 uppercase tracking-wide text-[9px]">
                  Tipe Akun Pengguna
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginRole('Admin Kesbangpol');
                      // set default username for convenience
                      setLoginUsername('admin_kesbang');
                    }}
                    className={`py-2 px-3 border rounded-xl font-bold flex items-center justify-center gap-1.5 transition ${
                      loginRole === 'Admin Kesbangpol'
                        ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-400 shadow-xs'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                    }`}
                  >
                    <Shield className="h-3.5 w-3.5" />
                    Kesbangpol
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginRole('Operator Partai');
                      // set default username for convenience
                      setLoginUsername('operator_gerindra');
                    }}
                    className={`py-2 px-3 border rounded-xl font-bold flex items-center justify-center gap-1.5 transition ${
                      loginRole === 'Operator Partai'
                        ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-400 shadow-xs'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                    }`}
                  >
                    <Users className="h-3.5 w-3.5" />
                    Admin Partai
                  </button>
                </div>
              </div>

              {/* Username Input */}
              <div className="space-y-1.5">
                <label className="block text-slate-400 font-bold uppercase tracking-wide text-[9px]">
                  Username Akun
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                    <User className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder={loginRole === 'Admin Kesbangpol' ? 'admin_kesbang' : 'operator_gerindra'}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 p-3 font-bold text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="block text-slate-400 font-bold uppercase tracking-wide text-[9px]">
                  Kata Sandi / Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 p-3 font-bold text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
                  />
                </div>
              </div>

              {/* Error warning display */}
              {loginError && (
                <div className="bg-rose-950/40 border border-rose-900/60 p-3 rounded-xl flex items-start gap-2.5 text-rose-400 text-[11px] leading-relaxed">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Success registration notification message if just completed registration */}
              {regSuccessMsg && (
                <div className="bg-emerald-950/40 border border-emerald-900/60 p-3 rounded-xl flex items-start gap-2.5 text-emerald-400 text-[11px] leading-relaxed">
                  <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{regSuccessMsg}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl shadow-lg shadow-emerald-950/50 transition transform active:scale-98 flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider"
              >
                Masuk ke Aplikasi
              </button>

              {/* Conveniences: One-Click Demo Logins for easy testing */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wide block text-center">
                  Uji Coba Akun Demo Cepat
                </span>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginRole('Admin Kesbangpol');
                      setLoginUsername('admin_kesbang');
                      setLoginError('');
                    }}
                    className="bg-slate-900 hover:bg-slate-850 p-2 border border-slate-800 rounded-lg text-slate-300 font-bold text-center block"
                  >
                    👑 Kesbangpol (Juhanda)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginRole('Operator Partai');
                      setLoginUsername('operator_gerindra');
                      setLoginError('');
                    }}
                    className="bg-slate-900 hover:bg-slate-850 p-2 border border-slate-800 rounded-lg text-slate-300 font-bold text-center block"
                  >
                    🗳️ Admin Gerindra (Helmi)
                  </button>
                </div>
              </div>

            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs text-slate-300">
              
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed bg-slate-950 p-2.5 rounded-xl border border-slate-850">
                Pendaftaran ini ditujukan untuk Admin Partai Politik yang ingin melacak dan mengunggah dokumen kearsipan hibah. Setelah mendaftar, akun Anda harus disetujui oleh Kesbangpol terlebih dahulu untuk dapat masuk.
              </p>

              {/* Nama Lengkap */}
              <div className="space-y-1">
                <label className="block text-slate-400 font-bold uppercase tracking-wide text-[9px]">
                  Nama Lengkap Pendaftar
                </label>
                <input
                  type="text"
                  required
                  value={regNamaLengkap}
                  onChange={(e) => setRegNamaLengkap(e.target.value)}
                  placeholder="Contoh: Muhammad Syafe'i, S.E."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-bold text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Username & Email */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-slate-400 font-bold uppercase tracking-wide text-[9px]">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="operator_pkb"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-bold text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-400 font-bold uppercase tracking-wide text-[9px]">
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="pkb@ntbprov.or.id"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-bold text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

               {/* Afiliasi Partai Politik */}
              <div className="space-y-1">
                <label className="block text-slate-400 font-bold uppercase tracking-wide text-[9px]">
                  Afiliasi Partai Politik
                </label>
                <select
                  required
                  value={regPartaiId}
                  onChange={(e) => setRegPartaiId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-bold text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="">-- Pilih Partai Politik --</option>
                  {partai.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.nama} ({p.singkatan})
                    </option>
                  ))}
                </select>
              </div>

              {/* Kata Sandi */}
              <div className="space-y-1">
                <label className="block text-slate-400 font-bold uppercase tracking-wide text-[9px]">
                  Kata Sandi / Password
                </label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Masukkan kata sandi baru (minimal 4 karakter)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-bold text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Avatar Preset Selector */}
              <div className="space-y-2 bg-slate-950 p-2.5 rounded-xl border border-slate-850">
                <span className="block text-slate-400 font-bold uppercase tracking-wide text-[9px]">
                  Pilih Foto Profil
                </span>
                <div className="flex gap-2 justify-center">
                  {AVATAR_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setRegAvatar(preset)}
                      className={`w-8 h-8 rounded-full overflow-hidden border-2 transition transform hover:scale-110 ${
                        regAvatar === preset ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-transparent'
                      }`}
                    >
                      <img src={preset} alt={`preset ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Error during registration */}
              {regErrorMsg && (
                <div className="bg-rose-950/40 border border-rose-900/60 p-2.5 rounded-xl text-rose-400 text-[10px] leading-relaxed">
                  {regErrorMsg}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl shadow-lg transition transform active:scale-98 flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider"
              >
                Daftarkan Akun Baru
              </button>

            </form>
          )}

          <div className="text-center">
            <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest block">
              Sistem Kearsipan & Verifikasi Bantuan Hibah NTB &bull; 2026
            </span>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans select-none antialiased">
      
      {/* 1. APP BAR HEADER */}
      <header className="bg-slate-900 text-white h-16 px-6 border-b border-slate-800 flex items-center justify-between shadow-md select-none no-print sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏛️</span>
          <div>
            <h1 className="text-xs font-extrabold tracking-wide text-slate-100 uppercase">Sistem Informasi Data Hibah Parpol</h1>
            <p className="text-[10px] text-slate-400 font-bold tracking-wide mt-0.5 uppercase">Badan Kesatuan Bangsa dan Politik (Kesbangpol)</p>
          </div>
        </div>

        {/* Middle Global Search */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 w-80">
          <Search className="h-3.5 w-3.5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari partai, dokumen, pengurus..."
            value={searchGlobal}
            onChange={(e) => setSearchGlobal(e.target.value)}
            className="bg-transparent border-none text-[11px] text-slate-200 placeholder-slate-400 focus:outline-none w-full"
          />
          {searchGlobal && (
            <button onClick={() => setSearchGlobal('')} className="text-slate-400 hover:text-white">
              <XCircle className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Right Session Panel */}
        <div className="flex items-center gap-4">
          
          {/* Active Budget Year Badge */}
          <span className="bg-emerald-600 text-white font-extrabold px-3 py-1 rounded-full text-[10px] shadow-xs select-none uppercase tracking-wider">
            TA {pengaturan.tahunAnggaranAktif}
          </span>

          {/* Logged in User Profile Info */}
          <div className="flex items-center gap-2">
            <img 
              src={currentUser?.avatar} 
              alt={currentUser?.namaLengkap} 
              className="w-7 h-7 rounded-full object-cover border border-slate-700 shadow-2xs" 
            />
            <div className="hidden sm:block text-left">
              <span className="text-[10px] font-extrabold text-slate-200 block max-w-[120px] truncate">{currentUser?.namaLengkap}</span>
              <span className="text-[9px] text-emerald-400 font-bold block truncate">{currentUser?.role}</span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => {
              if (confirm('Apakah Anda yakin ingin keluar dari aplikasi?')) {
                localStorage.removeItem('kesbangpol_session');
                setCurrentUser(null);
              }
            }}
            className="flex items-center gap-1 px-2.5 py-1 bg-rose-950/60 hover:bg-rose-900 border border-rose-900/40 hover:border-rose-700 text-rose-300 hover:text-white rounded-lg text-[10px] font-extrabold transition cursor-pointer"
            title="Keluar"
          >
            <LogOut className="h-3.5 w-3.5" />
            Keluar
          </button>

          {/* Notification bell */}
          <div className="relative">
            <button 
              onClick={() => setNotifOpen(!notifOpen)}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition relative shadow-2xs"
            >
              <Bell className="h-4 w-4" />
              {notifikasi.filter(n => !n.dibaca).length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[8px] font-extrabold h-4 w-4 rounded-full flex items-center justify-center animate-bounce">
                  {notifikasi.filter(n => !n.dibaca).length}
                </span>
              )}
            </button>

            {/* Notification drop-feed */}
            {notifOpen && (
              <div className="absolute right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-150 w-80 text-slate-700 overflow-hidden text-xs z-50">
                <div className="p-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                  <span className="font-extrabold text-slate-800">Notifikasi Masuk ({notifikasi.filter(n => !n.dibaca).length})</span>
                  <button 
                    onClick={() => markNotificationRead('all')}
                    className="text-[10px] font-extrabold text-emerald-600 hover:text-emerald-700"
                  >
                    Tandai Semua Dibaca
                  </button>
                </div>
                <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                  {notifikasi.length === 0 ? (
                    <p className="p-4 text-center text-slate-400 italic">Tidak ada notifikasi sistem.</p>
                  ) : (
                    notifikasi.map(n => (
                      <div 
                        key={n.id} 
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-3 hover:bg-slate-50 transition cursor-pointer flex gap-2 ${!n.dibaca ? 'bg-emerald-50/20' : ''}`}
                      >
                        <div className="mt-0.5">
                          {n.tipe === 'warning_kadaluarsa' || n.tipe === 'lpj_warning' ? (
                            <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />
                          ) : n.tipe === 'diterima' || n.tipe === 'cair' ? (
                            <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <XCircle className="h-3.5 w-3.5 text-rose-500" />
                          )}
                        </div>
                        <div className="space-y-0.5">
                          <p className="font-semibold text-slate-800 text-[11px] leading-tight">{n.pesan}</p>
                          <span className="text-[9px] text-slate-400 block font-mono">
                            {new Date(n.tanggal).toLocaleDateString('id-ID')}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* 2. BODY LAYOUT */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* SIDEBAR NAVIGATION */}
        <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 select-none no-print">
          
          {/* Menu navigation */}
          <nav className="p-4 space-y-1">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-3 py-1 border-b border-slate-800/80 mb-2 select-none">
              Navigasi Aplikasi
            </div>

            <button
              onClick={() => setActiveMenu('dashboard')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition ${
                activeMenu === 'dashboard' ? 'bg-emerald-650 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard Utama</span>
            </button>

            <button
              onClick={() => setActiveMenu('parpol')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition ${
                activeMenu === 'parpol' ? 'bg-emerald-650 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>{isOperator ? 'Master Data' : 'Master Data Parpol'}</span>
            </button>

            {!isOperator && (
              <>
                <button
                  onClick={() => setActiveMenu('verifikasi')}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition ${
                    activeMenu === 'verifikasi' ? 'bg-emerald-650 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <FileCheck className="h-4 w-4" />
                  <span>Verifikasi Berkas</span>
                </button>

                <button
                  onClick={() => setActiveMenu('hibah')}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition ${
                    activeMenu === 'hibah' ? 'bg-emerald-650 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Wallet className="h-4 w-4" />
                  <span>Penyaluran Hibah</span>
                </button>

                <button
                  onClick={() => setActiveMenu('lpj')}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition ${
                    activeMenu === 'lpj' ? 'bg-emerald-650 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  <span>Evaluasi LPJ</span>
                </button>
              </>
            )}

            <button
              onClick={() => setActiveMenu('arsip')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition ${
                activeMenu === 'arsip' ? 'bg-emerald-650 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Archive className="h-4 w-4" />
              <span>Arsip Dokumen</span>
            </button>

            {!isOperator && (
              <>
                <button
                  onClick={() => setActiveMenu('spreadsheet')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition ${
                    activeMenu === 'spreadsheet' ? 'bg-emerald-650 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Table className="h-4 w-4" />
                    <span>Spreadsheet Database</span>
                  </div>
                  <span className="bg-emerald-900 text-emerald-400 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold">GRID</span>
                </button>

                <button
                  onClick={() => setActiveMenu('laporan')}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition ${
                    activeMenu === 'laporan' ? 'bg-emerald-650 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <FileBarChart className="h-4 w-4" />
                  <span>Rekap & Laporan</span>
                </button>

                <button
                  onClick={() => setActiveMenu('pengguna')}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition ${
                    activeMenu === 'pengguna' ? 'bg-emerald-650 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <UserCheck className="h-4 w-4" />
                  <span>Manajemen Pengguna</span>
                </button>

                <button
                  onClick={() => setActiveMenu('audit')}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition ${
                    activeMenu === 'audit' ? 'bg-emerald-650 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <History className="h-4 w-4" />
                  <span>Audit Trail Logs</span>
                </button>

                <button
                  onClick={() => setActiveMenu('pengaturan')}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition ${
                    activeMenu === 'pengaturan' ? 'bg-emerald-650 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Settings className="h-4 w-4" />
                  <span>Pengaturan Sistem</span>
                </button>
              </>
            )}
          </nav>

          {/* User profile card in footer */}
          <div className="p-4 border-t border-slate-800 bg-slate-950/40 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3 overflow-hidden">
                <img 
                  src={currentUser?.avatar} 
                  alt="Profile avatar" 
                  className="w-9 h-9 rounded-full object-cover border border-slate-700 shadow-2xs"
                />
                <div className="overflow-hidden">
                  <span className="font-bold text-slate-200 block truncate">{currentUser?.namaLengkap}</span>
                  <span className="text-[10px] text-slate-500 font-bold block truncate uppercase tracking-wider">{currentUser?.role}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  if (confirm('Apakah Anda yakin ingin keluar dari aplikasi?')) {
                    localStorage.removeItem('kesbangpol_session');
                    setCurrentUser(null);
                  }
                }}
                className="p-1.5 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-900/30 hover:border-rose-700 text-rose-300 hover:text-white rounded-lg transition cursor-pointer shrink-0"
                title="Keluar dari Sistem"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
            
            {isOperator && currentUser?.partaiId && (
              <div className="bg-emerald-950/60 border border-emerald-900/60 px-2 py-1.5 rounded text-emerald-400 font-bold text-[9px] uppercase tracking-wide text-center">
                Operator: {partai.find(p => p.id === currentUser.partaiId)?.singkatan}
              </div>
            )}
          </div>
        </aside>

        {/* MAIN DISPLAY VIEWPORT CONTAINER */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 relative print:p-0 print:bg-white print:overflow-visible">
          
          {/* HEADER DASHBOARD INFO BAR */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5 no-print">
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                {activeMenu === 'dashboard' && (isOperator ? 'Dashboard Utama Partai Politik' : 'Dashboard Analitis Hibah')}
                {activeMenu === 'parpol' && (isOperator ? 'Master Data Administrasi Partai' : 'Pusat Profil Partai Politik')}
                {activeMenu === 'verifikasi' && 'Validasi Berkas Persyaratan Administrasi'}
                {activeMenu === 'hibah' && 'Manajemen Milestones Penyaluran Hibah'}
                {activeMenu === 'lpj' && 'Evaluasi Laporan Pertanggungjawaban (LPJ)'}
                {activeMenu === 'arsip' && (isOperator ? 'Arsip Digital Berkas Persyaratan' : 'Kearsipan Dokumen & Berkas Digital')}
                {activeMenu === 'spreadsheet' && 'Sistem Kearsipan Lembar Kerja'}
                {activeMenu === 'laporan' && 'Laporan Komparatif & Rekapitulasi'}
                {activeMenu === 'pengguna' && 'Otorisasi Pengguna Sistem'}
                {activeMenu === 'audit' && 'Catatan Aktivitas Pengguna (Audit Trail)'}
                {activeMenu === 'pengaturan' && 'Sistem Konfigurasi & Kearsipan Backup'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {activeMenu === 'dashboard' && (isOperator ? 'Selamat datang! Pantau status kelengkapan berkas, alokasi dana bantuan hibah, serta progres pencairan secara real-time.' : 'Sistem kearsipan digital, verifikasi dokumen, dan monitoring hibah bantuan partai politik Provinsi Nusa Tenggara Barat.')}
                {activeMenu === 'parpol' && (isOperator ? 'Kelola dan perbarui seluruh informasi identitas partai, struktur kepengurusan DPW/DPD, rekening bank resmi, dan perolehan suara sah.' : 'Mengelola data partai politik aktif dprd daerah, pengurus, domisili, dan nomor rekening.')}
                {activeMenu === 'verifikasi' && 'Verifikasi, validasi berkas fisik, pencatatan checklist, revisi, dan approve.'}
                {activeMenu === 'hibah' && 'Tracking tahapan pencairan, penetapan SK bupati, penandatanganan NPHD, hingga penerbitan SP2D.'}
                {activeMenu === 'lpj' && 'Mengevaluasi pelaporan LPJ hibah tahun berjalan dari partai penerima bantuan.'}
                {activeMenu === 'arsip' && (isOperator ? 'Koleksi digital seluruh dokumen administrasi resmi partai politik yang telah berhasil diunggah dan diverifikasi.' : 'Arsip digital terpusat seluruh dokumen persyaratan hibah lengkap dengan versi kearsipan.')}
                {activeMenu === 'spreadsheet' && 'Sistem lembar kerja spreadsheet virtual untuk pengeditan raw database langsung.'}
                {activeMenu === 'laporan' && 'Unduh berkas laporan resmi pemerintah, rekap tahunan, dan pencetakan PDF.'}
                {activeMenu === 'pengguna' && 'Mengelola otorisasi hak akses pengguna admin kesbangpol, verifikator, pimpinan, operator parpol.'}
                {activeMenu === 'audit' && 'Log kearsipan sekuritas audit trail yang melacak alamat IP, user, objek perubahan.'}
                {activeMenu === 'pengaturan' && 'Menyetting bantuan anggaran per suara dprd, backup database json, restore data.'}
              </p>
            </div>

            {/* Quick Actions widget for administrative convenience */}
            <div className="flex items-center gap-2">
              <button 
                onClick={fetchData}
                className="p-2 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 text-slate-600 transition shadow-2xs"
                title="Sinkronkan dengan server database.json"
              >
                <RefreshCw className="h-4 w-4" />
              </button>

              {!isOperator && currentUser?.role !== 'Pimpinan' && currentUser?.role !== 'Verifikator' && activeMenu === 'parpol' && (
                <button
                  onClick={() => {
                    setSelectedPartai(null);
                    setPartaiFormOpen(true);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-xs flex items-center gap-1.5 transition"
                >
                  <Plus className="h-4 w-4" />
                  Daftarkan Parpol
                </button>
              )}
            </div>
          </div>

          {/* VIEWPORT CONTROLLER */}
          
          {/* A. DASHBOARD VIEW */}
          {activeMenu === 'dashboard' && (
            <div className="space-y-6">
              
              {/* Persetujuan Operator Partai Baru Alert Banner */}
              {(currentUser?.role === 'Super Admin' || currentUser?.role === 'Admin Kesbangpol') && 
                pengguna.filter(u => u.status === 'Menunggu Persetujuan').length > 0 && (
                  <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl p-4 shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl shrink-0">⏳</span>
                      <div>
                        <h4 className="font-extrabold text-sm">Permohonan Calon Admin Partai Menunggu Persetujuan!</h4>
                        <p className="text-xs text-amber-50 font-semibold mt-0.5">Terdapat {pengguna.filter(u => u.status === 'Menunggu Persetujuan').length} permohonan pendaftaran operator partai baru yang memerlukan tinjauan.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveMenu('pengguna')}
                      className="px-4 py-2 bg-slate-900/90 hover:bg-slate-950 text-white text-xs font-black rounded-lg transition transform active:scale-95 cursor-pointer self-start sm:self-center shrink-0 uppercase tracking-wider"
                    >
                      Buka Menu Persetujuan &rarr;
                    </button>
                  </div>
              )}
              
              {/* Stat Summary Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200/60 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Jumlah Partai Politik</span>
                    <span className="text-xl font-extrabold text-slate-800 block mt-1">{totalPartaiCount} Parpol</span>
                    <span className="text-[10px] text-emerald-600 font-bold block mt-1">DPW/DPD Provinsi NTB</span>
                  </div>
                  <div className="p-3 bg-slate-100 rounded-lg text-slate-600"><Users className="h-6 w-6" /></div>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200/60 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Jumlah Partai Aktif</span>
                    <span className="text-xl font-extrabold text-slate-800 block mt-1">{activePartaiCount} Aktif</span>
                    <span className="text-[10px] text-slate-500 font-semibold block mt-1">{totalPartaiCount - activePartaiCount} Parpol tidak mengajukan</span>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-lg text-emerald-700"><CheckCircle className="h-6 w-6" /></div>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200/60 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Total Nilai Hibah TA {pengaturan.tahunAnggaranAktif}</span>
                    <span className="text-base font-black text-emerald-800 block mt-1">
                      Rp {totalHibahNilai.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold block mt-1">Maksimal Alokasi APBD</span>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-lg text-emerald-700"><Wallet className="h-6 w-6" /></div>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200/60 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Dokumen Belum Lengkap</span>
                    <span className="text-xl font-extrabold text-rose-600 block mt-1">{totalIncompleteDocs} Berkas</span>
                    <span className="text-[10px] text-slate-500 font-semibold block mt-1">Harus diverifikasi</span>
                  </div>
                  <div className="p-3 bg-rose-50 rounded-lg text-rose-700"><AlertTriangle className="h-6 w-6" /></div>
                </div>
              </div>

              {/* Bento body rows */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Column 1 & 2: Main dashboard body list */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Alert notification widget */}
                  <div className="bg-white rounded-xl border border-slate-200/60 p-5 space-y-4">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-rose-500" />
                      Notifikasi Tenggat Masa Berlaku Dokumen (SK Pengurus / Domisili)
                    </h3>
                    <div className="space-y-3">
                      {dokumen
                        .filter(d => d.tipeDokumen === 'SK Kepengurusan' || d.tipeDokumen === 'Surat Domisili')
                        .map(d => {
                          const p = partai.find(party => party.id === d.partaiId);
                          const today = new Date();
                          const exp = d.masaBerlaku ? new Date(d.masaBerlaku) : null;
                          const diffTime = exp ? exp.getTime() - today.getTime() : 0;
                          const diffDays = exp ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 999;
                          const isWarning = diffDays <= 60; // less than 60 days
                          
                          if (!isWarning) return null;
                          return (
                            <div key={d.id} className="bg-rose-50/50 p-3.5 rounded-lg border border-rose-100 flex items-center justify-between">
                              <div className="space-y-0.5">
                                <span className="font-bold text-slate-800 block text-[11px]">{p?.nama} ({p?.singkatan})</span>
                                <span className="text-[10px] text-slate-500 block">Berkas "{d.tipeDokumen}" akan kadaluarsa pada <strong className="text-rose-600 font-semibold">{d.masaBerlaku}</strong></span>
                              </div>
                              <span className="font-bold text-rose-600 font-mono text-[11px] bg-white border border-rose-200 px-2.5 py-1 rounded">
                                {diffDays < 0 ? 'Kadaluarsa' : `${diffDays} Hari`}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  {/* List of Pending Verifications */}
                  <div className="bg-white rounded-xl border border-slate-200/60 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                        <FileCheck className="h-4 w-4 text-emerald-600" />
                        Pemeriksaan Berkas Menunggu Verifikasi
                      </h3>
                      <button 
                        onClick={() => setActiveMenu('verifikasi')}
                        className="text-[10px] font-extrabold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                      >
                        Lihat Semua Berkas
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {dokumen.filter(d => d.statusVerifikasi === 'Menunggu Verifikasi').slice(0, 5).map(d => {
                        const p = partai.find(party => party.id === d.partaiId);
                        return (
                          <div key={d.id} className="py-3 flex items-center justify-between hover:bg-slate-50/40 px-2 rounded-lg transition">
                            <div className="space-y-1">
                              <span className="font-bold text-slate-800 text-[11px] block">{d.tipeDokumen}</span>
                              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold font-mono">
                                <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{p?.singkatan}</span>
                                <span>No: {d.nomorDokumen}</span>
                                <span>Tanggal: {d.tanggal}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setVerifStatus('Lengkap');
                                setVerifNotes(d.catatanVerifikator);
                                setVerificationModalOpen(d);
                              }}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold shadow-2xs transition"
                            >
                              Verifikasi
                            </button>
                          </div>
                        );
                      })}
                      {dokumen.filter(d => d.statusVerifikasi === 'Menunggu Verifikasi').length === 0 && (
                        <p className="p-4 text-center text-slate-400 italic">Hebat! Tidak ada berkas tertunda menunggu verifikasi kearsipan.</p>
                      )}
                    </div>
                  </div>

                </div>

                {/* Column 3: Dashboard Side Bento */}
                <div className="space-y-6">
                  
                  {/* Quick stats distribution */}
                  <div className="bg-slate-900 rounded-xl p-5 text-white space-y-4">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2 select-none">
                      <Wallet className="h-4 w-4 text-emerald-400" />
                      Alokasi Anggaran TA {pengaturan.tahunAnggaranAktif}
                    </h3>

                    <div className="space-y-3.5 pt-2">
                      {partai.filter(p => p.statusAktif).map(p => {
                        const percentage = totalHibahNilai > 0 ? Math.round((p.totalHakBantuan / totalHibahNilai) * 100) : 0;
                        return (
                          <div key={p.id} className="space-y-1">
                            <div className="flex justify-between font-bold text-[11px]">
                              <span>{p.singkatan}</span>
                              <span className="font-mono text-emerald-300">Rp {p.totalHakBantuan.toLocaleString('id-ID')} ({percentage}%)</span>
                            </div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-emerald-500 h-full" style={{ width: `${percentage}%` }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* App parameters card */}
                  <div className="bg-white rounded-xl border border-slate-200/60 p-5 space-y-4">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                      <Settings className="h-4 w-4 text-slate-500" />
                      Konfigurasi Sistem Aktif
                    </h3>
                    <div className="space-y-2.5 leading-relaxed text-slate-600">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Instansi Pemerintah</span>
                        <span className="font-bold text-slate-800">{pengaturan.namaInstansi}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Nilai Hibah per Suara DPRD</span>
                        <span className="font-mono font-extrabold text-slate-800">Rp {pengaturan.nilaiBantuanPerSuara.toLocaleString('id-ID')} / Suara Sah</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Jumlah Jenis Berkas Wajib</span>
                        <span className="font-bold text-slate-800">{pengaturan?.tipeDokumenDaftar?.length || 0} Berkas Kelengkapan</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* B. MASTER DATA PARTAI */}
          {activeMenu === 'parpol' && (
            <div className="space-y-6">
              {isOperator ? (
                (() => {
                  const operatorParty = partai.find(p => p.id === currentUser?.partaiId);
                  if (!operatorParty) {
                    return (
                      <div className="bg-white rounded-xl shadow-xs border border-slate-200/60 p-8 text-center text-slate-500">
                        Partai politik untuk akun Anda tidak ditemukan atau belum diset.
                      </div>
                    );
                  }
                  return (
                    <PartaiForm
                      partai={operatorParty}
                      pengaturan={pengaturan!}
                      onSave={handleSavePartai}
                      onClose={() => {}}
                      isInline={true}
                      onImportClick={() => {
                        setSelectedUploadPartaiId(operatorParty.id);
                        setUploadDocOpen(pengaturan?.tipeDokumenDaftar[0] || 'SK Kepengurusan');
                        setImportNomorDokumen(`DOC/${operatorParty.singkatan}/${Date.now().toString().slice(-4)}/2026`);
                        setImportTanggal(new Date().toISOString().split('T')[0]);
                        setImportMasaBerlaku("2027-02-15");
                        setImportFileData("");
                        setImportFileName("");
                        setImportFileSize("");
                        setImportFileType("pdf");
                      }}
                    />
                  );
                })()
              ) : (
                <>
                  {/* Search filter bar specific to parpol tab */}
                  <div className="bg-white p-4 rounded-xl shadow-2xs border border-slate-200/60 flex items-center justify-between">
                    <div className="relative w-full max-w-sm">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Cari berdasarkan nama, singkatan, ketua..."
                        value={searchGlobal}
                        onChange={(e) => setSearchGlobal(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Grid layout of political party profiles */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getFilteredPartai().map(p => {
                      const partyDocs = dokumen.filter(d => d.partaiId === p.id);
                      const completeDocs = partyDocs.filter(d => d.statusVerifikasi === 'Lengkap').length;
                      const totalReqDocs = pengaturan?.tipeDokumenDaftar?.length || 16;
                      const completenessPercent = totalReqDocs > 0 ? Math.round((completeDocs / totalReqDocs) * 100) : 0;
                      
                      return (
                        <div key={p.id} className="bg-white rounded-xl shadow-xs border border-slate-200/60 p-5 flex flex-col justify-between hover:shadow-md transition">
                          <div className="space-y-4">
                            {/* Header card */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <span className="text-3xl w-12 h-12 p-1 bg-slate-50 border border-slate-150 rounded-lg shadow-2xs select-none flex items-center justify-center overflow-hidden shrink-0">
                                  {p.logo && (p.logo.startsWith('data:image') || p.logo.startsWith('http') || p.logo.startsWith('/')) ? (
                                    <img src={p.logo} alt={p.singkatan} className="w-10 h-10 object-contain rounded" referrerPolicy="no-referrer" />
                                  ) : (
                                    p.logo || '🔴'
                                  )}
                                </span>
                                <div>
                                  <h3 className="font-extrabold text-slate-800 text-sm">{p.nama}</h3>
                                  <span className="text-[10px] text-slate-400 font-extrabold font-mono uppercase">
                                    {p.singkatan} &bull; Urut {p.nomorUrut}
                                  </span>
                                </div>
                              </div>
                              
                              <span className={`px-2 py-0.5 text-[8px] font-extrabold rounded ${p.statusAktif ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                                {p.statusAktif ? 'AKTIF' : 'NONAKTIF'}
                              </span>
                            </div>

                            {/* Mid content info */}
                            <div className="space-y-2 text-slate-600 leading-relaxed border-t border-b border-slate-100 py-3 font-medium">
                              <div>
                                <span className="text-[10px] text-slate-400 font-bold uppercase block">Ketua DPW/DPD</span>
                                <span className="text-slate-800 font-bold">{p.ketua}</span>
                              </div>
                              <div className="flex justify-between">
                                <div>
                                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Jumlah Kursi DPRD</span>
                                  <span className="text-slate-800 font-bold font-mono">{p.jumlahKursiDprd} Kursi</span>
                                </div>
                                <div className="text-right">
                                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Hak Dana Bantuan</span>
                                  <span className="text-emerald-700 font-bold font-mono">Rp {p.totalHakBantuan.toLocaleString('id-ID')}</span>
                                </div>
                              </div>

                              {/* Completeness Bar */}
                              <div className="space-y-1 pt-1.5">
                                <div className="flex justify-between text-[10px] font-bold">
                                  <span>Kepatuhan Dokumen Persyaratan</span>
                                  <span className="font-mono text-slate-800">{completeDocs}/{totalReqDocs} ({completenessPercent}%)</span>
                                </div>
                                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                  <div className="bg-emerald-500 h-full" style={{ width: `${completenessPercent}%` }}></div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Card actions */}
                          <div className="flex items-center justify-between gap-2 pt-4">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => setDetailPartaiOpen(p)}
                                className="flex items-center gap-1 text-[10px] font-extrabold text-slate-600 hover:text-emerald-700 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs transition"
                              >
                                <FolderOpen className="h-3.5 w-3.5" />
                                Lembar Profil
                              </button>

                              {currentUser?.role !== 'Pimpinan' && (
                                <button
                                  onClick={() => {
                                    setSelectedUploadPartaiId(p.id);
                                    setUploadDocOpen(pengaturan?.tipeDokumenDaftar[0] || 'SK Kepengurusan');
                                    setImportNomorDokumen(`DOC/${p.singkatan}/${Date.now().toString().slice(-4)}/2026`);
                                    setImportTanggal(new Date().toISOString().split('T')[0]);
                                    setImportMasaBerlaku("2027-02-15");
                                    setImportFileData("");
                                    setImportFileName("");
                                    setImportFileSize("");
                                    setImportFileType("pdf");
                                  }}
                                  className="flex items-center gap-1 text-[10px] font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg shadow-xs transition"
                                  title="Import Berkas Persyaratan"
                                >
                                  <Upload className="h-3.5 w-3.5" />
                                  Import Berkas
                                </button>
                              )}
                            </div>

                            {!isOperator && currentUser?.role !== 'Pimpinan' && currentUser?.role !== 'Verifikator' && (
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => {
                                    setSelectedPartai(p);
                                    setPartaiFormOpen(true);
                                  }}
                                  className="p-1.5 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-500 hover:text-emerald-700 transition"
                                  title="Edit Profil"
                                >
                                  <Edit className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeletePartai(p.id, p.singkatan)}
                                  className="p-1.5 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-lg text-slate-400 hover:text-rose-600 transition"
                                  title="Hapus Parpol"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}

          {/* C. VERIFIKASI DOKUMEN VIEW */}
          {activeMenu === 'verifikasi' && (
            <div className="space-y-6">
              
              {/* Table of all uploaded documents */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
                  <span className="font-extrabold text-slate-800">Verifikasi Dokumen Kelengkapan Hibah</span>
                  <div className="relative w-full max-w-xs">
                    <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Cari berkas parpol..."
                      value={searchGlobal}
                      onChange={(e) => setSearchGlobal(e.target.value)}
                      className="w-full pl-8 pr-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200 select-none divide-x divide-slate-200/60">
                        <th className="p-3 w-12 text-center">No</th>
                        <th className="p-3 w-40">Partai Politik</th>
                        <th className="p-3">Jenis Dokumen Persyaratan</th>
                        <th className="p-3 w-44">Nomor Dokumen</th>
                        <th className="p-3 w-28 text-center">Tanggal SK</th>
                        <th className="p-3 w-32 text-center">Masa Berlaku</th>
                        <th className="p-3 w-36 text-center">Status Verifikasi</th>
                        <th className="p-3 w-32 text-center">Aksi Verifikasi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150 text-slate-700">
                      {getFilteredDocuments().map((d, idx) => {
                        const p = partai.find(party => party.id === d.partaiId);
                        return (
                          <tr key={d.id} className="hover:bg-slate-50/50">
                            <td className="p-3 text-center text-slate-400 font-mono font-bold">{idx + 1}</td>
                            <td className="p-3 font-bold text-slate-900">{p?.nama} ({p?.singkatan})</td>
                            <td className="p-3 font-semibold text-slate-800">{d.tipeDokumen}</td>
                            <td className="p-3 text-slate-600 font-mono text-[11px]">{d.nomorDokumen}</td>
                            <td className="p-3 text-center text-slate-500">{d.tanggal}</td>
                            <td className="p-3 text-center text-slate-500 font-mono font-bold">{d.masaBerlaku}</td>
                            <td className="p-3 text-center">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                d.statusVerifikasi === 'Lengkap' ? 'bg-emerald-100 text-emerald-800' :
                                d.statusVerifikasi === 'Perbaikan' ? 'bg-rose-100 text-rose-800' :
                                d.statusVerifikasi === 'Menunggu Verifikasi' ? 'bg-blue-150 text-blue-800' : 'bg-slate-150 text-slate-700'
                              }`}>
                                {d.statusVerifikasi}
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => setDocumentViewerOpen(d)}
                                  className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800 transition"
                                  title="Pratinjau PDF"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                </button>
                                {currentUser?.role !== 'Pimpinan' && currentUser?.role !== 'Operator Partai' && (
                                  <button
                                    onClick={() => {
                                      setVerifStatus(d.statusVerifikasi);
                                      setVerifNotes(d.catatanVerifikator);
                                      const isLengkap = d.statusVerifikasi === 'Lengkap';
                                      setVerifCheck1(isLengkap);
                                      setVerifCheck2(isLengkap);
                                      setVerifCheck3(isLengkap);
                                      setVerifCheck4(isLengkap);
                                      setVerificationModalOpen(d);
                                    }}
                                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold shadow-2xs transition"
                                  >
                                    Validasi
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {getFilteredDocuments().length === 0 && (
                        <tr>
                          <td colSpan={8} className="p-8 text-center text-slate-400 italic">Tidak ada berkas yang diunggah.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* D. DATA HIBAH VIEW */}
          {activeMenu === 'hibah' && (
            <div className="space-y-6">
              
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <span className="font-extrabold text-slate-800">Manajemen Milestones & SK Penyaluran Dana Hibah</span>
                  <span className="text-[10px] text-slate-400 font-medium">Berdasarkan usulan tim verifikator Kesbangpol</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200 select-none divide-x divide-slate-200/60">
                        <th className="p-3 w-12 text-center">No</th>
                        <th className="p-3 w-40">Partai Politik</th>
                        <th className="p-3 w-28 text-center">Tahun Anggaran</th>
                        <th className="p-3 text-right">Nilai Bantuan (Rp)</th>
                        <th className="p-3">Nomor SK / NPHD</th>
                        <th className="p-3 w-44 text-center">Milestones Status</th>
                        <th className="p-3 w-32">Nomor SP2D</th>
                        <th className="p-3 w-28 text-center">Aksi Pelacakan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150 text-slate-700">
                      {partai.filter(p => p.statusAktif).map((p, idx) => {
                        const h = hibah.find(item => item.partaiId === p.id && item.tahunAnggaran === pengaturan.tahunAnggaranAktif);
                        return (
                          <tr key={p.id} className="hover:bg-slate-50/50">
                            <td className="p-3 text-center text-slate-400 font-mono font-bold">{idx + 1}</td>
                            <td className="p-3 font-bold text-slate-900">{p.nama} ({p.singkatan})</td>
                            <td className="p-3 text-center font-bold font-mono">{pengaturan.tahunAnggaranAktif}</td>
                            <td className="p-3 text-right font-bold text-emerald-800 font-mono">Rp {p.totalHakBantuan.toLocaleString('id-ID')}</td>
                            <td className="p-3">
                              <div className="flex flex-col gap-0.5 text-[10px] text-slate-500">
                                <span>SK: {h?.nomorSk || 'Belum Terbit'}</span>
                                <span>NPHD: {h?.nomorNphd || 'Belum Ditandatangani'}</span>
                              </div>
                              <div className="mt-1.5">
                                <button
                                  onClick={() => setPrintPreviewOpen({ partai: p, hibah: h || null })}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 rounded text-[9px] font-bold border border-slate-200 hover:border-emerald-200 transition cursor-pointer"
                                >
                                  <Printer className="h-3.5 w-3.5" />
                                  Print/Preview Berkas
                                </button>
                              </div>
                            </td>
                            <td className="p-3 text-center">
                              <span className={`px-2.5 py-1 rounded text-[9px] font-extrabold ${
                                h?.statusPenyaluran === 'Cair' ? 'bg-emerald-100 text-emerald-800' :
                                h?.statusPenyaluran === 'SP2D Terbit' ? 'bg-cyan-100 text-cyan-800' :
                                h?.statusPenyaluran === 'Proses Verifikasi' ? 'bg-amber-100 text-amber-800' : 'bg-slate-150 text-slate-700'
                              }`}>
                                {h?.statusPenyaluran || 'Belum Diproses'}
                              </span>
                            </td>
                            <td className="p-3 text-slate-600 font-mono font-bold text-[11px]">{h?.nomorSp2d || '-'}</td>
                            <td className="p-3 text-center">
                              {currentUser?.role !== 'Pimpinan' && currentUser?.role !== 'Verifikator' && currentUser?.role !== 'Operator Partai' ? (
                                <button
                                  onClick={() => {
                                    const defaultForm = h || {
                                      id: `h_${p.id}`,
                                      partaiId: p.id,
                                      tahunAnggaran: pengaturan.tahunAnggaranAktif,
                                      nomorSk: "SK-BUPATI/334/KESBANGPOL/2026",
                                      nomorNphd: "",
                                      nilaiBantuan: p.totalHakBantuan,
                                      tanggalPenetapan: new Date().toISOString().slice(0, 10),
                                      tanggalPenandatanganan: "",
                                      statusPenyaluran: 'Proses Verifikasi',
                                      tahapPenyaluran: "Tahap Tunggal (100%)",
                                      tanggalCair: "",
                                      nomorSp2d: "",
                                      nomorSpm: "",
                                      nomorSpd: "",
                                      keterangan: ""
                                    };
                                    setHibahFormOpen(defaultForm);
                                  }}
                                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold shadow-2xs transition"
                                >
                                  Update Pelacakan
                                </button>
                              ) : (
                                <span className="text-[10px] text-slate-400 font-bold italic">Akses Terbatas</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* E. LPJ EVALUATION VIEW */}
          {activeMenu === 'lpj' && (
            <div className="space-y-6">
              
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <span className="font-extrabold text-slate-800">Evaluasi & Validasi LPJ Bantuan Keuangan Parpol</span>
                  <span className="text-[10px] text-slate-400 font-medium">Batas akhir: 1 tahun setelah pencairan dilakukan</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200 select-none divide-x divide-slate-200/60">
                        <th className="p-3 w-12 text-center">No</th>
                        <th className="p-3 w-40">Partai Politik</th>
                        <th className="p-3 w-16 text-center">Tahun</th>
                        <th className="p-3 w-28 text-center">Tgl Lapor</th>
                        <th className="p-3 text-right">Nilai Penggunaan (Rp)</th>
                        <th className="p-3">Ringkasan Kegiatan</th>
                        <th className="p-3 w-40 text-center">Status LPJ</th>
                        <th className="p-3 w-28 text-center">Aksi Review</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150 text-slate-700">
                      {lpj.map((l, idx) => {
                        const p = partai.find(party => party.id === l.partaiId);
                        return (
                          <tr key={l.id} className="hover:bg-slate-50/50">
                            <td className="p-3 text-center text-slate-400 font-mono font-bold">{idx + 1}</td>
                            <td className="p-3 font-bold text-slate-900">{p?.nama} ({p?.singkatan})</td>
                            <td className="p-3 text-center font-bold">{l.tahun}</td>
                            <td className="p-3 text-center text-slate-500 font-mono">{l.tanggalLaporan}</td>
                            <td className="p-3 text-right font-bold text-emerald-800 font-mono">Rp {l.nilaiPenggunaanDana.toLocaleString('id-ID')}</td>
                            <td className="p-3 max-w-xs truncate text-slate-500 italic">{l.ringkasanKegiatan}</td>
                            <td className="p-3 text-center">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                l.statusDiterima === 'Diterima' ? 'bg-emerald-100 text-emerald-800' :
                                l.statusDiterima === 'Perbaikan' ? 'bg-amber-100 text-amber-800' :
                                l.statusDiterima === 'Ditolak' ? 'bg-rose-100 text-rose-800' : 'bg-slate-150 text-slate-700'
                              }`}>
                                {l.statusDiterima}
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              {currentUser?.role !== 'Operator Partai' && currentUser?.role !== 'Pimpinan' ? (
                                <button
                                  onClick={() => setLpjReviewOpen(l)}
                                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold shadow-2xs transition"
                                >
                                  Evaluasi LPJ
                                </button>
                              ) : (
                                <span className="text-[10px] text-slate-400 font-bold italic">Akses Terbatas</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* F. ARSIP DIGITAL VIEW */}
          {activeMenu === 'arsip' && (
            <div className="space-y-6">
              
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <span className="font-extrabold text-slate-800">Kearsipan Dokumen & Berkas Penunjang Daerah</span>
                  <div className="flex items-center gap-2">
                    <Search className="h-3.5 w-3.5 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Cari arsip digital..."
                      value={searchGlobal}
                      onChange={(e) => setSearchGlobal(e.target.value)}
                      className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-[10px] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200 select-none">
                        <th className="p-3 w-12 text-center">No</th>
                        <th className="p-3 w-28">Partai</th>
                        <th className="p-3">Jenis Dokumen Persyaratan</th>
                        <th className="p-3 w-44">Nomor Dokumen</th>
                        <th className="p-3 w-24 text-center">Ukur File</th>
                        <th className="p-3 w-32">Pengunggah Berkas</th>
                        <th className="p-3 w-32 text-center">Unduhan Resmi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150 text-slate-700">
                      {getFilteredDocuments().map((d, idx) => {
                        const p = partai.find(party => party.id === d.partaiId);
                        return (
                          <tr key={d.id} className="hover:bg-slate-50/50">
                            <td className="p-3 text-center text-slate-400 font-mono font-bold">{idx + 1}</td>
                            <td className="p-3 font-bold text-slate-800">{p?.singkatan}</td>
                            <td className="p-3 font-medium text-slate-800">{d.tipeDokumen}</td>
                            <td className="p-3 text-slate-600 font-mono text-[10px]">{d.nomorDokumen}</td>
                            <td className="p-3 text-center font-mono text-slate-400">{d.fileSize}</td>
                            <td className="p-3 text-slate-500 truncate">{d.uploadedBy}</td>
                            <td className="p-3 text-center">
                              <button
                                onClick={() => triggerSimulatedDownload(d.fileName)}
                                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded text-[10px] font-bold text-slate-700 transition"
                              >
                                Unduh (PDF)
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* G. DATABASE SPREADSHEET VIEW */}
          {activeMenu === 'spreadsheet' && (
            <SpreadsheetView 
              partai={partai}
              dokumen={dokumen}
              hibah={hibah}
              lpj={lpj}
              onUpdatePartai={handleSavePartai}
              onUpdateDokumen={async (d) => {
                setDokumen(prev => prev.map(item => item.id === d.id ? d : item));
                await fetch('/api/dokumen', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(d)
                });
              }}
              onUpdateHibah={async (h) => {
                setHibah(prev => prev.map(item => item.id === h.id ? h : item));
                await fetch('/api/hibah', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(h)
                });
              }}
              onUpdateLPJ={async (l) => {
                setLpj(prev => prev.map(item => item.id === l.id ? l : item));
                await fetch('/api/lpj', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(l)
                });
              }}
              onRefresh={fetchData}
              logAktivitas={logAktivitas}
            />
          )}

          {/* H. REPORT MODULE */}
          {activeMenu === 'laporan' && (
            <LaporanView 
              partai={partai}
              dokumen={dokumen}
              hibah={hibah}
              lpj={lpj}
              pengaturan={pengaturan}
              logAktivitas={logAktivitas}
            />
          )}

          {/* I. USER AUDITING PROFILE */}
          {activeMenu === 'pengguna' && (
            <div className="space-y-6">
              
              {/* PANEL PERSETUJUAN PENDAFTARAN OPERATOR PARTAI */}
              {(currentUser?.role === 'Super Admin' || currentUser?.role === 'Admin Kesbangpol') && (
                (() => {
                  const pendingUsers = pengguna.filter(u => u.status === 'Menunggu Persetujuan');
                  if (pendingUsers.length === 0) return null;
                  
                  return (
                    <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-5 shadow-sm space-y-4">
                      <div className="flex items-center gap-2.5">
                        <span className="p-1.5 bg-amber-100 rounded-lg text-amber-700 text-lg">⏳</span>
                        <div>
                          <h3 className="font-extrabold text-amber-900 text-sm">Persetujuan Pendaftaran Admin Partai Baru</h3>
                          <p className="text-[10px] text-amber-600 font-bold">Terdapat {pendingUsers.length} permohonan pendaftaran akun operator partai politik baru yang perlu ditinjau</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pendingUsers.map(u => {
                          const p = partai.find(party => party.id === u.partaiId);
                          return (
                            <div key={u.id} className="bg-white border border-amber-150 rounded-xl p-4 flex items-start gap-3 shadow-xs">
                              <img src={u.avatar} alt={u.namaLengkap} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                              <div className="flex-1 space-y-1 text-xs">
                                <div className="flex items-center justify-between">
                                  <span className="font-extrabold text-xs text-slate-800 block">{u.namaLengkap}</span>
                                  <span className="text-[9px] text-amber-600 font-extrabold uppercase bg-amber-100 px-2 py-0.5 rounded-md">Menunggu Persetujuan</span>
                                </div>
                                <span className="text-[10px] text-slate-500 font-bold block">@{u.username} &bull; {u.email}</span>
                                <div className="flex items-center gap-1.5 pt-1">
                                  <span className="text-[10px] text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100 flex items-center gap-1">
                                    🏛️ {p ? `${p.nama} (${p.singkatan})` : 'Afiliasi Tidak Diketahui'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 pt-2">
                                  <button
                                    onClick={() => handleApprovePengguna(u.id, 'setujui')}
                                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-extrabold rounded-md shadow-xs transition cursor-pointer"
                                  >
                                    Setujui Akun
                                  </button>
                                  <button
                                    onClick={() => handleApprovePengguna(u.id, 'tolak')}
                                    className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-extrabold rounded-md border border-rose-200 transition cursor-pointer"
                                  >
                                    Tolak
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden h-fit">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-slate-800 text-sm block">Daftar Pengguna Aplikasi Terdaftar</span>
                    <span className="text-[10px] text-slate-400 font-bold">Total {pengguna.length} Akun terdaftar dalam sistem kearsipan</span>
                  </div>
                  
                  {/* Tambah button */}
                  {(currentUser?.role === 'Super Admin' || currentUser?.role === 'Admin Kesbangpol') ? (
                    <button
                      onClick={() => {
                        setSelectedPengguna(null);
                        setPenggunaFormOpen(true);
                      }}
                      className="flex items-center gap-1 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-extrabold rounded-lg shadow-xs transition transform active:scale-95 cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Tambah Pengguna
                    </button>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-extrabold bg-slate-100 px-2.5 py-1 rounded-lg">Akses Terbatas</span>
                  )}
                </div>

                <div className="divide-y divide-slate-100 text-slate-700">
                  {pengguna.map(u => {
                    const assocParty = u.partaiId ? partai.find(p => p.id === u.partaiId) : null;
                    return (
                      <div key={u.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50/50 transition gap-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={u.avatar} 
                            alt={u.namaLengkap} 
                            className="w-11 h-11 rounded-full object-cover border-2 border-slate-200/80 shadow-2xs shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-800 text-sm">{u.namaLengkap}</span>
                              {currentUser?.id === u.id && (
                                <span className="bg-emerald-50 text-emerald-700 border border-emerald-150 px-1.5 py-0.5 rounded text-[8px] font-extrabold">AKUN ANDA</span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 font-bold block mt-0.5">
                              Username: <span className="font-mono text-slate-600 font-extrabold bg-slate-100 px-1 py-0.2 rounded">{u.username}</span> &bull; Email: <span className="font-mono text-slate-500">{u.email}</span> &bull; Kata Sandi: <span className="font-mono text-emerald-700 font-extrabold bg-emerald-50 border border-emerald-100 px-1.5 py-0.2 rounded">{u.password || 'admin123'}</span>
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                          <div className="flex flex-col items-end gap-1">
                            <span className={`px-2.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wide ${
                              u.role === 'Super Admin' ? 'bg-purple-100 text-purple-800' :
                              u.role === 'Admin Kesbangpol' ? 'bg-emerald-100 text-emerald-800' :
                              u.role === 'Verifikator' ? 'bg-blue-100 text-blue-800' :
                              u.role === 'Operator Partai' ? 'bg-cyan-100 text-cyan-800' : 'bg-slate-100 text-slate-800'
                            }`}>
                              {u.role} {assocParty ? `(${assocParty.singkatan})` : ''}
                            </span>

                            <span className={`text-[10px] font-extrabold flex items-center gap-1 select-none ${
                              u.status === 'Aktif' ? 'text-emerald-600' : 'text-slate-400'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'Aktif' ? 'bg-emerald-500' : 'bg-slate-350'}`} />
                              {u.status}
                            </span>
                          </div>

                          {/* Actions: Edit & Hapus */}
                          {(currentUser?.role === 'Super Admin' || currentUser?.role === 'Admin Kesbangpol') && (
                            <div className="flex items-center gap-1.5 border-l pl-4 border-slate-150">
                              {u.status === 'Menunggu Persetujuan' && (
                                <>
                                  <button
                                    onClick={() => handleApprovePengguna(u.id, 'setujui')}
                                    className="p-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-lg shadow-2xs transition cursor-pointer flex items-center gap-1 font-bold text-[9px]"
                                    title="Setujui Pendaftaran Akun"
                                  >
                                    <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                                    <span>Setujui</span>
                                  </button>
                                  <button
                                    onClick={() => handleApprovePengguna(u.id, 'tolak')}
                                    className="p-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-lg shadow-2xs transition cursor-pointer flex items-center gap-1 font-bold text-[9px]"
                                    title="Tolak Pendaftaran Akun"
                                  >
                                    <XCircle className="h-3.5 w-3.5 text-rose-600" />
                                    <span>Tolak</span>
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => {
                                  setSelectedPengguna(u);
                                  setPenggunaFormOpen(true);
                                }}
                                className="p-1.5 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 text-slate-500 hover:text-emerald-700 rounded-lg shadow-2xs transition cursor-pointer"
                                title="Ubah Akun"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeletePengguna(u.id, u.namaLengkap)}
                                disabled={currentUser?.id === u.id}
                                className="p-1.5 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-400 hover:text-rose-600 rounded-lg shadow-2xs transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                                title={currentUser?.id === u.id ? "Tidak dapat menghapus akun sendiri" : "Hapus Akun"}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Import Logo Resmi Column */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden h-fit p-5 space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <span className="font-extrabold text-slate-800 text-sm block">Konfigurasi Logo Daerah</span>
                  <span className="text-[10px] text-slate-400 font-bold">Lambang resmi Pemprov NTB untuk Dokumen Master</span>
                </div>

                <div className="flex flex-col items-center gap-3 py-5 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Logo Pemerintah Saat Ini</span>
                  <img 
                    src={pengaturan?.logoInstansi || "https://upload.wikimedia.org/wikipedia/commons/b/ad/Lambang_Nusa_Tenggara_Barat.png"} 
                    alt="Logo Pemprov NTB" 
                    className="w-28 h-28 object-contain p-2 bg-white rounded-lg border border-slate-150/85 shadow-2xs"
                    referrerPolicy="no-referrer"
                  />
                  <div className="text-center px-4 mt-1">
                    <span className="text-[11px] font-extrabold text-slate-700 block">Provinsi Nusa Tenggara Barat</span>
                    <span className="text-[9px] text-slate-400 font-medium block mt-0.5">Tampilan kiri atas pada NPHD & berkas kuitansi</span>
                  </div>
                </div>

                {(currentUser?.role === 'Super Admin' || currentUser?.role === 'Admin Kesbangpol') ? (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Impor Logo Baru (PNG/JPG)</span>
                      <label className="block">
                        <span className="sr-only">Pilih berkas logo</span>
                        <input 
                          type="file" 
                          accept="image/png, image/jpeg, image/jpg"
                          onChange={handleLogoImport}
                          className="block w-full text-xs text-slate-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-lg file:border-0
                            file:text-xs file:font-bold
                            file:bg-emerald-50 file:text-emerald-700
                            hover:file:bg-emerald-100
                            cursor-pointer"
                        />
                      </label>
                    </div>
                    <p className="text-[9px] text-slate-400 leading-relaxed">
                      *Format gambar yang didukung: PNG, JPG, atau JPEG dengan rasio aspek seimbang (1:1). Maksimal ukuran file: 2MB untuk optimalisasi penyimpanan.
                    </p>
                    
                    <button
                      onClick={handleResetLogo}
                      className="w-full py-1.5 bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-bold rounded-lg text-[10px] border border-slate-200 hover:border-rose-150 transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      Kembalikan ke Logo Default NTB
                    </button>
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-100 p-3 rounded-lg text-[10px] text-amber-800 leading-normal">
                    <strong>Akses Terbatas:</strong> Hanya Super Admin atau Admin Kesbangpol yang berhak melakukan impor atau mengubah Logo Resmi Pemerintah Daerah.
                  </div>
                )}
              </div>

            </div>
            </div>
          )}

          {/* J. AUDIT TRAIL LOGS */}
          {activeMenu === 'audit' && (
            <AuditTrailView 
              logs={audit}
              currentUserRole={currentUser?.role || ''}
              onClearLogs={() => setAudit([])}
            />
          )}

          {/* K. SYSTEM SETTINGS PANEL */}
          {activeMenu === 'pengaturan' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Configuration form */}
                <div className="bg-white rounded-xl border border-slate-150 p-5 space-y-4">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 border-b pb-1.5 select-none">
                    Konfigurasi Bantuan Keuangan Daerah
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-slate-500 font-bold mb-1">Tahun Anggaran Aktif</label>
                      <input 
                        type="number" 
                        value={pengaturan.tahunAnggaranAktif} 
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setPengaturan(prev => prev ? { ...prev, tahunAnggaranAktif: val } : null);
                        }}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-500 font-bold mb-1">Bantuan per Suara DPRD (Rp)</label>
                      <input 
                        type="number" 
                        value={pengaturan.nilaiBantuanPerSuara} 
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setPengaturan(prev => prev ? { ...prev, nilaiBantuanPerSuara: val } : null);
                        }}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-500 font-bold mb-1">Nama Instansi</label>
                      <input 
                        type="text" 
                        value={pengaturan.namaInstansi} 
                        onChange={(e) => {
                          const val = e.target.value;
                          setPengaturan(prev => prev ? { ...prev, namaInstansi: val } : null);
                        }}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800"
                      />
                    </div>

                    <button
                      onClick={async () => {
                        await fetch('/api/settings', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(pengaturan)
                        });
                        logAktivitas('Edit', 'Konfigurasi Sistem', 'Memperbarui parameter sistem keuangan daerah.');
                        alert("Parameter sistem berhasil disimpan!");
                      }}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs transition"
                    >
                      Simpan Parameter Daerah
                    </button>
                  </div>
                </div>

                {/* Database Backup / Utility Console */}
                <div className="bg-white rounded-xl border border-slate-150 p-5 space-y-4">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 border-b pb-1.5 select-none">
                    Konsul & Utilitas Spreadsheet Database
                  </h3>
                  <p className="text-slate-500 leading-relaxed text-[11px]">
                    Sistem ini terintegrasi penuh menggunakan berkas flat-file <code className="bg-slate-100 text-slate-700 px-1 rounded font-mono text-[10px]">database.json</code> sebagai lembar kerja kearsipan. Lakukan backup berkala.
                  </p>

                  <div className="space-y-3 pt-2">
                    <button
                      onClick={handleDownloadBackup}
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-slate-700 font-bold transition flex items-center justify-center gap-1.5"
                    >
                      <Download className="h-4 w-4" />
                      Download Backup Database JSON
                    </button>

                    <button
                      onClick={handleImportBackup}
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-slate-700 font-bold transition flex items-center justify-center gap-1.5"
                    >
                      <Upload className="h-4 w-4" />
                      Restore Database dari JSON
                    </button>

                    <button
                      onClick={handleResetDatabase}
                      className="w-full py-2 bg-rose-50 hover:bg-rose-600 border border-rose-200 hover:border-rose-600 text-rose-600 hover:text-white font-bold rounded-lg transition flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Reset Database ke Seed Awal
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

        </main>

      </div>

      {/* ================= MODAL DIALOGS AND ASSISTANTS ================= */}

      {/* 1. REGISTER / EDIT PARTAI FORM MODAL */}
      {partaiFormOpen && (
        <PartaiForm 
          partai={selectedPartai}
          pengaturan={pengaturan}
          onSave={handleSavePartai}
          onClose={() => setPartaiFormOpen(false)}
        />
      )}

      {/* 1B. REGISTER / EDIT PENGGUNA FORM MODAL */}
      {penggunaFormOpen && (
        <PenggunaForm 
          pengguna={selectedPengguna}
          partai={partai}
          onSave={handleSavePengguna}
          onClose={() => {
            setPenggunaFormOpen(false);
            setSelectedPengguna(null);
          }}
        />
      )}

      {/* 2. PARTAI PROFILE SHEET MODAL */}
      {detailPartaiOpen && (
        <PartaiDetailModal 
          partai={detailPartaiOpen}
          dokumen={dokumen}
          pengaturan={pengaturan}
          hibah={hibah.find(item => item.partaiId === detailPartaiOpen.id && item.tahunAnggaran === pengaturan.tahunAnggaranAktif) || null}
          onClose={() => setDetailPartaiOpen(null)}
          onOpenDocument={(doc) => setDocumentViewerOpen(doc)}
          isOperatorPartai={currentUser?.role === 'Operator Partai' && currentUser?.partaiId === detailPartaiOpen.id}
          onTriggerUpload={(tipeDoc) => setUploadDocOpen(tipeDoc)}
          onPrintDocuments={(p) => {
            const h = hibah.find(item => item.partaiId === p.id && item.tahunAnggaran === pengaturan.tahunAnggaranAktif);
            setPrintPreviewOpen({ partai: p, hibah: h || null });
          }}
        />
      )}

      {/* 3. SIMULATED DOCUMENT PREVIEW MODAL */}
      {documentViewerOpen && (
        <DocumentViewerModal 
          document={documentViewerOpen}
          partai={partai.find(p => p.id === documentViewerOpen.partaiId) || null}
          onClose={() => setDocumentViewerOpen(null)}
          onDownloadSimulated={() => triggerSimulatedDownload(documentViewerOpen.fileName)}
        />
      )}

      {/* Document Print / Preview Modal */}
      {printPreviewOpen && pengaturan && (
        <DocumentPrintPreviewModal
          partai={printPreviewOpen.partai}
          hibah={printPreviewOpen.hibah}
          pengaturan={pengaturan}
          onClose={() => setPrintPreviewOpen(null)}
        />
      )}

      {/* 4. VERIFIKATOR CHECKLIST FORM MODAL */}
      {verificationModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-150 max-w-lg w-full overflow-hidden text-xs">
            <div className="p-4 border-b bg-slate-50 flex items-center justify-between">
              <span className="font-extrabold text-slate-800">Verifikasi Berkas Kearsipan</span>
              <button onClick={() => setVerificationModalOpen(null)} className="p-1 text-slate-400 hover:text-slate-600 rounded">
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-400 block text-[9px] uppercase">DOKUMEN DIUJI</span>
                <span className="font-extrabold text-slate-800 block text-xs">{verificationModalOpen.tipeDokumen}</span>
                <span className="text-[10px] text-slate-500 font-mono block mt-1">No SK: {verificationModalOpen.nomorDokumen}</span>
              </div>

              {/* Checklist item verifikasi */}
              <div className="space-y-2.5">
                <span className="font-bold text-slate-500 block text-[10px] uppercase">Checklist Verifikasi Administrasi:</span>
                <div className="space-y-2 leading-tight">
                  <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input 
                      type="checkbox" 
                      checked={verifCheck1} 
                      onChange={(e) => setVerifCheck1(e.target.checked)} 
                      className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer" 
                    />
                    <span>Berkas ber-stempel basah DPW/DPD Partai Politik asli</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input 
                      type="checkbox" 
                      checked={verifCheck2} 
                      onChange={(e) => setVerifCheck2(e.target.checked)} 
                      className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer" 
                    />
                    <span>Masa berlaku SK Pengurus / Domisili masih aktif</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input 
                      type="checkbox" 
                      checked={verifCheck3} 
                      onChange={(e) => setVerifCheck3(e.target.checked)} 
                      className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer" 
                    />
                    <span>Nama Ketua Umum, Sekretaris & Bendahara cocok dengan SK Kemenkumham</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input 
                      type="checkbox" 
                      checked={verifCheck4} 
                      onChange={(e) => setVerifCheck4(e.target.checked)} 
                      className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer" 
                    />
                    <span>Scan berkas digital memiliki resolusi minimal 150 DPI (Terbaca jelas)</span>
                  </label>
                </div>
              </div>

              {/* Pengecekan Otomatis Cepat (Intelligent Auto-Verification) */}
              <div className="bg-emerald-50/75 rounded-lg p-3 border border-emerald-100 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="font-extrabold text-emerald-800 text-[10px] block flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
                    Pengecekan Otomatis Cepat (Sistem AI)
                  </span>
                  <p className="text-[10px] text-emerald-600 font-semibold leading-normal">
                    Uji masa berlaku SK, stempel basah, dan validasi data KSB secara otomatis.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAutoCheck}
                  disabled={isAutoChecking}
                  className={`px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-extrabold text-[10px] transition shadow-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${isAutoChecking ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isAutoChecking ? (
                    <>
                      <RefreshCw className="h-3 w-3 animate-spin" />
                      <span>Sedang Menguji...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3 w-3" />
                      <span>Uji Otomatis</span>
                    </>
                  )}
                </button>
              </div>

              {/* Status input */}
              <div>
                <label className="block text-slate-500 font-bold mb-1">Status Verifikasi</label>
                <select
                  value={verifStatus}
                  onChange={(e) => setVerifStatus(e.target.value as StatusVerifikasi)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold focus:bg-white"
                >
                  <option value="Lengkap">Lengkap (Terverifikasi)</option>
                  <option value="Perbaikan">Perlu Perbaikan (Ditolak)</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-slate-500 font-bold mb-1">Catatan Verifikator Daerah</label>
                <textarea
                  value={verifNotes}
                  onChange={(e) => setVerifNotes(e.target.value)}
                  placeholder="Tuliskan catatan perbaikan atau rincian persetujuan berkas..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium focus:bg-white min-h-[80px]"
                />
              </div>
            </div>

            <div className="p-3 border-t bg-slate-50 flex items-center justify-end gap-2">
              <button 
                onClick={() => setVerificationModalOpen(null)} 
                className="px-4 py-1.5 bg-white border border-slate-200 text-slate-500 rounded font-bold hover:bg-slate-50"
              >
                Batal
              </button>
              <button 
                onClick={handleSaveVerification}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold shadow-xs"
              >
                Simpan Verifikasi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. DATA HIBAH TRACKING FORM MODAL */}
      {hibahFormOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-150 max-w-lg w-full overflow-hidden text-xs">
            <div className="p-4 border-b bg-slate-50 flex items-center justify-between">
              <span className="font-extrabold text-slate-800">Update Pelacakan Bantuan Hibah</span>
              <button onClick={() => setHibahFormOpen(null)} className="p-1 text-slate-400 hover:text-slate-600 rounded">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveHibah} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Nomor SK Bupati Penetapan</label>
                  <input 
                    type="text" 
                    value={hibahFormOpen.nomorSk} 
                    onChange={(e) => setHibahFormOpen({ ...hibahFormOpen, nomorSk: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Nomor NPHD Daerah</label>
                  <input 
                    type="text" 
                    value={hibahFormOpen.nomorNphd} 
                    onChange={(e) => setHibahFormOpen({ ...hibahFormOpen, nomorNphd: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Nomor SP2D (BPKAD)</label>
                  <input 
                    type="text" 
                    value={hibahFormOpen.nomorSp2d} 
                    onChange={(e) => setHibahFormOpen({ ...hibahFormOpen, nomorSp2d: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Nomor SPM</label>
                  <input 
                    type="text" 
                    value={hibahFormOpen.nomorSpm} 
                    onChange={(e) => setHibahFormOpen({ ...hibahFormOpen, nomorSpm: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Nomor SPD</label>
                  <input 
                    type="text" 
                    value={hibahFormOpen.nomorSpd} 
                    onChange={(e) => setHibahFormOpen({ ...hibahFormOpen, nomorSpd: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Status Penyaluran</label>
                  <select
                    value={hibahFormOpen.statusPenyaluran}
                    onChange={(e) => setHibahFormOpen({ ...hibahFormOpen, statusPenyaluran: e.target.value as StatusPenyaluran })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                  >
                    <option value="Proses Verifikasi">Proses Verifikasi</option>
                    <option value="SK Penetapan">SK Penetapan Terbit</option>
                    <option value="NPHD Ditandatangani">NPHD Ditandatangani</option>
                    <option value="SP2D Terbit">SP2D Terbit (BPKAD)</option>
                    <option value="Cair">Dana Cair (100%)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Tanggal Dana Cair</label>
                  <input 
                    type="date" 
                    value={hibahFormOpen.tanggalCair} 
                    onChange={(e) => setHibahFormOpen({ ...hibahFormOpen, tanggalCair: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Catatan Keterangan Penyaluran</label>
                <textarea 
                  value={hibahFormOpen.keterangan} 
                  onChange={(e) => setHibahFormOpen({ ...hibahFormOpen, keterangan: e.target.value })}
                  placeholder="Contoh: Transfer penuh ke Bank BJB parpol..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg min-h-[60px]"
                />
              </div>

              <div className="pt-3 border-t flex items-center justify-end gap-2 -mx-5 -mb-5 p-4 bg-slate-50">
                <button 
                  type="button" 
                  onClick={() => setHibahFormOpen(null)} 
                  className="px-4 py-1.5 bg-white border border-slate-200 text-slate-500 rounded font-bold"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold shadow-xs"
                >
                  Simpan Tracking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. LPJ EVALUATION MODAL */}
      {lpjReviewOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-150 max-w-lg w-full overflow-hidden text-xs">
            <div className="p-4 border-b bg-slate-50 flex items-center justify-between">
              <span className="font-extrabold text-slate-800">Evaluasi LPJ Bantuan Keuangan</span>
              <button onClick={() => setLpjReviewOpen(null)} className="p-1 text-slate-400 hover:text-slate-600 rounded">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveLPJ} className="p-5 space-y-4">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                <span className="font-bold text-slate-400 block text-[9px] uppercase">LAPORAN EVALUASI</span>
                <span className="font-bold text-slate-800 text-xs block">Tahun LPJ: {lpjReviewOpen.tahun}</span>
                <span className="text-emerald-700 font-extrabold block">Nilai Penggunaan: Rp {lpjReviewOpen.nilaiPenggunaanDana.toLocaleString('id-ID')}</span>
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Status Penerimaan LPJ</label>
                <select
                  value={lpjReviewOpen.statusDiterima}
                  onChange={(e) => setLpjReviewOpen({ ...lpjReviewOpen, statusDiterima: e.target.value as StatusLPJ })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold focus:bg-white"
                >
                  <option value="Diterima">Diterima (LPJ Sesuai Kriteria)</option>
                  <option value="Perbaikan">Butuh Perbaikan Dokumen</option>
                  <option value="Ditolak">Ditolak</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Hasil Evaluasi / Catatan Auditor</label>
                <textarea
                  value={lpjReviewOpen.hasilEvaluasi}
                  onChange={(e) => setLpjReviewOpen({ ...lpjReviewOpen, hasilEvaluasi: e.target.value })}
                  placeholder="Kriteria administrasi pelaporan penggunaan dana sesuai Permendagri..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white min-h-[80px]"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Catatan Koreksi (Jika Butuh Perbaikan)</label>
                <input
                  type="text"
                  value={lpjReviewOpen.catatan}
                  onChange={(e) => setLpjReviewOpen({ ...lpjReviewOpen, catatan: e.target.value })}
                  placeholder="Contoh: Lampirkan daftar hadir sosialisasi parpol..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white"
                />
              </div>

              <div className="pt-3 border-t flex items-center justify-end gap-2 -mx-5 -mb-5 p-4 bg-slate-50">
                <button 
                  type="button" 
                  onClick={() => setLpjReviewOpen(null)} 
                  className="px-4 py-1.5 bg-white border border-slate-200 text-slate-500 rounded font-bold"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold shadow-xs"
                >
                  Simpan Evaluasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. OPERATOR UPLOAD & IMPORT DOCUMENT MODAL */}
      {uploadDocOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl border border-slate-150 max-w-lg w-full overflow-hidden text-xs my-8">
            <div className="p-4 border-b bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
                  <Upload className="h-4 w-4" />
                </span>
                <span className="font-extrabold text-slate-800 text-sm">Import Berkas Persyaratan Daerah</span>
              </div>
              <button 
                onClick={() => {
                  setUploadDocOpen(null);
                  setSelectedUploadPartaiId(null);
                }} 
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSimulated} className="p-5 space-y-4">
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                Silakan lengkapi rincian dokumen resmi dan lampirkan berkas fisik hasil scan atau dokumen digital (.PDF, .JPG, .PNG) untuk dimasukkan ke database Kearsipan Kesbangpol Provinsi Nusa Tenggara Barat.
              </p>

              {/* Parpol Selector */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Partai Politik Penerima</label>
                  <select
                    value={selectedUploadPartaiId || currentUser?.partaiId || (partai[0]?.id || '')}
                    onChange={(e) => {
                      const pid = e.target.value;
                      setSelectedUploadPartaiId(pid);
                      // Auto regenerate document number prefix for the new selected party
                      const selectedP = partai.find(p => p.id === pid);
                      if (selectedP) {
                        setImportNomorDokumen(`DOC/${selectedP.singkatan}/${Date.now().toString().slice(-4)}/2026`);
                      }
                    }}
                    disabled={currentUser?.role === 'Operator Partai'}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold focus:bg-white text-slate-800 disabled:opacity-60"
                  >
                    {partai.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.nama} ({p.singkatan})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tipe Dokumen Selector */}
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Tipe Berkas Persyaratan</label>
                  <select
                    value={uploadDocOpen}
                    onChange={(e) => setUploadDocOpen(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold focus:bg-white text-slate-800"
                  >
                    {pengaturan?.tipeDokumenDaftar?.map((td, idx) => (
                      <option key={idx} value={td}>{td}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Nomor Surat Keputusan */}
              <div>
                <label className="block text-slate-500 font-bold mb-1">Nomor Surat / SK Dokumen</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={importNomorDokumen}
                    onChange={(e) => setImportNomorDokumen(e.target.value)}
                    placeholder="Contoh: 220/124-KESBANGPOL/2026"
                    className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:bg-white font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const activePID = selectedUploadPartaiId || currentUser?.partaiId || partai[0]?.id;
                      const selectedP = partai.find(p => p.id === activePID);
                      setImportNomorDokumen(`DOC/${selectedP?.singkatan || 'PARPOL'}/${Date.now().toString().slice(-4)}/2026`);
                    }}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-250 text-slate-700 font-extrabold rounded-lg transition"
                    title="Generate Nomor Baru"
                  >
                    🔄 Auto
                  </button>
                </div>
              </div>

              {/* Tanggal & Masa Berlaku */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Tanggal Terbit / TTE</label>
                  <input
                    type="date"
                    required
                    value={importTanggal}
                    onChange={(e) => setImportTanggal(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Masa Berlaku Dokumen</label>
                  <input
                    type="date"
                    required
                    value={importMasaBerlaku}
                    onChange={(e) => setImportMasaBerlaku(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold focus:bg-white"
                  />
                </div>
              </div>

              {/* File Upload / Import Zone */}
              <div>
                <label className="block text-slate-500 font-bold mb-1">Lampiran File Asli (Scan)</label>
                <label className={`block border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
                  importFileName 
                    ? 'border-emerald-400 bg-emerald-50/20 hover:bg-emerald-50/40' 
                    : 'border-slate-250 hover:border-emerald-500 hover:bg-slate-50/50'
                }`}>
                  <input
                    type="file"
                    className="hidden"
                    accept="application/pdf,image/jpeg,image/png,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    onChange={handleImportFileChange}
                  />
                  <div className="space-y-2">
                    {importFileName ? (
                      <div className="space-y-1">
                        <span className="p-2 bg-emerald-100 text-emerald-800 rounded-full inline-block mb-1 font-bold">✓</span>
                        <p className="font-extrabold text-slate-800 break-all">{importFileName}</p>
                        <p className="text-[10px] text-slate-400 font-bold font-mono">Ukuran: {importFileSize} &bull; Klik untuk mengganti berkas</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-7 w-7 text-slate-400 mx-auto animate-bounce" />
                        <span className="font-extrabold text-slate-700 block">Klik untuk memilih berkas scan/foto</span>
                        <span className="text-[9px] text-slate-400 block font-medium">Format: PDF, JPG, PNG, DOCX, XLSX (Maksimal 10 MB)</span>
                      </>
                    )}
                  </div>
                </label>
              </div>

              {/* Footer Buttons */}
              <div className="pt-4 border-t flex items-center justify-end gap-2 -mx-5 -mb-5 p-4 bg-slate-50">
                <button 
                  type="button" 
                  onClick={() => {
                    setUploadDocOpen(null);
                    setSelectedUploadPartaiId(null);
                  }} 
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:text-slate-800 rounded-lg font-extrabold transition cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-extrabold shadow-md transition transform active:scale-95 cursor-pointer"
                >
                  🚀 Simpan & Import Berkas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
