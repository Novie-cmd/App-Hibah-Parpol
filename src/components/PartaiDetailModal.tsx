/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  X, 
  Building2, 
  MapPin, 
  CreditCard, 
  Users2, 
  Vote, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  Globe, 
  Mail, 
  PhoneCall,
  Calendar,
  Lock,
  Printer
} from 'lucide-react';
import { Partai, DokumenHibah, PengaturanSistem, DataHibah } from '../types';

interface PartaiDetailModalProps {
  partai: Partai;
  dokumen: DokumenHibah[];
  pengaturan: PengaturanSistem;
  hibah: DataHibah | null;
  onClose: () => void;
  onOpenDocument: (doc: DokumenHibah) => void;
  onTriggerUpload: (tipeDoc: string) => void;
  isOperatorPartai: boolean;
  onPrintDocuments?: (partai: Partai) => void;
}

export default function PartaiDetailModal({
  partai,
  dokumen,
  pengaturan,
  hibah,
  onClose,
  onOpenDocument,
  onTriggerUpload,
  isOperatorPartai,
  onPrintDocuments
}: PartaiDetailModalProps) {
  const partyDocs = dokumen.filter(d => d.partaiId === partai.id);
  const tipeList = pengaturan.tipeDokumenDaftar;

  // Compute stats
  const totalUploaded = partyDocs.length;
  const totalLengkap = partyDocs.filter(d => d.statusVerifikasi === 'Lengkap').length;
  const totalPerbaikan = partyDocs.filter(d => d.statusVerifikasi === 'Perbaikan').length;
  const totalMenunggu = partyDocs.filter(d => d.statusVerifikasi === 'Menunggu Verifikasi').length;

  const formatIndonesianDate = (rawDate?: string) => {
    if (!rawDate) return 'Belum Diisi';
    try {
      return new Date(rawDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
      return rawDate;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-150 max-w-4xl w-full max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-150 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="text-3xl w-14 h-14 p-1 bg-white border border-slate-200 rounded-lg shadow-2xs flex items-center justify-center overflow-hidden shrink-0 select-none">
              {partai.logo && (partai.logo.startsWith('data:image') || partai.logo.startsWith('http') || partai.logo.startsWith('/')) ? (
                <img src={partai.logo} alt={partai.singkatan} className="w-12 h-12 object-contain rounded" referrerPolicy="no-referrer" />
              ) : (
                partai.logo || '🔴'
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-800 text-sm md:text-base leading-tight">{partai.nama}</h3>
                <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded ${partai.statusAktif ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                  {partai.statusAktif ? 'AKTIF' : 'NONAKTIF'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {partai.singkatan} &bull; Nomor Urut: {partai.nomorUrut} &bull; SK Kemenkumham: {partai.nomorSkKemenkumham || '-'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 space-y-6 text-xs">
          
          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/50">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Hak Hibah</span>
              <span className="text-sm font-extrabold text-emerald-700 block mt-1">
                Rp {partai.totalHakBantuan.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/50">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Kursi DPRD Kab</span>
              <span className="text-sm font-extrabold text-slate-700 block mt-1">
                {partai.jumlahKursiDprd} Kursi
              </span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/50">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Kelengkapan Berkas</span>
              <span className="text-sm font-extrabold text-slate-700 block mt-1">
                {totalLengkap} / {tipeList.length} Selesai
              </span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/50">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Status Administrasi</span>
              <span className="block mt-1">
                {totalLengkap === tipeList.length ? (
                  <span className="text-xs font-bold text-emerald-600">Lengkap (Terverifikasi)</span>
                ) : totalPerbaikan > 0 ? (
                  <span className="text-xs font-bold text-rose-500">Perlu Revisi ({totalPerbaikan})</span>
                ) : (
                  <span className="text-xs font-bold text-amber-500">Proses Berjalan</span>
                )}
              </span>
            </div>
          </div>

          {/* Three column split for data cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Col: Identitas & Bank */}
            <div className="md:col-span-2 space-y-6">
              
              {/* Profile Details Card */}
              <div className="bg-white rounded-xl border border-slate-150 p-4 space-y-3.5">
                <h4 className="text-xs font-extrabold uppercase text-slate-700 flex items-center gap-1.5 border-b border-slate-100 pb-1.5 select-none">
                  <Building2 className="h-4 w-4 text-emerald-600" />
                  Profil & Kontak Sekretariat
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 leading-relaxed">
                  <div className="flex gap-2">
                    <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-500 block text-[10px] uppercase">Alamat Kantor</span>
                      <span className="text-slate-700 font-medium">
                        {partai.alamatKantor}, Kec. {partai.kecamatan}, Kel. {partai.kelurahan}, {partai.kabupatenKota}, {partai.provinsi} {partai.kodePos}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Calendar className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-500 block text-[10px] uppercase">SK Kemenkumham & Tanggal Berdiri</span>
                      <span className="text-slate-700 font-medium block">SK: {partai.nomorSkKemenkumham || '-'}</span>
                      <span className="text-[11px] text-slate-400 font-medium">Sejak: {partai.tanggalBerdiri || '-'} &bull; SK Terbit: {partai.tanggalSk || '-'}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <PhoneCall className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-500 block text-[10px] uppercase">Kontak Resmi</span>
                      <span className="text-slate-700 font-medium block">Tlp: {partai.nomorTelepon || '-'}</span>
                      <span className="text-slate-700 font-medium block">Email: {partai.email || '-'}</span>
                      <span className="text-slate-700 font-medium block">Web: {partai.website || '-'}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Vote className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-500 block text-[10px] uppercase">NPWP Partai</span>
                      <span className="text-slate-700 font-mono font-bold block">{partai.npwpPartai || '-'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bank accounts card */}
              <div className="bg-white rounded-xl border border-slate-150 p-4 space-y-3.5">
                <h4 className="text-xs font-extrabold uppercase text-slate-700 flex items-center gap-1.5 border-b border-slate-100 pb-1.5 select-none">
                  <CreditCard className="h-4 w-4 text-emerald-600" />
                  Rekening Bank Penerima Hibah resmi
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200/50">
                  <div>
                    <span className="font-bold text-slate-400 block text-[9px] uppercase">NAMA BANK</span>
                    <span className="text-slate-800 font-bold">{partai.namaBank}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-400 block text-[9px] uppercase">NOMOR REKENING</span>
                    <span className="text-emerald-700 font-bold font-mono text-xs">{partai.nomorRekening}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-400 block text-[9px] uppercase">ATAS NAMA REKENING</span>
                    <span className="text-slate-800 font-bold uppercase">{partai.atasNamaRekening || '-'}</span>
                  </div>
                </div>
              </div>

              {/* No. 5 Data Bantuan Hibah Card */}
              <div className="bg-white rounded-xl border border-slate-150 p-4 space-y-3.5">
                <h4 className="text-xs font-extrabold uppercase text-slate-700 flex items-center gap-1.5 border-b border-slate-100 pb-1.5 select-none">
                  <FileText className="h-4 w-4 text-emerald-600" />
                  No. 5 Data Bantuan Hibah ({pengaturan.tahunAnggaranAktif})
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* NPHD Column */}
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/50 flex flex-col justify-between">
                    <div>
                      <span className="font-bold text-slate-400 block text-[8px] uppercase tracking-wider">1. Dokumen NPHD</span>
                      <span className="text-slate-800 font-extrabold text-[10px] block mt-1 leading-snug">
                        Nomor:<br />
                        <span className="font-mono text-slate-600 break-all">
                          {partai.nomorNphd || hibah?.nomorNphd || `900/${partai.nomorUrut + 20}/NPHD-KESBANGPOL/${pengaturan.tahunAnggaranAktif}`}
                        </span>
                      </span>
                    </div>
                    <span className="text-[9px] text-slate-500 block mt-2 border-t pt-1.5 border-slate-200/60">
                      Tanggal: <strong className="text-emerald-700 font-semibold">{formatIndonesianDate(partai.tanggalNphd || hibah?.tanggalPenandatanganan)}</strong>
                    </span>
                  </div>

                  {/* SPTJM Column */}
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/50 flex flex-col justify-between">
                    <div>
                      <span className="font-bold text-slate-400 block text-[8px] uppercase tracking-wider">2. Dokumen SPTJM</span>
                      <span className="text-slate-800 font-extrabold text-[10px] block mt-1 leading-snug">
                        Nomor:<br />
                        <span className="font-mono text-slate-600 break-all">
                          {partai.nomorSptjm || `${partai.nomorUrut + 10}/SPTJM/${partai.singkatan}/${pengaturan.tahunAnggaranAktif}`}
                        </span>
                      </span>
                    </div>
                    <span className="text-[9px] text-slate-500 block mt-2 border-t pt-1.5 border-slate-200/60">
                      Tanggal: <strong className="text-emerald-700 font-semibold">{formatIndonesianDate(partai.tanggalSptjm)}</strong>
                    </span>
                  </div>

                  {/* BAP Column */}
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/50 flex flex-col justify-between">
                    <div>
                      <span className="font-bold text-slate-400 block text-[8px] uppercase tracking-wider">3. Dokumen BAP</span>
                      <span className="text-slate-800 font-extrabold text-[10px] block mt-1 leading-snug">
                        Nomor:<br />
                        <span className="font-mono text-slate-600 break-all">
                          {partai.nomorBap || `900/${partai.nomorUrut + 10}/BAP-KESBANGPOL/${pengaturan.tahunAnggaranAktif}`}
                        </span>
                      </span>
                    </div>
                    <span className="text-[9px] text-slate-500 block mt-2 border-t pt-1.5 border-slate-200/60">
                      Tanggal: <strong className="text-emerald-700 font-semibold">{formatIndonesianDate(partai.tanggalBap)}</strong>
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Col: Kepengurusan */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-150 p-4 space-y-3.5 h-full">
                <h4 className="text-xs font-extrabold uppercase text-slate-700 flex items-center gap-1.5 border-b border-slate-100 pb-1.5 select-none">
                  <Users2 className="h-4 w-4 text-emerald-600" />
                  Kepengurusan (KKS)
                </h4>

                {/* Avatar header */}
                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200/50">
                  <img 
                    src={partai.fotoPengurus || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80'} 
                    alt={partai.ketua} 
                    className="w-12 h-12 rounded-full border border-slate-200 object-cover shadow-2xs"
                  />
                  <div>
                    <span className="text-[10px] font-extrabold text-emerald-600 uppercase block">Ketua DPW/DPD</span>
                    <span className="text-slate-800 font-bold leading-tight block">{partai.ketua}</span>
                  </div>
                </div>

                <div className="space-y-2.5 pt-1">
                  <div>
                    <span className="font-bold text-slate-400 block text-[9px] uppercase">SEKRETARIS</span>
                    <span className="text-slate-700 font-semibold">{partai.sekretaris}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-400 block text-[9px] uppercase">BENDAHARA</span>
                    <span className="text-slate-700 font-semibold">{partai.bendahara}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-400 block text-[9px] uppercase">PERIODE BAKTI</span>
                    <span className="text-slate-700 font-bold">{partai.masaJabatan || '2024 - 2029'}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-400 block text-[9px] uppercase">NOMOR HP INTEL</span>
                    <span className="text-slate-700 font-mono font-semibold">{partai.nomorHp || '-'}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-400 block text-[9px] uppercase">SK KEPENGURUSAN</span>
                    <span className="text-slate-700 font-medium block text-[10px]">{partai.skKepengurusan || '-'}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Masa Berlaku: <strong className="text-rose-600 font-semibold">{partai.masaBerlakuSk || '-'}</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: LIVE COMPLIANCE CHECKLIST OF 16 DOCUMENTS */}
          <div className="bg-white rounded-xl border border-slate-150 p-5 space-y-4">
            <div>
              <h4 className="text-xs font-extrabold uppercase text-slate-700 flex items-center gap-1.5 border-b border-slate-100 pb-1.5 select-none">
                <FileText className="h-4 w-4 text-emerald-600" />
                Matriks Pemenuhan 16 Dokumen Persyaratan Hibah
              </h4>
              <p className="text-[10px] text-slate-400 mt-1">Pemeriksaan administratif kearsipan Kesbangpol untuk penyaluran dana hibah APBD tahun anggaran berjalan.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {tipeList.map((tipe, idx) => {
                const doc = partyDocs.find(d => d.tipeDokumen === tipe);
                return (
                  <div 
                    key={idx} 
                    className={`p-3 rounded-lg border transition flex items-center justify-between ${
                      doc 
                        ? (doc.statusVerifikasi === 'Lengkap' ? 'bg-emerald-50/40 border-emerald-100 hover:bg-emerald-50' : 
                           doc.statusVerifikasi === 'Perbaikan' ? 'bg-rose-50/40 border-rose-100 hover:bg-rose-50' : 
                           'bg-amber-50/40 border-amber-100 hover:bg-amber-50')
                        : 'bg-slate-50/50 border-slate-200/60'
                    }`}
                  >
                    <div className="space-y-0.5 max-w-[70%]">
                      <span className="font-semibold text-slate-800 text-[11px] block truncate" title={tipe}>
                        {idx + 1}. {tipe}
                      </span>
                      {doc ? (
                        <div className="flex flex-col gap-0.5 font-mono text-[9px] text-slate-400">
                          <span className="truncate">No: {doc.nomorDokumen}</span>
                          <span>Tanggal: {doc.tanggal} &bull; v{doc.version}</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-medium italic block">Berkas Kosong (Belum Diunggah)</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {doc ? (
                        <>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                            doc.statusVerifikasi === 'Lengkap' ? 'bg-emerald-100 text-emerald-800' :
                            doc.statusVerifikasi === 'Perbaikan' ? 'bg-rose-100 text-rose-800' :
                            doc.statusVerifikasi === 'Menunggu Verifikasi' ? 'bg-blue-150 text-blue-800' : 'bg-slate-100 text-slate-800'
                          }`}>
                            {doc.statusVerifikasi}
                          </span>
                          <button 
                            onClick={() => onOpenDocument(doc)}
                            className="p-1 hover:bg-slate-200/80 text-slate-500 hover:text-slate-800 rounded transition"
                            title="Preview Dokumen"
                          >
                            <FileText className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="text-[9px] font-bold bg-slate-200 text-slate-500 px-2 py-0.5 rounded">
                            BLM ADA
                          </span>
                          {isOperatorPartai && (
                            <button
                              onClick={() => onTriggerUpload(tipe)}
                              className="px-2 py-1 bg-emerald-650 hover:bg-emerald-700 text-white rounded text-[9px] font-bold shadow-2xs transition flex items-center gap-1 shrink-0"
                            >
                              📥 Import
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-150 flex items-center justify-between bg-slate-50">
          <div>
            {onPrintDocuments && (
              <button
                onClick={() => onPrintDocuments(partai)}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition shadow-2xs flex items-center gap-1.5 cursor-pointer text-xs"
              >
                <Printer className="h-4 w-4" />
                Cetak Dokumen Master (NPHD, SPTJM, BAP, Kuitansi)
              </button>
            )}
          </div>
          <button 
            onClick={onClose} 
            className="px-4 py-1.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-lg hover:bg-slate-50 transition shadow-2xs cursor-pointer"
          >
            Tutup Lembar Profil
          </button>
        </div>

      </div>
    </div>
  );
}
