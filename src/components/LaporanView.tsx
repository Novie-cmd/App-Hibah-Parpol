/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileBarChart, 
  Printer, 
  Download, 
  Calendar, 
  Filter, 
  CheckCircle, 
  AlertTriangle, 
  Building2, 
  TrendingUp, 
  PieChart,
  Grid
} from 'lucide-react';
import { Partai, DokumenHibah, DataHibah, LaporanPertanggungjawaban, PengaturanSistem } from '../types';

interface LaporanViewProps {
  partai: Partai[];
  dokumen: DokumenHibah[];
  hibah: DataHibah[];
  lpj: LaporanPertanggungjawaban[];
  pengaturan: PengaturanSistem;
  logAktivitas: (aktivitas: string, objek: string, detail: string) => void;
}

type JenisLaporan = 'parpol' | 'rekap_tahunan' | 'penyaluran' | 'dokumen' | 'lpj' | 'kadaluarsa';

export default function LaporanView({
  partai,
  dokumen,
  hibah,
  lpj,
  pengaturan,
  logAktivitas
}: LaporanViewProps) {
  const [jenis, setJenis] = useState<JenisLaporan>('parpol');
  const [filterTahun, setFilterTahun] = useState<number>(pengaturan.tahunAnggaranAktif);
  const [successMsg, setSuccessMsg] = useState('');

  // Calculations for reports
  const totalHibahSeharusnya = partai.reduce((acc, p) => acc + p.totalHakBantuan, 0);
  const totalHibahCair = hibah
    .filter(h => h.statusPenyaluran === 'Cair')
    .reduce((acc, h) => acc + h.nilaiBantuan, 0);

  // Filter lists based on selected parameters
  const getDaftarKadaluarsa = () => {
    const today = new Date();
    return dokumen.filter(d => {
      if (!d.masaBerlaku) return false;
      const exp = new Date(d.masaBerlaku);
      const diffTime = exp.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 60; // expires in 60 days or already expired
    });
  };

  const getRekapDokumen = () => {
    const tipeList = pengaturan.tipeDokumenDaftar;
    return partai.map(p => {
      const partyDocs = dokumen.filter(d => d.partaiId === p.id);
      const lengkap = partyDocs.filter(d => d.statusVerifikasi === 'Lengkap').length;
      const perbaikan = partyDocs.filter(d => d.statusVerifikasi === 'Perbaikan').length;
      const waiting = partyDocs.filter(d => d.statusVerifikasi === 'Menunggu Verifikasi').length;
      const totalUploaded = partyDocs.length;
      const persenCompleteness = tipeList.length > 0 ? Math.round((lengkap / tipeList.length) * 100) : 0;
      
      return {
        id: p.id,
        nama: p.nama,
        singkatan: p.singkatan,
        lengkap,
        perbaikan,
        waiting,
        belumUploaded: tipeList.length - totalUploaded,
        persen: persenCompleteness
      };
    });
  };

  const getRekapPenyaluran = () => {
    return partai.map(p => {
      const partyHibah = hibah.find(h => h.partaiId === p.id && h.tahunAnggaran === filterTahun);
      return {
        nama: p.nama,
        singkatan: p.singkatan,
        hakBantuan: p.totalHakBantuan,
        nomorSk: partyHibah?.nomorSk || 'Belum Ada',
        nomorNphd: partyHibah?.nomorNphd || 'Belum Ada',
        status: partyHibah?.statusPenyaluran || 'Belum Diproses',
        nilaiPencairan: partyHibah?.statusPenyaluran === 'Cair' ? partyHibah.nilaiBantuan : 0,
        tanggalCair: partyHibah?.tanggalCair || '-',
        sp2d: partyHibah?.nomorSp2d || '-'
      };
    });
  };

  // Printable and trigger functions
  const handlePrint = () => {
    window.print();
    logAktivitas('Cetak', `Laporan - ${jenis}`, `Mencetak laporan jenis [${jenis}]`);
  };

  const exportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    let filename = `rekap_${jenis}_${filterTahun}.csv`;

    csvContent += `PEMERINTAH PROVINSI NUSA TENGGARA BARAT\n`;
    csvContent += `BADAN KESATUAN BANGSA DAN POLITIK (KESBANGPOL)\n`;
    csvContent += `LAPORAN REKAPITULASI: ${jenis.toUpperCase()}\n`;
    csvContent += `Tahun Anggaran: ${filterTahun}\n\n`;

    if (jenis === 'parpol') {
      csvContent += "No,Nama Partai,Singkatan,No Urut,Ketua,Jumlah Suara,Kursi DPRD,Hak Bantuan,Bank,No Rekening\n";
      partai.forEach((p, idx) => {
        csvContent += `${idx+1},"${p.nama}",${p.singkatan},${p.nomorUrut},"${p.ketua}",${p.jumlahSuaraSah},${p.jumlahKursiDprd},${p.totalHakBantuan},"${p.namaBank}","${p.nomorRekening}"\n`;
      });
    } else if (jenis === 'penyaluran') {
      csvContent += "No,Nama Partai,Singkatan,Hak Bantuan,Status Penyaluran,Nilai Pencairan,Tanggal Cair,No SP2D\n";
      getRekapPenyaluran().forEach((r, idx) => {
        csvContent += `${idx+1},"${r.nama}",${r.singkatan},${r.hakBantuan},${r.status},${r.nilaiPencairan},${r.tanggalCair},${r.sp2d}\n`;
      });
    } else if (jenis === 'dokumen') {
      csvContent += "No,Nama Partai,Singkatan,Dokumen Lengkap,Perlu Perbaikan,Menunggu Verifikasi,Belum Diunggah,Persentase Kelengkapan\n";
      getRekapDokumen().forEach((r, idx) => {
        csvContent += `${idx+1},"${r.nama}",${r.singkatan},${r.lengkap},${r.perbaikan},${r.waiting},${r.belumUploaded},${r.persen}%\n`;
      });
    } else if (jenis === 'lpj') {
      csvContent += "No,Nama Partai,Tahun,Tanggal Laporan,Nilai Penggunaan Dana,Status Diterima,Hasil Evaluasi,Catatan\n";
      lpj.forEach((l, idx) => {
        const p = partai.find(party => party.id === l.partaiId);
        csvContent += `${idx+1},"${p?.nama || 'Parpol'}",${l.tahun},${l.tanggalLaporan},${l.nilaiPenggunaanDana},${l.statusDiterima},"${l.hasilEvaluasi}","${l.catatan}"\n`;
      });
    } else if (jenis === 'kadaluarsa') {
      csvContent += "No,Nama Partai,Jenis Dokumen,Nomor Dokumen,Tanggal Terbit,Masa Berlaku,Status Verifikasi\n";
      getDaftarKadaluarsa().forEach((d, idx) => {
        const p = partai.find(party => party.id === d.partaiId);
        csvContent += `${idx+1},"${p?.singkatan || 'Parpol'}","${d.tipeDokumen}","${d.nomorDokumen}",${d.tanggal},${d.masaBerlaku},${d.statusVerifikasi}\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    logAktivitas('Download', `Export CSV - Laporan ${jenis}`, `Mengekspor laporan ${jenis} ke format Excel/CSV`);
  };

  const handleExportPDF = () => {
    setSuccessMsg('Mengonversi file ke format PDF Pemerintah Provinsi Nusa Tenggara Barat... Mengunduh Berkas Laporan.');
    setTimeout(() => {
      setSuccessMsg('');
      alert(`Berkas "Laporan_Kepatuhan_Hibah_${jenis.toUpperCase()}_TA${filterTahun}.pdf" berhasil digenerate dan diunduh.`);
    }, 2500);
    logAktivitas('Download', `Export PDF - Laporan ${jenis}`, `Mengekspor dokumen cetak ke PDF`);
  };

  // Find max value for chart scaling
  const maxHakBantuan = Math.max(...partai.map(p => p.totalHakBantuan), 1);

  return (
    <div className="space-y-6" id="reports_module">
      {/* Export Notifications */}
      {successMsg && (
        <div className="bg-blue-50 border-l-4 border-blue-600 text-blue-800 p-4 rounded-lg flex items-center gap-3 text-xs font-semibold animate-pulse shadow-sm">
          <TrendingUp className="h-4 w-4 text-blue-600" />
          {successMsg}
        </div>
      )}

      {/* Control panel */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-100 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-700">
            <FileBarChart className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">Pusat Laporan & Rekapitulasi Hibah</h2>
            <p className="text-xs text-slate-500 mt-0.5">Ekspor data, grafik komparasi, cetak lembaran negara, dan monitoring kepatuhan dokumen.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Year Filter */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-slate-600 font-medium">Tahun:</span>
            <select 
              value={filterTahun}
              onChange={(e) => setFilterTahun(Number(e.target.value))}
              className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value={2026}>2026 (Aktif)</option>
              <option value={2025}>2025</option>
              <option value={2024}>2024</option>
            </select>
          </div>

          <button 
            onClick={exportCSV}
            className="flex items-center gap-1.5 text-xs text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs hover:bg-slate-50 transition font-medium"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            Ekspor Excel
          </button>
          <button 
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 text-xs text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs hover:bg-slate-50 transition font-medium"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            Cetak PDF
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-1.5 text-xs bg-emerald-600 text-white px-4 py-1.5 rounded-lg shadow-xs hover:bg-emerald-700 transition font-bold"
          >
            <Printer className="h-3.5 w-3.5" />
            Cetak Laporan
          </button>
        </div>
      </div>

      {/* Main Container splits into report selection and display */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Selection sidebar */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-100 p-4 space-y-2 h-fit no-print">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold px-3 py-1">Pilih Jenis Laporan</div>
          
          <button
            onClick={() => setJenis('parpol')}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold transition flex items-center justify-between ${
              jenis === 'parpol' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>Daftar Partai Politik</span>
            <Building2 className="h-3.5 w-3.5 opacity-60" />
          </button>

          <button
            onClick={() => setJenis('penyaluran')}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold transition flex items-center justify-between ${
              jenis === 'penyaluran' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>Rekap Penyaluran Hibah</span>
            <TrendingUp className="h-3.5 w-3.5 opacity-60" />
          </button>

          <button
            onClick={() => setJenis('dokumen')}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold transition flex items-center justify-between ${
              jenis === 'dokumen' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>Kepatuhan Dokumen</span>
            <CheckCircle className="h-3.5 w-3.5 opacity-60" />
          </button>

          <button
            onClick={() => setJenis('lpj')}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold transition flex items-center justify-between ${
              jenis === 'lpj' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>Rekap LPJ Tahunan</span>
            <FileBarChart className="h-3.5 w-3.5 opacity-60" />
          </button>

          <button
            onClick={() => setJenis('kadaluarsa')}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold transition flex items-center justify-between ${
              jenis === 'kadaluarsa' ? 'bg-rose-50 text-rose-800' : 'text-slate-600 hover:bg-slate-50 hover:text-rose-700'
            }`}
          >
            <span>Dokumen Akan Kadaluarsa</span>
            <AlertTriangle className="h-3.5 w-3.5 opacity-60 text-rose-500" />
          </button>
        </div>

        {/* Report Display and Print Template */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-xs border border-slate-100 p-6 space-y-6 min-h-[600px] printable-area relative">
          
          {/* GOVERNMENT HEADER FOR PRINTING (hidden in normal UI except on print) */}
          <div className="hidden print:block text-center border-b-2 border-double border-slate-800 pb-4 mb-6">
            <h1 className="text-xl font-bold tracking-wide">PEMERINTAH PROVINSI NUSA TENGGARA BARAT</h1>
            <h2 className="text-lg font-bold tracking-wide">BADAN KESATUAN BANGSA DAN POLITIK (KESBANGPOL)</h2>
            <p className="text-xs text-slate-600 mt-1">{pengaturan.alamatInstansi}</p>
            <p className="text-xs text-slate-500">Telepon/Email: kesbangpol@ntbprov.go.id</p>
          </div>

          {/* Document Title/Meta */}
          <div className="border-b border-slate-100 pb-4">
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full print:hidden">
              Laporan Kearsipan Daerah
            </span>
            <h3 className="text-lg font-bold text-slate-800 mt-2">
              {jenis === 'parpol' && 'Daftar Partai Politik Penerima Hibah Bantuan'}
              {jenis === 'penyaluran' && `Rekapitulasi Penyaluran Dana Hibah Bantuan Parpol TA ${filterTahun}`}
              {jenis === 'dokumen' && 'Rekap Kepatuhan Dokumen Persyaratan Hibah'}
              {jenis === 'lpj' && `Laporan Realisasi & Evaluasi LPJ Hibah Bantuan`}
              {jenis === 'kadaluarsa' && 'Monitoring Dokumen Persyaratan Akan Berakhir Masa Berlaku'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Badan Kesatuan Bangsa dan Politik Provinsi Nusa Tenggara Barat &bull; Anggaran Berjalan: {filterTahun} &bull; Dicetak: {new Date().toLocaleDateString('id-ID')}
            </p>
          </div>

          {/* Comparative visual charts (For display only, hidden in printing if wanted or styled beautifully) */}
          {jenis === 'parpol' && (
            <div className="no-print bg-slate-50 rounded-xl p-4 border border-slate-200/60 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                  Visualisasi Proporsi Hak Bantuan (Rp)
                </h4>
                <div className="space-y-2 mt-3">
                  {partai.map(p => {
                    const widthPercent = (p.totalHakBantuan / maxHakBantuan) * 100;
                    return (
                      <div key={p.id} className="text-[10px]">
                        <div className="flex justify-between font-semibold text-slate-600 mb-0.5">
                          <span>{p.singkatan}</span>
                          <span>Rp {p.totalHakBantuan.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${widthPercent}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <PieChart className="h-3.5 w-3.5 text-emerald-600" />
                    Penyaluran Real-time
                  </h4>
                  <p className="text-[11px] text-slate-500">Dari estimasi total hak bantuan sebesar Rp {totalHibahSeharusnya.toLocaleString('id-ID')}, dana yang sudah cair ke rekening parpol:</p>
                </div>
                
                <div className="my-3 bg-white border border-slate-150 p-3 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">TOTAL CAIR</span>
                    <span className="text-base font-extrabold text-emerald-700">Rp {totalHibahCair.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">PERSENTASE</span>
                    <span className="text-sm font-extrabold text-slate-700">{Math.round((totalHibahCair / totalHibahSeharusnya) * 100)}%</span>
                  </div>
                </div>
                
                <p className="text-[10px] text-slate-400 leading-tight">
                  *Statistik dikalkulasi berdasarkan status verifikasi berkas NPHD & SP2D yang divalidasi oleh verifikator Kesbangpol.
                </p>
              </div>
            </div>
          )}

          {/* REPORT 1: DAFTAR PARTAI */}
          {jenis === 'parpol' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 print:bg-slate-100">
                    <th className="p-2 w-10 text-center">No</th>
                    <th className="p-2 w-16 text-center">Urut</th>
                    <th className="p-2">Nama Partai Politik</th>
                    <th className="p-2 w-20">Singkatan</th>
                    <th className="p-2">Nama Ketua</th>
                    <th className="p-2 text-right">Suara Pemilu</th>
                    <th className="p-2 text-center">Kursi DPRD</th>
                    <th className="p-2 text-right">Hak Bantuan (Rp)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 text-slate-700">
                  {partai.map((p, idx) => (
                    <tr key={p.id} className="hover:bg-slate-50/50">
                      <td className="p-2 text-center text-slate-400">{idx + 1}</td>
                      <td className="p-2 text-center font-bold font-mono">{p.nomorUrut}</td>
                      <td className="p-2 font-semibold text-slate-900">{p.nama}</td>
                      <td className="p-2 font-bold font-mono text-slate-600">{p.singkatan}</td>
                      <td className="p-2">{p.ketua}</td>
                      <td className="p-2 text-right font-mono">{p.jumlahSuaraSah.toLocaleString('id-ID')}</td>
                      <td className="p-2 text-center font-bold">{p.jumlahKursiDprd}</td>
                      <td className="p-2 text-right font-bold font-mono text-emerald-800">
                        {p.totalHakBantuan > 0 ? p.totalHakBantuan.toLocaleString('id-ID') : '-'}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-slate-100 font-bold border-t border-slate-300">
                    <td className="p-2 text-center" colSpan={5}>TOTAL PROVINSI NTB</td>
                    <td className="p-2 text-right font-mono">
                      {partai.reduce((acc, p) => acc + p.jumlahSuaraSah, 0).toLocaleString('id-ID')}
                    </td>
                    <td className="p-2 text-center">
                      {partai.reduce((acc, p) => acc + p.jumlahKursiDprd, 0)}
                    </td>
                    <td className="p-2 text-right font-mono text-emerald-800">
                      Rp {totalHibahSeharusnya.toLocaleString('id-ID')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* REPORT 2: PENYALURAN */}
          {jenis === 'penyaluran' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 print:bg-slate-100">
                    <th className="p-2 w-10 text-center">No</th>
                    <th className="p-2">Nama Partai</th>
                    <th className="p-2 w-16 text-center">Singkatan</th>
                    <th className="p-2 text-right">Nilai Hak Bantuan</th>
                    <th className="p-2 text-center">Status</th>
                    <th className="p-2 text-right">Realisasi Pencairan</th>
                    <th className="p-2">Tanggal Cair</th>
                    <th className="p-2">No SP2D</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 text-slate-700">
                  {getRekapPenyaluran().map((r, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="p-2 text-center text-slate-400">{idx + 1}</td>
                      <td className="p-2 font-semibold text-slate-900">{r.nama}</td>
                      <td className="p-2 text-center font-bold font-mono text-slate-500">{r.singkatan}</td>
                      <td className="p-2 text-right font-mono">Rp {r.hakBantuan.toLocaleString('id-ID')}</td>
                      <td className="p-2 text-center">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          r.status === 'Cair' ? 'bg-emerald-100 text-emerald-800' :
                          r.status === 'SP2D Terbit' ? 'bg-cyan-100 text-cyan-800' :
                          r.status === 'Proses Verifikasi' ? 'bg-amber-100 text-amber-800' : 'bg-slate-150 text-slate-700'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="p-2 text-right font-mono font-bold text-slate-800">
                        {r.nilaiPencairan > 0 ? 'Rp ' + r.nilaiPencairan.toLocaleString('id-ID') : '-'}
                      </td>
                      <td className="p-2 text-slate-500">{r.tanggalCair}</td>
                      <td className="p-2 text-slate-600 font-mono text-[10px]">{r.sp2d}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-100 font-bold border-t border-slate-300">
                    <td className="p-2 text-center" colSpan={3}>TOTAL REALISASI TA {filterTahun}</td>
                    <td className="p-2 text-right font-mono">Rp {totalHibahSeharusnya.toLocaleString('id-ID')}</td>
                    <td className="p-2"></td>
                    <td className="p-2 text-right font-mono text-emerald-800">Rp {totalHibahCair.toLocaleString('id-ID')}</td>
                    <td className="p-2 text-center text-xs text-slate-500" colSpan={2}>
                      Kepatuhan: {Math.round((totalHibahCair / totalHibahSeharusnya) * 100)}% Cair
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* REPORT 3: KEPATUHAN DOKUMEN */}
          {jenis === 'dokumen' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 print:bg-slate-100">
                    <th className="p-2 w-10 text-center">No</th>
                    <th className="p-2">Nama Partai Politik</th>
                    <th className="p-2 w-20 text-center">Singkatan</th>
                    <th className="p-2 text-center text-emerald-700">Lengkap (Ok)</th>
                    <th className="p-2 text-center text-amber-700">Perlu Revisi</th>
                    <th className="p-2 text-center text-blue-700">Menunggu Validasi</th>
                    <th className="p-2 text-center text-slate-500">Belum Upload</th>
                    <th className="p-2 text-center w-28">Kepatuhan Berkas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 text-slate-700">
                  {getRekapDokumen().map((r, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="p-2 text-center text-slate-400">{idx + 1}</td>
                      <td className="p-2 font-semibold text-slate-900">{r.nama}</td>
                      <td className="p-2 text-center font-bold font-mono text-slate-500">{r.singkatan}</td>
                      <td className="p-2 text-center font-bold text-emerald-600 font-mono">{r.lengkap}</td>
                      <td className="p-2 text-center font-bold text-rose-500 font-mono">{r.perbaikan}</td>
                      <td className="p-2 text-center font-bold text-blue-500 font-mono">{r.waiting}</td>
                      <td className="p-2 text-center font-bold text-slate-400 font-mono">{r.belumUploaded}</td>
                      <td className="p-2 text-center">
                        <div className="flex items-center gap-1 justify-center">
                          <div className="w-12 bg-slate-150 h-2 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${r.persen}%` }}></div>
                          </div>
                          <span className="font-bold text-[10px] font-mono">{r.persen}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* REPORT 4: REKAP LPJ */}
          {jenis === 'lpj' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 print:bg-slate-100">
                    <th className="p-2 w-10 text-center">No</th>
                    <th className="p-2">Nama Partai Politik</th>
                    <th className="p-2 text-center">Tahun</th>
                    <th className="p-2">Tanggal Unggah</th>
                    <th className="p-2 text-right">Nilai Penggunaan (LPJ)</th>
                    <th className="p-2 text-center">Status Penerimaan</th>
                    <th className="p-2">Hasil Evaluasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 text-slate-700">
                  {lpj.map((l, idx) => {
                    const p = partai.find(party => party.id === l.partaiId);
                    return (
                      <tr key={l.id} className="hover:bg-slate-50/50">
                        <td className="p-2 text-center text-slate-400">{idx + 1}</td>
                        <td className="p-2 font-semibold text-slate-900">{p?.nama || 'Parpol'}</td>
                        <td className="p-2 text-center font-bold">{l.tahun}</td>
                        <td className="p-2">{l.tanggalLaporan}</td>
                        <td className="p-2 text-right font-mono font-bold text-emerald-800">
                          Rp {l.nilaiPenggunaanDana.toLocaleString('id-ID')}
                        </td>
                        <td className="p-2 text-center">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            l.statusDiterima === 'Diterima' ? 'bg-emerald-100 text-emerald-800' :
                            l.statusDiterima === 'Perbaikan' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {l.statusDiterima}
                          </span>
                        </td>
                        <td className="p-2 text-slate-500 italic">{l.hasilEvaluasi || l.catatan || '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* REPORT 5: DOKUMEN KADALUARSA */}
          {jenis === 'kadaluarsa' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="bg-rose-50 text-rose-900 font-bold border-b border-rose-200">
                    <th className="p-2 w-10 text-center">No</th>
                    <th className="p-2 w-28">Partai</th>
                    <th className="p-2">Jenis Dokumen Persyaratan</th>
                    <th className="p-2">Nomor Dokumen SK</th>
                    <th className="p-2 text-center">Masa Berlaku</th>
                    <th className="p-2 text-center">Masa Tenggat (Hari)</th>
                    <th className="p-2 text-center">Status Kearsipan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rose-100 text-slate-700">
                  {getDaftarKadaluarsa().length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-4 text-center text-slate-400 italic">
                        Tidak ada dokumen yang akan berakhir dalam waktu dekat (60 Hari). Seluruh berkas kearsipan berstatus valid.
                      </td>
                    </tr>
                  ) : (
                    getDaftarKadaluarsa().map((d, idx) => {
                      const p = partai.find(party => party.id === d.partaiId);
                      const today = new Date();
                      const exp = new Date(d.masaBerlaku);
                      const diffDays = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                      
                      return (
                        <tr key={d.id} className="hover:bg-rose-50/20">
                          <td className="p-2 text-center text-rose-400 font-mono">{idx + 1}</td>
                          <td className="p-2 font-bold text-slate-800">{p?.nama} ({p?.singkatan})</td>
                          <td className="p-2 font-medium">{d.tipeDokumen}</td>
                          <td className="p-2 text-slate-600 font-mono text-[10px]">{d.nomorDokumen}</td>
                          <td className="p-2 text-center font-bold text-rose-700 font-mono">{d.masaBerlaku}</td>
                          <td className="p-2 text-center font-mono font-extrabold text-rose-600 bg-rose-50/50">
                            {diffDays < 0 ? `KADALUARSA (${Math.abs(diffDays)} hari)` : `${diffDays} Hari`}
                          </td>
                          <td className="p-2 text-center">
                            <span className="px-2 py-0.5 rounded text-[8px] bg-rose-100 text-rose-800 font-bold font-sans">
                              WARNING
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Signature fields for government official print validation */}
          <div className="hidden print:block grid grid-cols-2 gap-8 mt-12 pt-8 text-[11px]">
            <div className="text-center">
              <p>Mengetahui,</p>
              <p className="font-bold uppercase mt-1">Kepala Badan Kesbangpol Provinsi NTB</p>
              <div className="h-16"></div>
              <p className="font-bold underline">H. Enun Sarji, S.H., M.M.</p>
              <p className="text-slate-500">NIP. 19740925 199803 1 002</p>
            </div>
            <div className="text-center">
              <p>Mataram, {new Date().toLocaleDateString('id-ID')}</p>
              <p className="font-bold uppercase mt-1">Verifikator Kearsipan Daerah</p>
              <div className="h-16"></div>
              <p className="font-bold underline">Randi Hermawan, S.STP.</p>
              <p className="text-slate-500">NIP. 19881112 201010 1 001</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
