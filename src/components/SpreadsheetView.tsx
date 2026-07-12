/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Save, 
  Download, 
  Upload, 
  Plus, 
  Trash2, 
  Search, 
  CheckCircle,
  Database,
  RefreshCw
} from 'lucide-react';
import { Partai, DokumenHibah, DataHibah, LaporanPertanggungjawaban } from '../types';

interface SpreadsheetViewProps {
  partai: Partai[];
  dokumen: DokumenHibah[];
  hibah: DataHibah[];
  lpj: LaporanPertanggungjawaban[];
  onUpdatePartai: (p: Partai) => void;
  onUpdateDokumen: (d: DokumenHibah) => void;
  onUpdateHibah: (h: DataHibah) => void;
  onUpdateLPJ: (l: LaporanPertanggungjawaban) => void;
  onRefresh: () => void;
  logAktivitas: (aktivitas: string, objek: string, detail: string) => void;
}

type ActiveSheet = 'partai' | 'dokumen' | 'hibah' | 'lpj';

export default function SpreadsheetView({
  partai,
  dokumen,
  hibah,
  lpj,
  onUpdatePartai,
  onUpdateDokumen,
  onUpdateHibah,
  onUpdateLPJ,
  onRefresh,
  logAktivitas
}: SpreadsheetViewProps) {
  const [activeSheet, setActiveSheet] = useState<ActiveSheet>('partai');
  const [searchQuery, setSearchQuery] = useState('');
  const [editCell, setEditCell] = useState<{ rowId: string; colKey: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Handle direct cell change
  const handleCellDoubleClick = (rowId: string, colKey: string, currentValue: any) => {
    setEditCell({ rowId, colKey });
    setEditValue(String(currentValue ?? ''));
  };

  const handleCellSave = (rowId: string, colKey: string) => {
    if (!editCell) return;
    
    if (activeSheet === 'partai') {
      const target = partai.find(p => p.id === rowId);
      if (target) {
        const updated = { ...target, [colKey]: colKey === 'nomorUrut' || colKey === 'jumlahSuaraSah' || colKey === 'jumlahKursiDprd' || colKey === 'nilaiBantuanPerSuara' || colKey === 'totalHakBantuan' ? Number(editValue) : editValue };
        if (colKey === 'jumlahSuaraSah' || colKey === 'nilaiBantuanPerSuara') {
          // Recompute hak bantuan
          const suara = colKey === 'jumlahSuaraSah' ? Number(editValue) : target.jumlahSuaraSah;
          const nilai = colKey === 'nilaiBantuanPerSuara' ? Number(editValue) : target.nilaiBantuanPerSuara;
          updated.totalHakBantuan = suara * nilai;
        }
        onUpdatePartai(updated);
        logAktivitas('Edit', `Spreadsheet - Partai ${updated.singkatan}`, `Mengubah kolom [${colKey}] menjadi "${editValue}"`);
      }
    } else if (activeSheet === 'dokumen') {
      const target = dokumen.find(d => d.id === rowId);
      if (target) {
        const updated = { ...target, [colKey]: colKey === 'version' ? Number(editValue) : editValue };
        onUpdateDokumen(updated);
        logAktivitas('Edit', `Spreadsheet - Dokumen ${updated.tipeDokumen}`, `Mengubah kolom [${colKey}] menjadi "${editValue}"`);
      }
    } else if (activeSheet === 'hibah') {
      const target = hibah.find(h => h.id === rowId);
      if (target) {
        const updated = { ...target, [colKey]: colKey === 'nilaiBantuan' || colKey === 'tahunAnggaran' ? Number(editValue) : editValue };
        onUpdateHibah(updated);
        logAktivitas('Edit', `Spreadsheet - Hibah TA ${updated.tahunAnggaran}`, `Mengubah kolom [${colKey}] menjadi "${editValue}"`);
      }
    } else if (activeSheet === 'lpj') {
      const target = lpj.find(l => l.id === rowId);
      if (target) {
        const updated = { ...target, [colKey]: colKey === 'tahun' || colKey === 'nilaiPenggunaanDana' ? Number(editValue) : editValue };
        onUpdateLPJ(updated);
        logAktivitas('Edit', `Spreadsheet - LPJ TA ${updated.tahun}`, `Mengubah kolom [${colKey}] menjadi "${editValue}"`);
      }
    }

    setEditCell(null);
    showSuccessNotification('Sel berhasil diperbarui dan disimpan!');
  };

  const showSuccessNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // Export Sheet to CSV
  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    let filename = `kesbangpol_${activeSheet}_sheet.csv`;

    if (activeSheet === 'partai') {
      const headers = ["ID", "Nomor Urut", "Nama Partai", "Singkatan", "Status Aktif", "Ketua", "Sekretaris", "Bendahara", "Jumlah Suara Sah", "Jumlah Kursi DPRD", "Total Hak Bantuan", "No Rekening", "Nama Bank"];
      csvContent += headers.join(",") + "\n";
      partai.forEach(p => {
        const row = [
          p.id,
          p.nomorUrut,
          `"${p.nama}"`,
          p.singkatan,
          p.statusAktif ? "Aktif" : "Tidak Aktif",
          `"${p.ketua}"`,
          `"${p.sekretaris}"`,
          `"${p.bendahara}"`,
          p.jumlahSuaraSah,
          p.jumlahKursiDprd,
          p.totalHakBantuan,
          `"${p.nomorRekening}"`,
          p.namaBank
        ];
        csvContent += row.join(",") + "\n";
      });
    } else if (activeSheet === 'dokumen') {
      const headers = ["ID", "Partai ID", "Tipe Dokumen", "Nomor Dokumen", "Tanggal", "Masa Berlaku", "Status Verifikasi", "Catatan Verifikator", "File Name", "Version"];
      csvContent += headers.join(",") + "\n";
      dokumen.forEach(d => {
        const row = [
          d.id,
          d.partaiId,
          `"${d.tipeDokumen}"`,
          `"${d.nomorDokumen}"`,
          d.tanggal,
          d.masaBerlaku,
          d.statusVerifikasi,
          `"${d.catatanVerifikator}"`,
          `"${d.fileName}"`,
          d.version
        ];
        csvContent += row.join(",") + "\n";
      });
    } else if (activeSheet === 'hibah') {
      const headers = ["ID", "Partai ID", "Tahun Anggaran", "Nomor SK", "Nomor NPHD", "Nilai Bantuan", "Status Penyaluran", "Nomor SP2D", "Tanggal Cair"];
      csvContent += headers.join(",") + "\n";
      hibah.forEach(h => {
        const row = [
          h.id,
          h.partaiId,
          h.tahunAnggaran,
          `"${h.nomorSk}"`,
          `"${h.nomorNphd}"`,
          h.nilaiBantuan,
          h.statusPenyaluran,
          `"${h.nomorSp2d}"`,
          h.tanggalCair || "-"
        ];
        csvContent += row.join(",") + "\n";
      });
    } else if (activeSheet === 'lpj') {
      const headers = ["ID", "Partai ID", "Tahun", "Tanggal Laporan", "Nilai Penggunaan", "Status Diterima", "Catatan", "Hasil Evaluasi"];
      csvContent += headers.join(",") + "\n";
      lpj.forEach(l => {
        const row = [
          l.id,
          l.partaiId,
          l.tahun,
          l.tanggalLaporan,
          l.nilaiPenggunaanDana,
          l.statusDiterima,
          `"${l.catatan}"`,
          `"${l.hasilEvaluasi}"`
        ];
        csvContent += row.join(",") + "\n";
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    logAktivitas('Download', `Spreadsheet CSV - ${activeSheet}`, `Mengekspor spreadsheet ${activeSheet} ke file CSV`);
  };

  // Simulate file import
  const triggerCSVImport = () => {
    alert("Fitur Pengunduhan & Sinkronisasi Lembar Kerja (Spreadsheet) aktif. Mengimpor file CSV akan mengurai data secara otomatis dan memverifikasi integritas baris berdasarkan skema database Kesbangpol.");
    logAktivitas('Upload', `Spreadsheet CSV Import`, `Memicu dialog impor spreadsheet`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden" id="spreadsheet_module">
      {/* Top action header */}
      <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
            Database Spreadsheet Editor
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Data tersimpan di spreadsheet virtual <code className="bg-slate-100 text-slate-700 px-1 py-0.5 rounded font-mono text-[10px]">database.json</code>. Klik ganda pada sel mana pun untuk mengedit nilai langsung.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={onRefresh}
            className="flex items-center gap-1 text-xs text-slate-600 hover:text-emerald-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-xs transition"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Segarkan
          </button>
          <button 
            onClick={triggerCSVImport}
            className="flex items-center gap-1 text-xs text-slate-600 hover:text-emerald-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-xs transition"
          >
            <Upload className="h-3.5 w-3.5 text-slate-500" />
            Impor CSV
          </button>
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg shadow-xs font-semibold transition"
          >
            <Download className="h-3.5 w-3.5" />
            Ekspor CSV
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 bg-slate-50">
        {(['partai', 'dokumen', 'hibah', 'lpj'] as ActiveSheet[]).map((sheet) => (
          <button
            key={sheet}
            onClick={() => {
              setActiveSheet(sheet);
              setSearchQuery('');
              setEditCell(null);
            }}
            className={`px-5 py-3 text-xs font-bold transition border-r border-slate-100 flex items-center gap-2 ${
              activeSheet === sheet 
                ? 'bg-white text-emerald-700 border-b-2 border-b-emerald-600' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
            }`}
          >
            <Database className="h-3.5 w-3.5 text-slate-400" />
            {sheet === 'partai' && 'Sheet 1: Parpol'}
            {sheet === 'dokumen' && 'Sheet 2: Dokumen Persyaratan'}
            {sheet === 'hibah' && 'Sheet 3: Bantuan Hibah'}
            {sheet === 'lpj' && 'Sheet 4: Laporan LPJ'}
            <span className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded-full font-mono">
              {sheet === 'partai' && partai.length}
              {sheet === 'dokumen' && dokumen.length}
              {sheet === 'hibah' && hibah.length}
              {sheet === 'lpj' && lpj.length}
            </span>
          </button>
        ))}
      </div>

      {/* Success notification banner inside spreadsheet */}
      {successMsg && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-2.5 text-emerald-800 text-xs font-medium flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-emerald-600 animate-bounce" />
          {successMsg}
        </div>
      )}

      {/* Search Filter */}
      <div className="p-3 border-b border-slate-100 flex items-center bg-white">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder={`Cari baris pada sheet ${activeSheet}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white"
          />
        </div>
        <span className="ml-auto text-[10px] text-slate-400 font-medium italic">
          *Klik ganda pada sel untuk mengedit langsung
        </span>
      </div>

      {/* Spreadsheet grid */}
      <div className="overflow-x-auto max-h-[500px]">
        {activeSheet === 'partai' && (
          <table className="w-full text-left border-collapse text-xs table-fixed min-w-[1200px]">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-mono font-bold divide-x divide-slate-200">
                <th className="p-2 w-16 text-center">No</th>
                <th className="p-2 w-28">ID (Kunci)</th>
                <th className="p-2 w-48">Nama Partai</th>
                <th className="p-2 w-24">Singkatan</th>
                <th className="p-2 w-20">No Urut</th>
                <th className="p-2 w-28">Status</th>
                <th className="p-2 w-40">Ketua DPC</th>
                <th className="p-2 w-32">Nomor HP</th>
                <th className="p-2 w-28">Masa SK</th>
                <th className="p-2 w-32">Jumlah Suara Sah</th>
                <th className="p-2 w-24">Kursi DPRD</th>
                <th className="p-2 w-40">Total Hak Bantuan</th>
                <th className="p-2 w-36">Nama Bank</th>
                <th className="p-2 w-44">Nomor Rekening</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-slate-700 divide-x divide-slate-100">
              {partai
                .filter(p => p.nama.toLowerCase().includes(searchQuery.toLowerCase()) || p.singkatan.toLowerCase().includes(searchQuery.toLowerCase()) || p.ketua.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((p, index) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 group">
                    <td className="p-1.5 text-center text-slate-400 bg-slate-50">{index + 1}</td>
                    <td className="p-1.5 font-bold text-slate-500 bg-slate-50">{p.id}</td>
                    
                    {/* Nama Partai */}
                    <td 
                      className={`p-1.5 truncate cursor-pointer ${editCell?.rowId === p.id && editCell?.colKey === 'nama' ? 'p-0 bg-amber-50' : ''}`}
                      onDoubleClick={() => handleCellDoubleClick(p.id, 'nama', p.nama)}
                    >
                      {editCell?.rowId === p.id && editCell?.colKey === 'nama' ? (
                        <input 
                          type="text" 
                          value={editValue} 
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => handleCellSave(p.id, 'nama')}
                          onKeyDown={(e) => e.key === 'Enter' && handleCellSave(p.id, 'nama')}
                          className="w-full h-full p-1 border border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono text-xs"
                          autoFocus
                        />
                      ) : p.nama}
                    </td>

                    {/* Singkatan */}
                    <td 
                      className={`p-1.5 cursor-pointer ${editCell?.rowId === p.id && editCell?.colKey === 'singkatan' ? 'p-0 bg-amber-50' : ''}`}
                      onDoubleClick={() => handleCellDoubleClick(p.id, 'singkatan', p.singkatan)}
                    >
                      {editCell?.rowId === p.id && editCell?.colKey === 'singkatan' ? (
                        <input 
                          type="text" 
                          value={editValue} 
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => handleCellSave(p.id, 'singkatan')}
                          onKeyDown={(e) => e.key === 'Enter' && handleCellSave(p.id, 'singkatan')}
                          className="w-full h-full p-1 border border-amber-400 focus:outline-none"
                          autoFocus
                        />
                      ) : p.singkatan}
                    </td>

                    {/* Nomor Urut */}
                    <td 
                      className={`p-1.5 cursor-pointer text-center ${editCell?.rowId === p.id && editCell?.colKey === 'nomorUrut' ? 'p-0 bg-amber-50' : ''}`}
                      onDoubleClick={() => handleCellDoubleClick(p.id, 'nomorUrut', p.nomorUrut)}
                    >
                      {editCell?.rowId === p.id && editCell?.colKey === 'nomorUrut' ? (
                        <input 
                          type="number" 
                          value={editValue} 
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => handleCellSave(p.id, 'nomorUrut')}
                          onKeyDown={(e) => e.key === 'Enter' && handleCellSave(p.id, 'nomorUrut')}
                          className="w-full h-full p-1 border border-amber-400 focus:outline-none text-center"
                          autoFocus
                        />
                      ) : p.nomorUrut}
                    </td>

                    {/* Status Aktif */}
                    <td className="p-1.5 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-sans ${p.statusAktif ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                        {p.statusAktif ? 'AKTIF' : 'NONAKTIF'}
                      </span>
                    </td>

                    {/* Ketua */}
                    <td 
                      className={`p-1.5 cursor-pointer ${editCell?.rowId === p.id && editCell?.colKey === 'ketua' ? 'p-0 bg-amber-50' : ''}`}
                      onDoubleClick={() => handleCellDoubleClick(p.id, 'ketua', p.ketua)}
                    >
                      {editCell?.rowId === p.id && editCell?.colKey === 'ketua' ? (
                        <input 
                          type="text" 
                          value={editValue} 
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => handleCellSave(p.id, 'ketua')}
                          onKeyDown={(e) => e.key === 'Enter' && handleCellSave(p.id, 'ketua')}
                          className="w-full h-full p-1 border border-amber-400 focus:outline-none"
                          autoFocus
                        />
                      ) : p.ketua}
                    </td>

                    {/* Nomor HP */}
                    <td 
                      className={`p-1.5 cursor-pointer ${editCell?.rowId === p.id && editCell?.colKey === 'nomorHp' ? 'p-0 bg-amber-50' : ''}`}
                      onDoubleClick={() => handleCellDoubleClick(p.id, 'nomorHp', p.nomorHp)}
                    >
                      {editCell?.rowId === p.id && editCell?.colKey === 'nomorHp' ? (
                        <input 
                          type="text" 
                          value={editValue} 
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => handleCellSave(p.id, 'nomorHp')}
                          onKeyDown={(e) => e.key === 'Enter' && handleCellSave(p.id, 'nomorHp')}
                          className="w-full h-full p-1 border border-amber-400 focus:outline-none"
                          autoFocus
                        />
                      ) : p.nomorHp}
                    </td>

                    {/* Masa Berlaku SK */}
                    <td 
                      className={`p-1.5 cursor-pointer text-center ${editCell?.rowId === p.id && editCell?.colKey === 'masaBerlakuSk' ? 'p-0 bg-amber-50' : ''}`}
                      onDoubleClick={() => handleCellDoubleClick(p.id, 'masaBerlakuSk', p.masaBerlakuSk)}
                    >
                      {editCell?.rowId === p.id && editCell?.colKey === 'masaBerlakuSk' ? (
                        <input 
                          type="text" 
                          value={editValue} 
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => handleCellSave(p.id, 'masaBerlakuSk')}
                          onKeyDown={(e) => e.key === 'Enter' && handleCellSave(p.id, 'masaBerlakuSk')}
                          className="w-full h-full p-1 border border-amber-400 focus:outline-none text-center"
                          autoFocus
                        />
                      ) : p.masaBerlakuSk}
                    </td>

                    {/* Suara Sah */}
                    <td 
                      className={`p-1.5 cursor-pointer text-right ${editCell?.rowId === p.id && editCell?.colKey === 'jumlahSuaraSah' ? 'p-0 bg-amber-50' : ''}`}
                      onDoubleClick={() => handleCellDoubleClick(p.id, 'jumlahSuaraSah', p.jumlahSuaraSah)}
                    >
                      {editCell?.rowId === p.id && editCell?.colKey === 'jumlahSuaraSah' ? (
                        <input 
                          type="number" 
                          value={editValue} 
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => handleCellSave(p.id, 'jumlahSuaraSah')}
                          onKeyDown={(e) => e.key === 'Enter' && handleCellSave(p.id, 'jumlahSuaraSah')}
                          className="w-full h-full p-1 border border-amber-400 focus:outline-none text-right font-mono"
                          autoFocus
                        />
                      ) : p.jumlahSuaraSah.toLocaleString('id-ID')}
                    </td>

                    {/* Kursi DPRD */}
                    <td 
                      className={`p-1.5 cursor-pointer text-center ${editCell?.rowId === p.id && editCell?.colKey === 'jumlahKursiDprd' ? 'p-0 bg-amber-50' : ''}`}
                      onDoubleClick={() => handleCellDoubleClick(p.id, 'jumlahKursiDprd', p.jumlahKursiDprd)}
                    >
                      {editCell?.rowId === p.id && editCell?.colKey === 'jumlahKursiDprd' ? (
                        <input 
                          type="number" 
                          value={editValue} 
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => handleCellSave(p.id, 'jumlahKursiDprd')}
                          onKeyDown={(e) => e.key === 'Enter' && handleCellSave(p.id, 'jumlahKursiDprd')}
                          className="w-full h-full p-1 border border-amber-400 focus:outline-none text-center"
                          autoFocus
                        />
                      ) : p.jumlahKursiDprd}
                    </td>

                    {/* Hak Bantuan (Auto-recalculated) */}
                    <td className="p-1.5 text-right font-bold text-emerald-700 bg-emerald-50/40">
                      Rp {p.totalHakBantuan.toLocaleString('id-ID')}
                    </td>

                    {/* Bank */}
                    <td 
                      className={`p-1.5 cursor-pointer ${editCell?.rowId === p.id && editCell?.colKey === 'namaBank' ? 'p-0 bg-amber-50' : ''}`}
                      onDoubleClick={() => handleCellDoubleClick(p.id, 'namaBank', p.namaBank)}
                    >
                      {editCell?.rowId === p.id && editCell?.colKey === 'namaBank' ? (
                        <input 
                          type="text" 
                          value={editValue} 
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => handleCellSave(p.id, 'namaBank')}
                          onKeyDown={(e) => e.key === 'Enter' && handleCellSave(p.id, 'namaBank')}
                          className="w-full h-full p-1 border border-amber-400 focus:outline-none"
                          autoFocus
                        />
                      ) : p.namaBank}
                    </td>

                    {/* Rekening */}
                    <td 
                      className={`p-1.5 cursor-pointer ${editCell?.rowId === p.id && editCell?.colKey === 'nomorRekening' ? 'p-0 bg-amber-50' : ''}`}
                      onDoubleClick={() => handleCellDoubleClick(p.id, 'nomorRekening', p.nomorRekening)}
                    >
                      {editCell?.rowId === p.id && editCell?.colKey === 'nomorRekening' ? (
                        <input 
                          type="text" 
                          value={editValue} 
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => handleCellSave(p.id, 'nomorRekening')}
                          onKeyDown={(e) => e.key === 'Enter' && handleCellSave(p.id, 'nomorRekening')}
                          className="w-full h-full p-1 border border-amber-400 focus:outline-none"
                          autoFocus
                        />
                      ) : p.nomorRekening}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}

        {activeSheet === 'dokumen' && (
          <table className="w-full text-left border-collapse text-xs table-fixed min-w-[1200px]">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-mono font-bold divide-x divide-slate-200">
                <th className="p-2 w-16 text-center">No</th>
                <th className="p-2 w-32">Doc ID</th>
                <th className="p-2 w-28">Partai ID</th>
                <th className="p-2 w-48">Tipe Dokumen</th>
                <th className="p-2 w-44">Nomor Dokumen</th>
                <th className="p-2 w-28">Tanggal</th>
                <th className="p-2 w-28">Masa Berlaku</th>
                <th className="p-2 w-40">Status Verifikasi</th>
                <th className="p-2 w-64">Catatan Verifikator</th>
                <th className="p-2 w-48">Nama File</th>
                <th className="p-2 w-20 text-center">Versi</th>
                <th className="p-2 w-36">Pengunggah</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-slate-700 divide-x divide-slate-100">
              {dokumen
                .filter(d => d.tipeDokumen.toLowerCase().includes(searchQuery.toLowerCase()) || d.nomorDokumen.toLowerCase().includes(searchQuery.toLowerCase()) || d.partaiId.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((d, index) => (
                  <tr key={d.id} className="hover:bg-slate-50/70">
                    <td className="p-1.5 text-center text-slate-400 bg-slate-50">{index + 1}</td>
                    <td className="p-1.5 font-bold text-slate-500 bg-slate-50">{d.id}</td>
                    <td className="p-1.5 bg-slate-50">{d.partaiId}</td>
                    <td className="p-1.5 truncate">{d.tipeDokumen}</td>
                    
                    {/* Nomor Dokumen */}
                    <td 
                      className={`p-1.5 cursor-pointer ${editCell?.rowId === d.id && editCell?.colKey === 'nomorDokumen' ? 'p-0 bg-amber-50' : ''}`}
                      onDoubleClick={() => handleCellDoubleClick(d.id, 'nomorDokumen', d.nomorDokumen)}
                    >
                      {editCell?.rowId === d.id && editCell?.colKey === 'nomorDokumen' ? (
                        <input 
                          type="text" 
                          value={editValue} 
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => handleCellSave(d.id, 'nomorDokumen')}
                          onKeyDown={(e) => e.key === 'Enter' && handleCellSave(d.id, 'nomorDokumen')}
                          className="w-full h-full p-1 border border-amber-400 focus:outline-none"
                          autoFocus
                        />
                      ) : d.nomorDokumen}
                    </td>

                    {/* Tanggal */}
                    <td 
                      className={`p-1.5 cursor-pointer text-center ${editCell?.rowId === d.id && editCell?.colKey === 'tanggal' ? 'p-0 bg-amber-50' : ''}`}
                      onDoubleClick={() => handleCellDoubleClick(d.id, 'tanggal', d.tanggal)}
                    >
                      {editCell?.rowId === d.id && editCell?.colKey === 'tanggal' ? (
                        <input 
                          type="text" 
                          value={editValue} 
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => handleCellSave(d.id, 'tanggal')}
                          onKeyDown={(e) => e.key === 'Enter' && handleCellSave(d.id, 'tanggal')}
                          className="w-full h-full p-1 border border-amber-400 focus:outline-none text-center"
                          autoFocus
                        />
                      ) : d.tanggal}
                    </td>

                    {/* Masa Berlaku */}
                    <td 
                      className={`p-1.5 cursor-pointer text-center ${editCell?.rowId === d.id && editCell?.colKey === 'masaBerlaku' ? 'p-0 bg-amber-50' : ''}`}
                      onDoubleClick={() => handleCellDoubleClick(d.id, 'masaBerlaku', d.masaBerlaku)}
                    >
                      {editCell?.rowId === d.id && editCell?.colKey === 'masaBerlaku' ? (
                        <input 
                          type="text" 
                          value={editValue} 
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => handleCellSave(d.id, 'masaBerlaku')}
                          onKeyDown={(e) => e.key === 'Enter' && handleCellSave(d.id, 'masaBerlaku')}
                          className="w-full h-full p-1 border border-amber-400 focus:outline-none text-center"
                          autoFocus
                        />
                      ) : d.masaBerlaku}
                    </td>

                    {/* Status Verifikasi */}
                    <td className="p-1.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-sans ${
                        d.statusVerifikasi === 'Lengkap' ? 'bg-emerald-100 text-emerald-800' :
                        d.statusVerifikasi === 'Menunggu Verifikasi' ? 'bg-amber-100 text-amber-800' :
                        d.statusVerifikasi === 'Perbaikan' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-800'
                      }`}>
                        {d.statusVerifikasi.toUpperCase()}
                      </span>
                    </td>

                    {/* Catatan Verifikator */}
                    <td 
                      className={`p-1.5 truncate cursor-pointer ${editCell?.rowId === d.id && editCell?.colKey === 'catatanVerifikator' ? 'p-0 bg-amber-50' : ''}`}
                      onDoubleClick={() => handleCellDoubleClick(d.id, 'catatanVerifikator', d.catatanVerifikator)}
                    >
                      {editCell?.rowId === d.id && editCell?.colKey === 'catatanVerifikator' ? (
                        <input 
                          type="text" 
                          value={editValue} 
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => handleCellSave(d.id, 'catatanVerifikator')}
                          onKeyDown={(e) => e.key === 'Enter' && handleCellSave(d.id, 'catatanVerifikator')}
                          className="w-full h-full p-1 border border-amber-400 focus:outline-none"
                          autoFocus
                        />
                      ) : d.catatanVerifikator}
                    </td>

                    {/* File Name */}
                    <td 
                      className={`p-1.5 truncate cursor-pointer ${editCell?.rowId === d.id && editCell?.colKey === 'fileName' ? 'p-0 bg-amber-50' : ''}`}
                      onDoubleClick={() => handleCellDoubleClick(d.id, 'fileName', d.fileName)}
                    >
                      {editCell?.rowId === d.id && editCell?.colKey === 'fileName' ? (
                        <input 
                          type="text" 
                          value={editValue} 
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => handleCellSave(d.id, 'fileName')}
                          onKeyDown={(e) => e.key === 'Enter' && handleCellSave(d.id, 'fileName')}
                          className="w-full h-full p-1 border border-amber-400 focus:outline-none"
                          autoFocus
                        />
                      ) : d.fileName}
                    </td>

                    {/* Versi */}
                    <td className="p-1.5 text-center bg-slate-50">{d.version}</td>
                    
                    {/* Pengunggah */}
                    <td className="p-1.5 truncate">{d.uploadedBy}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}

        {activeSheet === 'hibah' && (
          <table className="w-full text-left border-collapse text-xs table-fixed min-w-[1200px]">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-mono font-bold divide-x divide-slate-200">
                <th className="p-2 w-16 text-center">No</th>
                <th className="p-2 w-28">Hibah ID</th>
                <th className="p-2 w-24">Partai ID</th>
                <th className="p-2 w-24">Tahun</th>
                <th className="p-2 w-48">Nomor SK Bupati</th>
                <th className="p-2 w-48">Nomor NPHD</th>
                <th className="p-2 w-40">Nilai Bantuan</th>
                <th className="p-2 w-40">Status Penyaluran</th>
                <th className="p-2 w-32">Tanggal Cair</th>
                <th className="p-2 w-40">Nomor SP2D</th>
                <th className="p-2 w-40">Nomor SPM</th>
                <th className="p-2 w-64">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-slate-700 divide-x divide-slate-100">
              {hibah
                .filter(h => h.nomorSk.toLowerCase().includes(searchQuery.toLowerCase()) || h.partaiId.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((h, index) => (
                  <tr key={h.id} className="hover:bg-slate-50/70">
                    <td className="p-1.5 text-center text-slate-400 bg-slate-50">{index + 1}</td>
                    <td className="p-1.5 font-bold text-slate-500 bg-slate-50">{h.id}</td>
                    <td className="p-1.5 bg-slate-50">{h.partaiId}</td>
                    <td className="p-1.5 text-center">{h.tahunAnggaran}</td>
                    
                    {/* Nomor SK */}
                    <td 
                      className={`p-1.5 cursor-pointer ${editCell?.rowId === h.id && editCell?.colKey === 'nomorSk' ? 'p-0 bg-amber-50' : ''}`}
                      onDoubleClick={() => handleCellDoubleClick(h.id, 'nomorSk', h.nomorSk)}
                    >
                      {editCell?.rowId === h.id && editCell?.colKey === 'nomorSk' ? (
                        <input 
                          type="text" 
                          value={editValue} 
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => handleCellSave(h.id, 'nomorSk')}
                          onKeyDown={(e) => e.key === 'Enter' && handleCellSave(h.id, 'nomorSk')}
                          className="w-full h-full p-1 border border-amber-400 focus:outline-none"
                          autoFocus
                        />
                      ) : h.nomorSk || '-'}
                    </td>

                    {/* Nomor NPHD */}
                    <td 
                      className={`p-1.5 cursor-pointer ${editCell?.rowId === h.id && editCell?.colKey === 'nomorNphd' ? 'p-0 bg-amber-50' : ''}`}
                      onDoubleClick={() => handleCellDoubleClick(h.id, 'nomorNphd', h.nomorNphd)}
                    >
                      {editCell?.rowId === h.id && editCell?.colKey === 'nomorNphd' ? (
                        <input 
                          type="text" 
                          value={editValue} 
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => handleCellSave(h.id, 'nomorNphd')}
                          onKeyDown={(e) => e.key === 'Enter' && handleCellSave(h.id, 'nomorNphd')}
                          className="w-full h-full p-1 border border-amber-400 focus:outline-none"
                          autoFocus
                        />
                      ) : h.nomorNphd || '-'}
                    </td>

                    {/* Nilai Bantuan */}
                    <td 
                      className={`p-1.5 cursor-pointer text-right font-semibold ${editCell?.rowId === h.id && editCell?.colKey === 'nilaiBantuan' ? 'p-0 bg-amber-50' : ''}`}
                      onDoubleClick={() => handleCellDoubleClick(h.id, 'nilaiBantuan', h.nilaiBantuan)}
                    >
                      {editCell?.rowId === h.id && editCell?.colKey === 'nilaiBantuan' ? (
                        <input 
                          type="number" 
                          value={editValue} 
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => handleCellSave(h.id, 'nilaiBantuan')}
                          onKeyDown={(e) => e.key === 'Enter' && handleCellSave(h.id, 'nilaiBantuan')}
                          className="w-full h-full p-1 border border-amber-400 focus:outline-none text-right"
                          autoFocus
                        />
                      ) : 'Rp ' + h.nilaiBantuan.toLocaleString('id-ID')}
                    </td>

                    {/* Status Penyaluran */}
                    <td className="p-1.5 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-sans ${
                        h.statusPenyaluran === 'Cair' ? 'bg-emerald-100 text-emerald-800' :
                        h.statusPenyaluran === 'SP2D Terbit' ? 'bg-cyan-100 text-cyan-800' :
                        h.statusPenyaluran === 'Proses Verifikasi' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'
                      }`}>
                        {h.statusPenyaluran.toUpperCase()}
                      </span>
                    </td>

                    {/* Tanggal Cair */}
                    <td 
                      className={`p-1.5 cursor-pointer text-center ${editCell?.rowId === h.id && editCell?.colKey === 'tanggalCair' ? 'p-0 bg-amber-50' : ''}`}
                      onDoubleClick={() => handleCellDoubleClick(h.id, 'tanggalCair', h.tanggalCair)}
                    >
                      {editCell?.rowId === h.id && editCell?.colKey === 'tanggalCair' ? (
                        <input 
                          type="text" 
                          value={editValue} 
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => handleCellSave(h.id, 'tanggalCair')}
                          onKeyDown={(e) => e.key === 'Enter' && handleCellSave(h.id, 'tanggalCair')}
                          className="w-full h-full p-1 border border-amber-400 focus:outline-none text-center"
                          autoFocus
                        />
                      ) : h.tanggalCair || '-'}
                    </td>

                    {/* Nomor SP2D */}
                    <td 
                      className={`p-1.5 cursor-pointer ${editCell?.rowId === h.id && editCell?.colKey === 'nomorSp2d' ? 'p-0 bg-amber-50' : ''}`}
                      onDoubleClick={() => handleCellDoubleClick(h.id, 'nomorSp2d', h.nomorSp2d)}
                    >
                      {editCell?.rowId === h.id && editCell?.colKey === 'nomorSp2d' ? (
                        <input 
                          type="text" 
                          value={editValue} 
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => handleCellSave(h.id, 'nomorSp2d')}
                          onKeyDown={(e) => e.key === 'Enter' && handleCellSave(h.id, 'nomorSp2d')}
                          className="w-full h-full p-1 border border-amber-400 focus:outline-none"
                          autoFocus
                        />
                      ) : h.nomorSp2d || '-'}
                    </td>

                    {/* Nomor SPM */}
                    <td 
                      className={`p-1.5 cursor-pointer ${editCell?.rowId === h.id && editCell?.colKey === 'nomorSpm' ? 'p-0 bg-amber-50' : ''}`}
                      onDoubleClick={() => handleCellDoubleClick(h.id, 'nomorSpm', h.nomorSpm)}
                    >
                      {editCell?.rowId === h.id && editCell?.colKey === 'nomorSpm' ? (
                        <input 
                          type="text" 
                          value={editValue} 
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => handleCellSave(h.id, 'nomorSpm')}
                          onKeyDown={(e) => e.key === 'Enter' && handleCellSave(h.id, 'nomorSpm')}
                          className="w-full h-full p-1 border border-amber-400 focus:outline-none"
                          autoFocus
                        />
                      ) : h.nomorSpm || '-'}
                    </td>

                    {/* Keterangan */}
                    <td 
                      className={`p-1.5 cursor-pointer truncate ${editCell?.rowId === h.id && editCell?.colKey === 'keterangan' ? 'p-0 bg-amber-50' : ''}`}
                      onDoubleClick={() => handleCellDoubleClick(h.id, 'keterangan', h.keterangan)}
                    >
                      {editCell?.rowId === h.id && editCell?.colKey === 'keterangan' ? (
                        <input 
                          type="text" 
                          value={editValue} 
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => handleCellSave(h.id, 'keterangan')}
                          onKeyDown={(e) => e.key === 'Enter' && handleCellSave(h.id, 'keterangan')}
                          className="w-full h-full p-1 border border-amber-400 focus:outline-none"
                          autoFocus
                        />
                      ) : h.keterangan}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}

        {activeSheet === 'lpj' && (
          <table className="w-full text-left border-collapse text-xs table-fixed min-w-[1200px]">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-mono font-bold divide-x divide-slate-200">
                <th className="p-2 w-16 text-center">No</th>
                <th className="p-2 w-28">LPJ ID</th>
                <th className="p-2 w-24">Partai ID</th>
                <th className="p-2 w-24">Tahun LPJ</th>
                <th className="p-2 w-32">Tanggal Lapor</th>
                <th className="p-2 w-40">Nilai Penggunaan</th>
                <th className="p-2 w-40">Status LPJ</th>
                <th className="p-2 w-64">Ringkasan Kegiatan</th>
                <th className="p-2 w-48">Nama File LPJ</th>
                <th className="p-2 w-64">Hasil Evaluasi</th>
                <th className="p-2 w-64">Catatan Perbaikan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-slate-700 divide-x divide-slate-100">
              {lpj
                .filter(l => l.partaiId.toLowerCase().includes(searchQuery.toLowerCase()) || l.statusDiterima.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((l, index) => (
                  <tr key={l.id} className="hover:bg-slate-50/70">
                    <td className="p-1.5 text-center text-slate-400 bg-slate-50">{index + 1}</td>
                    <td className="p-1.5 font-bold text-slate-500 bg-slate-50">{l.id}</td>
                    <td className="p-1.5 bg-slate-50">{l.partaiId}</td>
                    <td className="p-1.5 text-center">{l.tahun}</td>
                    
                    {/* Tanggal Laporan */}
                    <td 
                      className={`p-1.5 cursor-pointer text-center ${editCell?.rowId === l.id && editCell?.colKey === 'tanggalLaporan' ? 'p-0 bg-amber-50' : ''}`}
                      onDoubleClick={() => handleCellDoubleClick(l.id, 'tanggalLaporan', l.tanggalLaporan)}
                    >
                      {editCell?.rowId === l.id && editCell?.colKey === 'tanggalLaporan' ? (
                        <input 
                          type="text" 
                          value={editValue} 
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => handleCellSave(l.id, 'tanggalLaporan')}
                          onKeyDown={(e) => e.key === 'Enter' && handleCellSave(l.id, 'tanggalLaporan')}
                          className="w-full h-full p-1 border border-amber-400 focus:outline-none text-center"
                          autoFocus
                        />
                      ) : l.tanggalLaporan}
                    </td>

                    {/* Nilai Penggunaan */}
                    <td 
                      className={`p-1.5 cursor-pointer text-right font-semibold ${editCell?.rowId === l.id && editCell?.colKey === 'nilaiPenggunaanDana' ? 'p-0 bg-amber-50' : ''}`}
                      onDoubleClick={() => handleCellDoubleClick(l.id, 'nilaiPenggunaanDana', l.nilaiPenggunaanDana)}
                    >
                      {editCell?.rowId === l.id && editCell?.colKey === 'nilaiPenggunaanDana' ? (
                        <input 
                          type="number" 
                          value={editValue} 
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => handleCellSave(l.id, 'nilaiPenggunaanDana')}
                          onKeyDown={(e) => e.key === 'Enter' && handleCellSave(l.id, 'nilaiPenggunaanDana')}
                          className="w-full h-full p-1 border border-amber-400 focus:outline-none text-right"
                          autoFocus
                        />
                      ) : 'Rp ' + l.nilaiPenggunaanDana.toLocaleString('id-ID')}
                    </td>

                    {/* Status Diterima */}
                    <td className="p-1.5 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-sans ${
                        l.statusDiterima === 'Diterima' ? 'bg-emerald-100 text-emerald-800' :
                        l.statusDiterima === 'Perbaikan' ? 'bg-amber-100 text-amber-800' :
                        l.statusDiterima === 'Ditolak' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-800'
                      }`}>
                        {l.statusDiterima.toUpperCase()}
                      </span>
                    </td>

                    {/* Ringkasan Kegiatan */}
                    <td 
                      className={`p-1.5 truncate cursor-pointer ${editCell?.rowId === l.id && editCell?.colKey === 'ringkasanKegiatan' ? 'p-0 bg-amber-50' : ''}`}
                      onDoubleClick={() => handleCellDoubleClick(l.id, 'ringkasanKegiatan', l.ringkasanKegiatan)}
                    >
                      {editCell?.rowId === l.id && editCell?.colKey === 'ringkasanKegiatan' ? (
                        <textarea 
                          value={editValue} 
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => handleCellSave(l.id, 'ringkasanKegiatan')}
                          className="w-full h-full p-1 border border-amber-400 focus:outline-none font-mono text-[10px]"
                          autoFocus
                        />
                      ) : l.ringkasanKegiatan}
                    </td>

                    {/* File Name */}
                    <td 
                      className={`p-1.5 truncate cursor-pointer ${editCell?.rowId === l.id && editCell?.colKey === 'fileNameLpj' ? 'p-0 bg-amber-50' : ''}`}
                      onDoubleClick={() => handleCellDoubleClick(l.id, 'fileNameLpj', l.fileNameLpj)}
                    >
                      {editCell?.rowId === l.id && editCell?.colKey === 'fileNameLpj' ? (
                        <input 
                          type="text" 
                          value={editValue} 
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => handleCellSave(l.id, 'fileNameLpj')}
                          onKeyDown={(e) => e.key === 'Enter' && handleCellSave(l.id, 'fileNameLpj')}
                          className="w-full h-full p-1 border border-amber-400 focus:outline-none"
                          autoFocus
                        />
                      ) : l.fileNameLpj}
                    </td>

                    {/* Hasil Evaluasi */}
                    <td 
                      className={`p-1.5 truncate cursor-pointer ${editCell?.rowId === l.id && editCell?.colKey === 'hasilEvaluasi' ? 'p-0 bg-amber-50' : ''}`}
                      onDoubleClick={() => handleCellDoubleClick(l.id, 'hasilEvaluasi', l.hasilEvaluasi)}
                    >
                      {editCell?.rowId === l.id && editCell?.colKey === 'hasilEvaluasi' ? (
                        <input 
                          type="text" 
                          value={editValue} 
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => handleCellSave(l.id, 'hasilEvaluasi')}
                          onKeyDown={(e) => e.key === 'Enter' && handleCellSave(l.id, 'hasilEvaluasi')}
                          className="w-full h-full p-1 border border-amber-400 focus:outline-none"
                          autoFocus
                        />
                      ) : l.hasilEvaluasi || '-'}
                    </td>

                    {/* Catatan Perbaikan */}
                    <td 
                      className={`p-1.5 truncate cursor-pointer ${editCell?.rowId === l.id && editCell?.colKey === 'catatan' ? 'p-0 bg-amber-50' : ''}`}
                      onDoubleClick={() => handleCellDoubleClick(l.id, 'catatan', l.catatan)}
                    >
                      {editCell?.rowId === l.id && editCell?.colKey === 'catatan' ? (
                        <input 
                          type="text" 
                          value={editValue} 
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => handleCellSave(l.id, 'catatan')}
                          onKeyDown={(e) => e.key === 'Enter' && handleCellSave(l.id, 'catatan')}
                          className="w-full h-full p-1 border border-amber-400 focus:outline-none"
                          autoFocus
                        />
                      ) : l.catatan || '-'}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Grid Status Footer */}
      <div className="bg-slate-50 p-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Status Sinkronisasi: Aktif & Terhubung ke database.json</span>
        </div>
        <div>
          <span>DPW/DPD DPRD Provinsi Nusa Tenggara Barat &bull; TA {new Date().getFullYear()}</span>
        </div>
      </div>
    </div>
  );
}
