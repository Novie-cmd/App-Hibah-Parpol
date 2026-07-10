/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Partai {
  id: string;
  nama: string;
  nomorUrut: number;
  logo: string;
  singkatan: string;
  alamatKantor: string;
  provinsi: string;
  kabupatenKota: string;
  kecamatan: string;
  kelurahan: string;
  kodePos: string;
  nomorTelepon: string;
  email: string;
  website: string;
  statusAktif: boolean; // true = Aktif, false = Tidak Aktif
  tanggalBerdiri: string;
  nomorSkKemenkumham: string;
  tanggalSk: string;
  npwpPartai: string;
  
  // Rekening Bank
  namaBank: string;
  nomorRekening: string;
  atasNamaRekening: string;
  
  // Data Kepengurusan
  ketua: string;
  sekretaris: string;
  bendahara: string;
  masaJabatan: string;
  nomorHp: string;
  emailPengurus: string;
  fotoPengurus: string;
  skKepengurusan: string;
  masaBerlakuSk: string;
  
  // Data Perolehan Kursi
  tahunPemilu: string;
  jumlahSuaraSah: number;
  jumlahKursiDprd: number;
  daerahPemilihan: string;
  nilaiBantuanPerSuara: number;
  totalHakBantuan: number;

  // No. 5 Data Bantuan Hibah
  nomorNphd?: string;
  tanggalNphd?: string;
  nomorSptjm?: string;
  tanggalSptjm?: string;
  nomorBap?: string;
  tanggalBap?: string;
}

export type StatusVerifikasi = 'Lengkap' | 'Belum Lengkap' | 'Perbaikan' | 'Menunggu Verifikasi';

export interface DokumenHibah {
  id: string;
  partaiId: string;
  tipeDokumen: string; // Nama jenis dokumen dari master
  nomorDokumen: string;
  tanggal: string;
  masaBerlaku: string;
  statusVerifikasi: StatusVerifikasi;
  catatanVerifikator: string;
  fileName: string;
  fileType: 'pdf' | 'docx' | 'xlsx' | 'jpg';
  fileSize: string;
  version: number;
  updatedAt: string;
  uploadedBy: string;
  fileData?: string; // Base64 data of imported/uploaded file
  history?: DokumenRevision[];
}

export interface DokumenRevision {
  version: number;
  fileName: string;
  updatedAt: string;
  uploadedBy: string;
  catatan: string;
}

export type StatusPenyaluran = 'Belum Diproses' | 'Proses Verifikasi' | 'SK Penetapan' | 'NPHD Ditandatangani' | 'SP2D Terbit' | 'Cair';

export interface DataHibah {
  id: string;
  partaiId: string;
  tahunAnggaran: number;
  nomorSk: string;
  nomorNphd: string;
  nilaiBantuan: number;
  tanggalPenetapan: string;
  tanggalPenandatanganan: string;
  statusPenyaluran: StatusPenyaluran;
  tahapPenyaluran: string; // misal 'Tahap 1 (100%)' atau 'Tahap I'
  tanggalCair: string;
  nomorSp2d: string;
  nomorSpm: string;
  nomorSpd: string;
  keterangan: string;
}

export type StatusLPJ = 'Belum Mengunggah' | 'Draf' | 'Menunggu Verifikasi' | 'Diterima' | 'Ditolak' | 'Perbaikan';

export interface LaporanPertanggungjawaban {
  id: string;
  partaiId: string;
  hibahId: string;
  tahun: number;
  tanggalLaporan: string;
  nilaiPenggunaanDana: number;
  ringkasanKegiatan: string;
  fileNameLpj: string;
  hasilEvaluasi: string;
  statusDiterima: StatusLPJ;
  catatan: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  username: string;
  role: string;
  aktivitas: string; // Login, Logout, Tambah Data, Edit, Hapus, Upload, Download, Approval, Verifikasi
  objek: string; // misal 'Partai Golkar', 'LPJ 2026'
  detail: string;
  timestamp: string;
  ipAddress: string;
}

export interface Pengguna {
  id: string;
  username: string;
  namaLengkap: string;
  email: string;
  role: 'Super Admin' | 'Admin Kesbangpol' | 'Verifikator' | 'Operator Partai' | 'Pimpinan';
  status: 'Aktif' | 'Nonaktif';
  partaiId?: string; // Hanya diisi jika role 'Operator Partai'
  avatar: string;
}

export interface Notifikasi {
  id: string;
  partaiId?: string;
  partaiNama?: string;
  tipe: 'warning_kadaluarsa' | 'ditolak' | 'diterima' | 'cair' | 'lpj_warning' | 'pengingat';
  pesan: string;
  tanggal: string;
  dibaca: boolean;
}

export interface PengaturanSistem {
  tahunAnggaranAktif: number;
  nilaiBantuanPerSuara: number;
  namaInstansi: string;
  logoInstansi: string;
  alamatInstansi: string;
  kabupatenDaftar: string[];
  kecamatanDaftar: string[];
  tipeDokumenDaftar: string[];
}
