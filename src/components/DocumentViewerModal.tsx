/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  History, 
  ShieldCheck, 
  FileCheck,
  FileText,
  Clock,
  User,
  ExternalLink
} from 'lucide-react';
import { DokumenHibah, Partai } from '../types';

interface DocumentViewerModalProps {
  document: DokumenHibah;
  partai: Partai | null;
  onClose: () => void;
  onDownloadSimulated: () => void;
}

export default function DocumentViewerModal({
  document,
  partai,
  onClose,
  onDownloadSimulated
}: DocumentViewerModalProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'revisions'>('preview');
  const [viewType, setViewType] = useState<'system' | 'imported'>(document.fileData ? 'imported' : 'system');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-150 max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-150 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm md:text-base">{document.tipeDokumen}</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Nomor: <code className="bg-slate-100 text-slate-700 px-1 py-0.5 rounded font-mono text-[10px]">{document.nomorDokumen}</code> &bull; Partai: {partai?.nama} ({partai?.singkatan})
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-100 bg-slate-50/50 justify-between items-center pr-4">
          <div className="flex">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-5 py-3 text-xs font-bold border-r border-slate-100 flex items-center gap-1.5 transition ${
                activeTab === 'preview' ? 'bg-white text-emerald-700 border-b-2 border-b-emerald-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              Arsip Lembaran Negara
            </button>
            <button
              onClick={() => setActiveTab('revisions')}
              className={`px-5 py-3 text-xs font-bold border-r border-slate-100 flex items-center gap-1.5 transition ${
                activeTab === 'revisions' ? 'bg-white text-emerald-700 border-b-2 border-b-emerald-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <History className="h-4 w-4" />
              Riwayat Revisi ({document.history?.length || 1})
            </button>
          </div>

          {/* Toggle View Type if fileData is available */}
          {document.fileData && activeTab === 'preview' && (
            <div className="flex bg-slate-100 p-1 rounded-lg gap-1 border border-slate-200">
              <button
                onClick={() => setViewType('imported')}
                className={`px-3 py-1 rounded text-[10px] font-extrabold transition flex items-center gap-1 ${
                  viewType === 'imported'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                📁 Berkas Impor
              </button>
              <button
                onClick={() => setViewType('system')}
                className={`px-3 py-1 rounded text-[10px] font-extrabold transition flex items-center gap-1 ${
                  viewType === 'system'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                🏛️ Salinan Sistem
              </button>
            </div>
          )}
        </div>

        {/* Modal content body */}
        <div className="flex-1 p-6 overflow-y-auto min-h-[400px] bg-slate-100">
          
          {/* TAB 1: PREVIEW */}
          {activeTab === 'preview' && (
            viewType === 'imported' && document.fileData ? (
              <div className="bg-white max-w-2xl mx-auto p-6 shadow-lg rounded-sm border border-slate-200 flex flex-col justify-between text-xs relative select-none">
                <div className="w-full border-b pb-2.5 mb-4 flex justify-between items-center text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                  <span>Berkas Dokumen Parpol yang Diimpor</span>
                  <span className="text-emerald-700 bg-emerald-50 border border-emerald-150 px-2 py-0.5 rounded text-[9px]">Original ({document.fileType.toUpperCase()})</span>
                </div>
                
                <div className="w-full flex justify-center items-center py-6 bg-slate-50 rounded-lg border border-slate-200/50 min-h-[420px]">
                  {document.fileData.startsWith('data:image') ? (
                    <img src={document.fileData} alt={document.tipeDokumen} className="max-w-full max-h-[580px] object-contain rounded-md shadow-xs border border-slate-150" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="text-center space-y-3.5 p-10 max-w-md">
                      <div className="p-4 bg-emerald-50 rounded-full text-emerald-600 w-16 h-16 flex items-center justify-center mx-auto shadow-sm border border-emerald-100">
                        <FileText className="h-8 w-8" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-extrabold text-slate-700 text-sm">{document.fileName}</p>
                        <p className="text-[10px] text-slate-400 font-bold font-mono">Ukuran Berkas: {document.fileSize} &bull; Tipe: {document.fileType.toUpperCase()}</p>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-medium">Dokumen digital berhasil diimpor ke server kearsipan daerah. Anda dapat mengunduh berkas asli di bawah ini.</p>
                      <a 
                        href={document.fileData} 
                        download={document.fileName} 
                        className="inline-flex items-center gap-1.5 px-4.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-lg text-xs shadow-md transition transform active:scale-95 cursor-pointer"
                      >
                        <Download className="h-4 w-4" />
                        Unduh Berkas Asli
                      </a>
                    </div>
                  )}
                </div>
                
                <div className="w-full border-t pt-2.5 mt-5 text-[9px] text-slate-400 font-mono flex justify-between">
                  <span>Diimpor oleh: {document.uploadedBy}</span>
                  <span>Tanggal Unggah: {document.tanggal}</span>
                </div>
              </div>
            ) : (
              <div className="bg-white max-w-2xl mx-auto p-10 shadow-lg rounded-sm border border-slate-200 aspect-[1/1.4] flex flex-col justify-between text-xs relative select-none">
                
                {/* official seal watermark in background */}
                <div className="absolute inset-0 flex items-center justify-center opacity-3 pointer-events-none">
                  <span className="text-9xl">🇮🇩</span>
                </div>

              {/* Official governmental letterhead */}
              <div className="text-center border-b-2 border-slate-800 pb-3">
                <span className="text-xl">🏛️</span>
                <h4 className="text-[13px] font-extrabold tracking-wide uppercase mt-1 leading-none text-slate-800">PEMERINTAH KABUPATEN BEKASI</h4>
                <h5 className="text-[11px] font-bold tracking-wide uppercase mt-0.5 leading-none text-slate-700">BADAN KESATUAN BANGSA DAN POLITIK</h5>
                <p className="text-[8px] text-slate-400 mt-1 font-mono font-medium">Komp. Perkantoran Pemda No. 1, Sukamahi, Cikarang Pusat &bull; kesbangpol@bekasikab.go.id</p>
              </div>

              {/* Document Meta / Code */}
              <div className="mt-6 space-y-4">
                <div className="text-center">
                  <h6 className="font-extrabold underline uppercase text-slate-800 tracking-wide text-xs">{document.tipeDokumen.toUpperCase()}</h6>
                  <p className="font-mono text-[9px] text-slate-500 mt-1">Nomor SK: {document.nomorDokumen}</p>
                </div>

                {/* Substantive content */}
                <div className="space-y-3 text-slate-700 leading-relaxed text-[11px]">
                  <p>
                    Bahwa berdasarkan ketentuan Peraturan Gubernur tentang Tata Cara Penganggaran, Pelaksanaan, Penatausahaan, Pertanggungjawaban dan Pelaporan serta Monitoring Penerimaan Hibah Bantuan Keuangan Partai Politik APBD Provinsi Nusa Tenggara Barat, yang bertanda tangan di bawah ini menerangkan bahwa:
                  </p>

                  <table className="w-full border-0 my-3 ml-2 font-medium">
                    <tbody>
                      <tr>
                        <td className="w-24 font-bold py-1 text-slate-500">Nama Organisasi</td>
                        <td className="w-4">:</td>
                        <td className="font-bold text-slate-800">{partai?.nama} ({partai?.singkatan})</td>
                      </tr>
                      <tr>
                        <td className="font-bold py-1 text-slate-500">Alamat Kantor</td>
                        <td>:</td>
                        <td>{partai?.alamatKantor}</td>
                      </tr>
                      <tr>
                        <td className="font-bold py-1 text-slate-500">Ketua Umum / DPC</td>
                        <td>:</td>
                        <td className="font-bold">{partai?.ketua}</td>
                      </tr>
                      <tr>
                        <td className="font-bold py-1 text-slate-500">Rekening Bank</td>
                        <td>:</td>
                        <td>{partai?.namaBank} &bull; No: <span className="font-mono font-bold text-emerald-700">{partai?.nomorRekening}</span></td>
                      </tr>
                    </tbody>
                  </table>

                  <p>
                    Dinyatakan telah menyerahkan berkas administrasi dan dokumen digital yang diperlukan untuk keperluan verifikasi dan pencairan hibah keuangan tahun anggaran berjalan. Hasil pemeriksaan kelengkapan berkas fisik menyatakan berkas di atas memenuhi ketentuan dan kriteria kearsipan daerah.
                  </p>

                  <p className="italic bg-slate-50 p-2 border border-slate-200/60 rounded text-slate-500 text-[10px]">
                    Catatan Verifikator: "{document.catatanVerifikator || 'Seluruh berkas sesuai dengan ketentuan perundang-undangan dan dinyatakan absah.'}"
                  </p>
                </div>
              </div>

              {/* Signatures & Seal */}
              <div className="mt-8 flex justify-end">
                <div className="text-center w-52 text-[10px] relative">
                  <p>Cikarang Pusat, {document.tanggal}</p>
                  <p className="font-bold uppercase mt-1">Verifikator Kearsipan,</p>
                  
                  {/* Simulated government seal stamp */}
                  {document.statusVerifikasi === 'Lengkap' && (
                    <div className="absolute left-6 top-6 w-20 h-20 rounded-full border-4 border-double border-emerald-500/30 flex items-center justify-center font-bold font-sans text-emerald-600/30 text-[9px] uppercase tracking-wider rotate-[-15deg] select-none pointer-events-none">
                      KESBANGPOL
                    </div>
                  )}

                  <div className="h-12"></div>
                  <p className="font-bold underline">{document.uploadedBy.split(' (')[0]}</p>
                  <p className="text-slate-400 font-mono text-[8px]">NIP. 19881112 201010 1 001</p>
                </div>
              </div>

              {/* Verification Footer Bar */}
              <div className="border-t border-slate-200 pt-3 mt-6 flex justify-between items-center text-[9px] text-slate-400 font-mono">
                <span>Versi Kearsipan: Digital v{document.version}</span>
                <span className="flex items-center gap-1 text-emerald-600 font-bold">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  TERVERIFIKASI SISTEM DIGITAL
                </span>
              </div>
            </div>
          )
        )}

          {/* TAB 2: REVISION HISTORY */}
          {activeTab === 'revisions' && (
            <div className="max-w-md mx-auto bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2 border-b pb-2">
                <History className="h-4 w-4 text-emerald-600" />
                Daftar Riwayat Perubahan File
              </h4>

              <div className="space-y-3">
                {/* Active Version */}
                <div className="flex gap-3 relative pb-2 border-l-2 border-emerald-500 pl-4">
                  <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-xs"></div>
                  <div className="space-y-1">
                    <span className="bg-emerald-100 text-emerald-800 font-extrabold text-[8px] px-1.5 py-0.5 rounded uppercase">Versi {document.version} (Aktif)</span>
                    <p className="text-xs font-bold text-slate-700 mt-1">{document.fileName}</p>
                    <div className="flex items-center gap-2 font-mono text-[9px] text-slate-400">
                      <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" /> {new Date(document.updatedAt).toLocaleDateString('id-ID')}</span>
                      <span className="flex items-center gap-0.5"><User className="h-3 w-3" /> {document.uploadedBy}</span>
                    </div>
                  </div>
                </div>

                {/* Simulated Previous Versions */}
                {(document.history || []).map((rev, i) => (
                  <div key={i} className="flex gap-3 relative pb-2 border-l-2 border-slate-200 pl-4">
                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-slate-300 border-2 border-white shadow-xs"></div>
                    <div className="space-y-1">
                      <span className="bg-slate-100 text-slate-600 font-bold text-[8px] px-1.5 py-0.5 rounded">Versi {rev.version}</span>
                      <p className="text-[11px] font-semibold text-slate-500 mt-1">{rev.fileName}</p>
                      <p className="text-[10px] text-slate-400 bg-slate-50 p-1.5 rounded">{rev.catatan}</p>
                      <div className="flex items-center gap-2 font-mono text-[9px] text-slate-400">
                        <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" /> {new Date(rev.updatedAt).toLocaleDateString('id-ID')}</span>
                        <span className="flex items-center gap-0.5"><User className="h-3 w-3" /> {rev.uploadedBy}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Initializing node */}
                <div className="flex gap-3 relative pl-4">
                  <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-slate-200 border-2 border-white shadow-xs"></div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 font-mono">NODE BERKAS BERHASIL DIBUAT</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">Sistem kearsipan Kesbangpol melacak dan menyimpan metadata SHA256 dokumen.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-150 bg-slate-50 flex items-center justify-between no-print">
          <span className="text-[10px] font-mono text-slate-400">
            SHA256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
          </span>
          <div className="flex gap-2">
            <button 
              onClick={() => window.print()}
              className="px-4 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-lg shadow-2xs transition flex items-center gap-1.5"
            >
              <Printer className="h-4 w-4" />
              Cetak Dokumen
            </button>
            <button 
              onClick={onDownloadSimulated}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs transition flex items-center gap-1.5"
            >
              <Download className="h-4 w-4" />
              Unduh Dokumen
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
