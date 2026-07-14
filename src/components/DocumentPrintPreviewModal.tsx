/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Printer, Download, FileText, CheckCircle, FileSignature, Receipt, CreditCard } from 'lucide-react';
import { Partai, DataHibah, PengaturanSistem } from '../types';

interface DocumentPrintPreviewModalProps {
  partai: Partai;
  hibah: DataHibah | null;
  pengaturan: PengaturanSistem;
  onClose: () => void;
}

type DocumentType = 'NPHD' | 'SPTJM' | 'BAP' | 'KUITANSI';

export default function DocumentPrintPreviewModal({
  partai,
  hibah,
  pengaturan,
  onClose
}: DocumentPrintPreviewModalProps) {
  const [activeDoc, setActiveDoc] = useState<DocumentType>('NPHD');

  const getPartyDesignation = (singkatan: string) => {
    const s = singkatan.toUpperCase();
    if (
      s.includes('PDI') || 
      s.includes('GERINDRA') || 
      s.includes('GOLKAR') || 
      s.includes('DEMOKRAT') || 
      s.includes('HANURA') || 
      s.includes('PSI') || 
      s.includes('PERINDO')
    ) {
      return { full: "Dewan Pimpinan Daerah", short: "DPD" };
    }
    return { full: "Dewan Pimpinan Wilayah", short: "DPW" };
  };

  const designation = getPartyDesignation(partai.singkatan);
  const a4PageClass = "print-page bg-white w-full p-[2.5cm_2cm] shadow-xl border border-slate-200 rounded-sm min-h-[297mm] relative flex flex-col justify-between print:shadow-none print:border-none print:rounded-none";

  // Convert number to Indonesian Words (Terbilang)
  function formatTerbilang(num: number): string {
    const words = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"];
    let result = "";
    
    if (num < 12) {
      result = words[num];
    } else if (num < 20) {
      result = formatTerbilang(num - 10) + " Belas";
    } else if (num < 100) {
      result = formatTerbilang(Math.floor(num / 10)) + " Puluh " + formatTerbilang(num % 10);
    } else if (num < 200) {
      result = "Seratus " + formatTerbilang(num - 100);
    } else if (num < 1000) {
      result = formatTerbilang(Math.floor(num / 100)) + " Ratus " + formatTerbilang(num % 100);
    } else if (num < 2000) {
      result = "Seribu " + formatTerbilang(num - 1000);
    } else if (num < 1000000) {
      result = formatTerbilang(Math.floor(num / 1000)) + " Ribu " + formatTerbilang(num % 1000);
    } else if (num < 1000000000) {
      result = formatTerbilang(Math.floor(num / 1000000)) + " Juta " + formatTerbilang(num % 1000000);
    } else if (num < 1000000000000) {
      result = formatTerbilang(Math.floor(num / 1000000000)) + " Milyar " + formatTerbilang(num % 1000000000);
    }
    
    return result.replace(/\s+/g, " ").trim();
  }

  const nominal = hibah?.nilaiBantuan || partai.totalHakBantuan || 0;
  const nominalTerbilang = formatTerbilang(nominal) + " Rupiah";
  const tahunAnggaran = pengaturan.tahunAnggaranAktif || 2026;
  const noNphd = partai.nomorNphd || hibah?.nomorNphd || `900/${partai.nomorUrut + 20}/NPHD-KESBANGPOL/${tahunAnggaran}`;
  const noSk = hibah?.nomorSk || `SK-GUBERNUR/100.3.3.1-${partai.nomorUrut + 100}/${tahunAnggaran}`;
  const noSptjm = partai.nomorSptjm || `${partai.nomorUrut + 10}/SPTJM/${partai.singkatan}/${tahunAnggaran}`;
  const noBap = partai.nomorBap || `900/${partai.nomorUrut + 10}/BAP-KESBANGPOL/${tahunAnggaran}`;
  
  // Format dates elegantly
  const getLongDate = (customDate?: string) => {
    if (customDate) {
      try {
        return new Date(customDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      } catch (e) {}
    }
    return hibah?.tanggalPenandatanganan 
      ? new Date(hibah.tanggalPenandatanganan).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
      : "Rabu, 24 Juni 2026";
  };

  const getShortDate = (customDate?: string) => {
    if (customDate) {
      try {
        return new Date(customDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
      } catch (e) {}
    }
    return hibah?.tanggalPenandatanganan
      ? new Date(hibah.tanggalPenandatanganan).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
      : "Juni 2026";
  };

  const nphdDate = getLongDate(partai.tanggalNphd);
  const sptjmDate = getShortDate(partai.tanggalSptjm);
  const bapDate = getLongDate(partai.tanggalBap);
  const kuitansiDate = getShortDate(partai.tanggalBap || partai.tanggalNphd || partai.tanggalSptjm);

  const formattedNominal = nominal.toLocaleString('id-ID');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      {/* Dynamic Style injection for print view */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body {
            background: white !important;
          }
          body * {
            visibility: hidden;
          }
          #printable-document, #printable-document * {
            visibility: visible;
          }
          #printable-document {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            background: transparent !important;
          }
          .print-page {
            page-break-after: always;
            break-after: page;
            margin: 0 !important;
            padding: 2.5cm 2cm 2.5cm 2cm !important;
            box-sizing: border-box !important;
            width: 210mm !important;
            height: 297mm !important;
            background: white !important;
            border: none !important;
            box-shadow: none !important;
            position: relative;
          }
          .print-page:last-child {
            page-break-after: avoid;
            break-after: avoid;
          }
          .no-print {
            display: none !important;
          }
        }
      `}} />

      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col no-print">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg">
              <Printer className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 text-base">Cetak & Preview Dokumen Resmi</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Dokumen Bantuan Keuangan Parpol &bull; <span className="font-bold text-slate-700">{partai.nama} ({partai.singkatan})</span>
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content Split Layout */}
        <div className="flex-1 flex overflow-hidden min-h-[500px]">
          
          {/* Left Sidebar Menu */}
          <div className="w-64 bg-slate-50 border-r border-slate-200 p-4 space-y-2 select-none">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3 pl-2">Pilih Dokumen</span>
            
            <button
              onClick={() => setActiveDoc('NPHD')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition text-left cursor-pointer ${
                activeDoc === 'NPHD' 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              <FileSignature className="h-4 w-4 shrink-0" />
              NPHD (Perjanjian Hibah)
            </button>

            <button
              onClick={() => setActiveDoc('SPTJM')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition text-left cursor-pointer ${
                activeDoc === 'SPTJM' 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              <CheckCircle className="h-4 w-4 shrink-0" />
              SPTJM (Tanggung Jawab)
            </button>

            <button
              onClick={() => setActiveDoc('BAP')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition text-left cursor-pointer ${
                activeDoc === 'BAP' 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              <CreditCard className="h-4 w-4 shrink-0" />
              BAP (Berita Acara Pembayaran)
            </button>

            <button
              onClick={() => setActiveDoc('KUITANSI')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition text-left cursor-pointer ${
                activeDoc === 'KUITANSI' 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              <Receipt className="h-4 w-4 shrink-0" />
              Kuitansi Pembayaran
            </button>

            <div className="pt-6 border-t border-slate-200 mt-6 text-[11px] text-slate-500 leading-relaxed font-medium px-2 bg-emerald-50/50 p-3 rounded-lg border border-emerald-100/50">
              <span className="font-bold text-emerald-800">Petunjuk Cetak:</span>
              <p className="mt-1">
                Gunakan tombol <strong>Cetak Dokumen</strong> di kanan bawah. Di menu cetak browser, aktifkan opsi <strong>"Headers and footers"</strong> (jika diinginkan) atau setel margin ke <strong>Default/Custom</strong> untuk hasil yang rapi.
              </p>
            </div>
          </div>

          {/* Right Document Preview Section */}
          <div className="flex-1 bg-slate-100 p-8 overflow-y-auto flex justify-center">
            
            {/* The Physical Paper Document Area */}
            <div 
              id="printable-document" 
              className="max-w-[210mm] w-full font-serif text-slate-900 select-none leading-relaxed text-xs relative space-y-8 print:space-y-0"
            >
              
              {/* DOCUMENT 1: NPHD (Naskah Perjanjian Hibah Daerah) */}
              {activeDoc === 'NPHD' && (
                <div className="space-y-8 print:space-y-0">
                  {/* Page 1 */}
                  <div className={a4PageClass}>
                    <div className="space-y-6">
                      {/* Title Header with Logos */}
                      <div className="flex justify-between items-center border-b pb-4 mb-4">
                        <img 
                          src={pengaturan.logoInstansi || "https://upload.wikimedia.org/wikipedia/commons/b/ad/Lambang_Nusa_Tenggara_Barat.png"} 
                          alt="Logo NTB" 
                          className="w-16 h-16 object-contain"
                          referrerPolicy="no-referrer"
                        />
                        <div className="text-center flex-1 px-4">
                          <h4 className="font-bold text-slate-900 uppercase text-[13px] tracking-wide leading-tight">NASKAH PERJANJIAN HIBAH DAERAH</h4>
                          <h5 className="font-extrabold text-slate-800 uppercase text-[12px] tracking-wide mt-1 leading-tight">PEMERINTAH PROVINSI NUSA TENGGARA BARAT</h5>
                        </div>
                        <img 
                          src={partai.logo || "https://images.unsplash.com/photo-1624996379697-f01d168b1a52?w=100&h=100&fit=crop&q=80"} 
                          alt="Logo Partai" 
                          className="w-16 h-16 object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <div className="text-center space-y-1">
                        <p className="font-extrabold uppercase">DENGAN</p>
                        <p className="font-bold uppercase text-[11px] tracking-wide text-slate-800">
                          {designation.full.toUpperCase()} {partai.nama.toUpperCase()}
                        </p>
                        <p className="font-bold uppercase text-[11px] text-slate-800">
                          PROVINSI NUSA TENGGARA BARAT
                        </p>
                        <p className="font-bold uppercase mt-2">TENTANG</p>
                        <p className="font-bold uppercase text-[10px] max-w-lg mx-auto leading-tight mt-1 text-slate-700">
                          PELAKSANAAN BESARAN BANTUAN KEUANGAN KEPADA PARTAI POLITIK UNTUK MENDUKUNG KEGIATAN PARTAI POLITIK DI WILAYAH PROVINSI NUSA TENGGARA BARAT
                        </p>
                        <p className="font-bold uppercase text-slate-800 mt-2">TAHUN {tahunAnggaran}</p>
                        
                        <div className="pt-3 font-sans text-[10px] text-slate-500 font-mono">
                          <p>Nomor: {noNphd}</p>
                          <p>Nomor: {noSk}</p>
                        </div>
                      </div>

                      {/* Body Text Page 1 */}
                      <div className="space-y-4 text-justify leading-relaxed text-[11px] pt-6">
                        <p>
                          Pada hari ini <span className="font-bold">{nphdDate}</span>, yang bertanda tangan di bawah ini :
                        </p>

                        <ol className="list-decimal pl-5 space-y-4">
                          <li>
                            <p>
                              <span className="font-bold">Drs. H. SURYA BAHARI, M.M.Pd.</span>, Jabatan Kepala Badan Kesatuan Bangsa dan Politik Dalam Negeri Provinsi Nusa Tenggara Barat, beralamat di Jalan Pendidikan No.2, Kota Mataram Provinsi Nusa Tenggara Barat, bertindak dalam jabatannya untuk dan atas nama Pemerintah Provinsi Nusa Tenggara Barat sebagai Pemberi Hibah, selanjutnya disebut <span className="font-bold">PIHAK KESATU</span>.
                            </p>
                          </li>
                          <li>
                            <p>
                              <span className="font-bold">{partai.ketua}</span>, Jabatan Ketua {designation.full} {partai.nama} ({partai.singkatan}) Provinsi Nusa Tenggara Barat, beralamat di {partai.alamatKantor}, bertindak dalam jabatannya untuk dan atas nama {designation.full} {partai.nama} ({partai.singkatan}) Provinsi Nusa Tenggara Barat sebagai Penerima Dana Bantuan Keuangan Partai Politik, selanjutnya disebut <span className="font-bold">PIHAK KEDUA</span>.
                            </p>
                          </li>
                        </ol>
                      </div>
                    </div>
                    {/* Page Footer */}
                    <div className="flex justify-between items-center text-[9px] text-slate-400 font-sans border-t pt-2 mt-8">
                      <span>Naskah Perjanjian Hibah Daerah (NPHD) &bull; {partai.singkatan} &bull; TA {tahunAnggaran}</span>
                      <span>Halaman 1 dari 6</span>
                    </div>
                  </div>

                  {/* Page 2 */}
                  <div className={a4PageClass}>
                    <div className="space-y-4">
                      <p className="font-bold uppercase text-[11px] text-slate-800 border-b pb-1">Berdasarkan :</p>
                      <ol className="list-decimal pl-5 space-y-3 text-[10px] text-slate-700 leading-relaxed text-justify">
                        <li>
                          Undang-Undang Nomor 23 Tahun 2014 tentang Pemerintahan Daerah (Lembaran Negara Republik Indonesia Tahun 2014 Nomor 244, Tambahan Lembaran Negara Republik Indonesia Nomor 5587) sebagaimana telah beberapa kali diubah, terakhir dengan Undang-Undang Nomor 9 Tahun 2015 tentang Perubahan Kedua atas Undang-Undang Nomor 23 Tahun 2014 tentang Pemerintahan Daerah (Lembaran Negara Republik Indonesia Tahun 2015 Nomor 58, Tambahan Lembaran Negara Republik Indonesia Nomor 5679).
                        </li>
                        <li>
                          Undang-Undang Nomor 20 Tahun 2022 tentang Provinsi Nusa Tenggara Barat (Lembaran Negara Republik Indonesia Tahun 2022 Nomor 163).
                        </li>
                        <li>
                          Peraturan Pemerintah Nomor 2 Tahun 2012 tentang Hibah Daerah (Lembaran Negara Republik Indonesia Tahun 2012 Nomor 5, Tambahan Lembaran Negara Republik Indonesia Nomor 5272).
                        </li>
                        <li>
                          Peraturan Pemerintah Nomor 12 Tahun 2019 tentang Pengelolaan Keuangan Daerah (Lembaran Negara Republik Indonesia Tahun 2019 Nomor 42, Tambahan Lembaran Negara Republik Indonesia Nomor 6322).
                        </li>
                        <li>
                          Peraturan Presiden Nomor 46 Tahun 2025 tentang Perubahan Kedua atas Peraturan Presiden Nomor 16 Tahun 2018 tentang Pengadaan Barang atau Jasa Pemerintah (Lembaran Negara Republik Indonesia Tahun 2021 Nomor 63).
                        </li>
                        <li>
                          Peraturan Menteri Keuangan Nomor 99/PMK.05/2017 tentang Administrasi Pengelolaan Hibah (Berita Negara Republik Indonesia Tahun 2017 Nomor 990).
                        </li>
                        <li>
                          Peraturan Menteri Keuangan Nomor 183/PMK.05/2019 tentang Pengelolaan Rekening Pengeluaran Milik Kementerian Negara/Lembaga (Berita Negara Republik Indonesia Tahun 2019 Nomor 1549).
                        </li>
                        <li>
                          Peraturan Menteri Dalam Negeri Nomor 77 Tahun 2020 tentang Pedoman Teknis Pengelolaan Keuangan Daerah (Berita Negara Republik Indonesia Tahun 2020 Nomor 1781).
                        </li>
                        <li>
                          Peraturan Menteri Keuangan Nomor 201/PMK.05/2021 tentang Sistem Akuntansi Hibah (Berita Negara Republik Indonesia Tahun 2021 Nomor 1454).
                        </li>
                      </ol>
                    </div>
                    {/* Page Footer */}
                    <div className="flex justify-between items-center text-[9px] text-slate-400 font-sans border-t pt-2 mt-8">
                      <span>Naskah Perjanjian Hibah Daerah (NPHD) &bull; {partai.singkatan} &bull; TA {tahunAnggaran}</span>
                      <span>Halaman 2 dari 6</span>
                    </div>
                  </div>

                  {/* Page 3 */}
                  <div className={a4PageClass}>
                    <div className="space-y-4">
                      <ol className="list-decimal pl-5 space-y-3 text-[10px] text-slate-700 leading-relaxed text-justify" start={10}>
                        <li>
                          Peraturan Gubernur Provinsi Nusa Tenggara Barat Nomor 50 Tahun 2024 tentang Perubahan Kedua Atas Peraturan Gubernur Nusa Tenggara Barat Nomor 18 Tahun 2021 tentang Pedoman Pengelolaan Belanja Hibah dan Bantuan Sosial yang bersumber dari Anggaran Pendapatan Belanja Daerah.
                        </li>
                        <li>
                          Keputusan Gubernur Nusa Tenggara Barat Nomor : 100.3.3.1 - 124 Tahun {tahunAnggaran} tentang Besaran Bantuan Keuangan Kepada Partai Politik yang mendapatkan kursi di Dewan Perwakilan Rakyat Daerah Provinsi Nusa Tenggara Barat Hasil Pemilu Tahun 2024, Tahun Anggaran {tahunAnggaran}.
                        </li>
                      </ol>

                      <p className="text-[11px] text-slate-800 leading-relaxed text-justify pt-2">
                        PIHAK KESATU dan PIHAK KEDUA selanjutnya secara bersama-sama disebut <span className="font-bold">PARA PIHAK</span>, terlebih dahulu menerangkan hal-hal sebagai berikut:
                      </p>
                      <ul className="list-[lower-alpha] pl-5 space-y-3 text-[10px] text-slate-700 leading-relaxed text-justify">
                        <li>
                          Bahwa <span className="font-semibold">PIHAK KESATU</span> sebagai unsur penyelenggara urusan Pemerintah Daerah memberikan Bantuan Keuangan Partai Politik kepada <span className="font-semibold">PIHAK KEDUA</span> sebagai unsur pendukung Kegiatan Partai Politik {designation.full} {partai.nama} di Wilayah Provinsi Nusa Tenggara Barat Tahun {tahunAnggaran} yang bersumber dari Anggaran Pendapatan dan Belanja Daerah Provinsi Nusa Tenggara Barat Tahun Anggaran {tahunAnggaran};
                        </li>
                        <li>
                          Bahwa Bantuan Keuangan Partai Politik dari PIHAK KESATU kepada PIHAK KEDUA sebagaimana dimaksud dalam huruf a, diberikan dalam bentuk uang yang diperuntukan dalam rangka mendukung Kegiatan Partai Politik Dewan Pimpinan Wilayah/Daerah {partai.nama} ({partai.singkatan}) di Wilayah Provinsi Nusa Tenggara Barat Tahun {tahunAnggaran} yang bersumber dari Anggaran Pendapatan dan Belanja Daerah Provinsi Nusa Tenggara Barat Tahun Anggaran {tahunAnggaran};
                        </li>
                      </ul>

                      <p className="text-[11px] text-slate-800 text-justify pt-2">
                        Berdasarkan hal-hal tersebut di atas, PARA PIHAK sepakat melakukan Perjanjian Hibah Daerah dengan ketentuan dan syarat-syarat sebagai berikut:
                      </p>

                      <div className="pt-2">
                        <p className="font-bold text-center text-slate-900">Pasal 1</p>
                        <p className="font-bold text-center text-[10px] uppercase text-slate-700">Jumlah dan Sumber Pembiayaan Hibah</p>
                        <p className="text-[10px] text-slate-700 text-justify leading-relaxed mt-2">
                          (1) <span className="font-semibold">PIHAK KESATU</span> memberikan Bantuan Keuangan Partai Politik kepada <span className="font-semibold">PIHAK KEDUA</span>, dan PIHAK KEDUA menerima Bantuan Keuangan bagi Partai Politik yang Mendapatkan Kursi di Dewan Perwakilan Rakyat Daerah Provinsi Nusa Tenggara Barat Hasil Pemilihan Umum Tahun {partai.tahunPemilu} Tahun Anggaran {tahunAnggaran} dari PIHAK KESATU sebesar <span className="font-bold">Rp {formattedNominal},- ({nominalTerbilang})</span>.
                        </p>
                        <p className="text-[10px] text-slate-700 text-justify leading-relaxed mt-1">
                          (2) Pemberian Bantuan Keuangan Partai Politik sebagaimana dimaksud pada ayat (1), bersumber dari Anggaran Pendapatan dan Belanja Daerah Provinsi Nusa Tenggara Barat Tahun Anggaran {tahunAnggaran}.
                        </p>
                      </div>
                    </div>
                    {/* Page Footer */}
                    <div className="flex justify-between items-center text-[9px] text-slate-400 font-sans border-t pt-2 mt-8">
                      <span>Naskah Perjanjian Hibah Daerah (NPHD) &bull; {partai.singkatan} &bull; TA {tahunAnggaran}</span>
                      <span>Halaman 3 dari 6</span>
                    </div>
                  </div>

                  {/* Page 4 */}
                  <div className={a4PageClass}>
                    <div className="space-y-4">
                      <div>
                        <p className="font-bold text-center text-slate-900">Pasal 2</p>
                        <p className="font-bold text-center text-[10px] uppercase text-slate-700">Penggunaan Hibah</p>
                        <p className="text-[10px] text-slate-700 text-justify leading-relaxed mt-2">
                          (1) Bantuan Keuangan Partai Politik dari PIHAK KESATU kepada PIHAK KEDUA sebagaimana dimaksud dalam Pasal 1, dipergunakan oleh PIHAK KEDUA untuk membiayai pelaksanaan dan/atau Mendukung Kegiatan Partai Politik, Dewan Pimpinan Wilayah/Daerah {partai.nama} di Wilayah Provinsi Nusa Tenggara Barat Tahun {tahunAnggaran} yang bersumber dari Anggaran Pendapatan dan Belanja Daerah Provinsi Nusa Tenggara Barat Tahun Anggaran {tahunAnggaran}.
                        </p>
                        <p className="text-[10px] text-slate-700 text-justify leading-relaxed mt-1">
                          (2) Penggunaan Bantuan Keuangan Partai Politik sebagaimana dimaksud pada ayat (1), dituangkan dalam Rincian Kebutuhan Biaya PIHAK KEDUA sebagaimana tercantum dalam Lampiran yang tidak terpisahkan dari Naskah Perjanjian Hibah Daerah ini.
                        </p>
                      </div>

                      <div className="pt-2">
                        <p className="font-bold text-center text-slate-900">Pasal 3</p>
                        <p className="font-bold text-center text-[10px] uppercase text-slate-700">Hak dan Kewajiban</p>
                        
                        <p className="text-[10px] text-slate-700 text-justify leading-relaxed mt-2">
                          (1) <span className="font-semibold">Hak PIHAK KESATU</span>:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 text-[10px] text-slate-600 leading-relaxed text-justify">
                          <li>Menerima laporan penggunaan Belanja Bantuan Keuangan Partai Politik, Dewan Pimpinan Wilayah/Daerah {partai.nama} di Wilayah Provinsi Nusa Tenggara Barat Tahun {tahunAnggaran} yang bersumber dari Anggaran Pendapatan dan Belanja Daerah Provinsi Nusa Tenggara Barat Tahun Anggaran {tahunAnggaran} dari PIHAK KEDUA;</li>
                          <li>Menerima Rincian Kebutuhan Biaya yang telah disepakati dari PIHAK KEDUA; dan</li>
                          <li>Menerima hasil kesepakatan usulan perubahan Rincian Kebutuhan Biaya dari PIHAK KEDUA apabila terjadi perubahan Rincian Kebutuhan Biaya dari yang telah disepakati.</li>
                        </ul>

                        <p className="text-[10px] text-slate-700 text-justify leading-relaxed mt-2">
                          (2) <span className="font-semibold">Kewajiban PIHAK KESATU</span>:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 text-[10px] text-slate-600 leading-relaxed text-justify">
                          <li>Menjamin ketersediaan anggaran;</li>
                          <li>Mencairkan Dana Bantuan Keuangan Partai Politik sesuai dengan mekanisme pencairan;</li>
                        </ul>

                        <p className="text-[10px] text-slate-700 text-justify leading-relaxed mt-2">
                          (3) <span className="font-semibold">Hak PIHAK KEDUA</span> yaitu menggunakan Dana Bantuan Keuangan Partai Politik sebagaimana dimaksud dalam Pasal 2 dari PIHAK KESATU.
                        </p>
                      </div>
                    </div>
                    {/* Page Footer */}
                    <div className="flex justify-between items-center text-[9px] text-slate-400 font-sans border-t pt-2 mt-8">
                      <span>Naskah Perjanjian Hibah Daerah (NPHD) &bull; {partai.singkatan} &bull; TA {tahunAnggaran}</span>
                      <span>Halaman 4 dari 6</span>
                    </div>
                  </div>

                  {/* Page 5 */}
                  <div className={a4PageClass}>
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] text-slate-700 text-justify leading-relaxed">
                          (4) <span className="font-semibold">Kewajiban PIHAK KEDUA</span>:
                        </p>
                        <ul className="list-[lower-alpha] pl-5 space-y-2 text-[10px] text-slate-600 leading-relaxed text-justify mt-1">
                          <li>Menandatangani Pakta Integritas yang menyatakan bahwa Dana Bantuan Keuangan Partai Politik yang diterima akan digunakan sesuai dengan Naskah Perjanjian Hibah Daerah;</li>
                          <li>Melaksanakan penatausahaan penggunaan Dana Bantuan Keuangan Partai Politik Daerah sesuai dengan ketentuan peraturan perundang-undangan;</li>
                          <li>Dalam hal terjadinya perubahan Rincian Kebutuhan Biaya yang telah disepakati menjadi lampiran tidak terpisahkan dalam Naskah Perjanjian Hibah ini, PIHAK KEDUA wajib mengusulkan perubahan dimaksud kepada PIHAK KESATU yang Selanjutnya akan dibahas dan dituangkan dalam Berita Acara sebagaimana diatur dalam peraturan perundang-undangan;</li>
                          <li>Melaksanakan pengadaan barang dan jasa sesuai dengan ketentuan peraturan perundang-undangan yang berlaku dan menyimpan bukti-bukti transaksi terkait dengan program dan kegiatan yang didanai dari Dana Bantuan Keuangan Partai Politik;</li>
                          <li>Mempertanggungjawabkan atas Dana Bantuan Keuangan Partai Politik yang dikelola sebagaimana dimaksud dalam Pasal 1 dan Pasal 2; dan</li>
                          <li>Mengembalikan sisa Dana Bantuan Keuangan Partai Politik Kegiatan Partai Politik, Dewan Pimpinan Wilayah/Daerah {partai.nama} di Wilayah Provinsi Nusa Tenggara Barat Tahun {tahunAnggaran} yang bersumber dari Anggaran Pendapatan dan Belanja Daerah Provinsi Nusa Tenggara Barat Tahun Anggaran {tahunAnggaran} paling lambat tanggal 31 Desember {tahunAnggaran} kepada PIHAK KESATU melalui Kas Daerah Provinsi Nusa Tenggara Barat.</li>
                        </ul>
                      </div>

                      <div className="pt-2">
                        <p className="font-bold text-center text-slate-900">Pasal 4</p>
                        <p className="font-bold text-center text-[10px] uppercase text-slate-700">Mekanisme Pencairan Dana Hibah</p>
                        <p className="text-[10px] text-slate-700 text-justify leading-relaxed mt-2">
                          (1) Pencairan Belanja Bantuan Keuangan Partai Politik dari PIHAK KESATU kepada PIHAK KEDUA dilakukan dengan cara ditransfer langsung dari Kas Daerah Pemerintah Provinsi Nusa Tenggara Barat ke rekening PIHAK KEDUA.
                        </p>
                        <p className="text-[10px] text-slate-700 text-justify leading-relaxed mt-1">
                          (2) Transfer Dana Bantuan Keuangan Partai Politik sebagaimana dimaksud pada ayat (1), dilakukan setelah PIHAK KEDUA mengajukan permohonan kepada PIHAK KESATU melalui Kepala Badan Kesatuan Bangsa dan Politik Dalam Negeri Provinsi Nusa Tenggara Barat dengan melampirkan fotokopi NPHD, Pakta Integritas, Surat Pertanggungjawaban Mutlak, fotokopi rekening bank, dan kuitansi rangkap 3 asli bermaterai cukup.
                        </p>
                      </div>

                      <div className="pt-2">
                        <p className="font-bold text-center text-slate-900">Pasal 5</p>
                        <p className="font-bold text-center text-[10px] uppercase text-slate-700">Pertanggungjawaban dan Pelaporan</p>
                        <p className="text-[10px] text-slate-700 text-justify leading-relaxed mt-2">
                          (1) PIHAK KEDUA bertanggungjawab sepenuhnya atas penggunaan uang yang dihibahkan oleh PIHAK KESATU melalui Kepala Badan Kesatuan Bangsa dan Politik Dalam Negeri Provinsi Nusa Tenggara Barat sebagaimana dimaksud dalam Pasal 1 dan Pasal 2.
                        </p>
                        <p className="text-[10px] text-slate-700 text-justify leading-relaxed mt-1">
                          (2) PIHAK KEDUA membuat laporan penggunaan Dana Bantuan Keuangan Partai Politik sebagaimana dimaksud pada ayat (1), dilakukan paling lambat pada tanggal 10 Januari 2027 kepada PIHAK PERTAMA (PIHAK KESATU).
                        </p>
                      </div>

                      <div className="pt-2">
                        <p className="font-bold text-center text-slate-900">Pasal 6</p>
                        <p className="font-bold text-center text-[10px] uppercase text-slate-700">Jangka Waktu</p>
                        <p className="text-[10px] text-slate-700 text-justify leading-relaxed mt-2">
                          Perjanjian hibah ini berlaku terhitung sejak Naskah Perjanjian Hibah Daerah ditandatangani sampai dengan Bulan Desember tahun Anggaran {tahunAnggaran}.
                        </p>
                      </div>
                    </div>
                    {/* Page Footer */}
                    <div className="flex justify-between items-center text-[9px] text-slate-400 font-sans border-t pt-2 mt-8">
                      <span>Naskah Perjanjian Hibah Daerah (NPHD) &bull; {partai.singkatan} &bull; TA {tahunAnggaran}</span>
                      <span>Halaman 5 dari 6</span>
                    </div>
                  </div>

                  {/* Page 6 */}
                  <div className={a4PageClass}>
                    <div className="space-y-3.5">
                      <div>
                        <p className="font-bold text-center text-slate-900 text-[11px]">Pasal 7</p>
                        <p className="font-bold text-center text-[9px] uppercase text-slate-700">Keadaan Kahar (Force Majeure)</p>
                        <p className="text-[9.5px] text-slate-700 text-justify leading-relaxed mt-1">
                          (1) Keadaankahar (force majeure) antara lain termasuk kebakaran, ledakan, gempa bumi, topan, hujan badai, banjir, wabah dan bencana lainnya, makar, huru-hara, perang, perselisihan, buruh, pemogokan, kebijakan pemerintah (moneter) berpengaruh langsung pada pelaksanaan perjanjian ini.
                        </p>
                        <p className="text-[9.5px] text-slate-700 text-justify leading-relaxed mt-0.5">
                          (2) Tidak satu pun Pihak dikenai tanggung jawab untuk memenuhi kewajiban berdasarkan perjanjian ini sepanjang hal tersebut terhalangi, tercegah atau tertunda pelaksanaannya oleh keadaan kahar (force majeure).
                        </p>
                        <p className="text-[9.5px] text-slate-700 text-justify leading-relaxed mt-0.5">
                          (3) Dalam jangka waktu paling lambat 7 (tujuh) hari sejak terjadinya keadaan kahar (force majeure), pihak yang terkena keadaan kahar (force majeure) membuat atau menyampaikan pemberitahuan tertulis kepada pihak yang tidak terkena dengan menerangkan keadaan kahar (force majeure) tersebut.
                        </p>
                      </div>

                      <div>
                        <p className="font-bold text-center text-slate-900 text-[11px]">Pasal 8</p>
                        <p className="font-bold text-center text-[9px] uppercase text-slate-700">Penyelesaian Perselisihan</p>
                        <p className="text-[9.5px] text-slate-700 text-justify leading-relaxed mt-1">
                          Apabila dalam pelaksanaan Perjanjian ini terjadi perselisihan atau perbedaan pendapat diantara PARA PIHAK, PARA PIHAK sepakat untuk menyelesaikan perselisihan melalui jalan musyawarah untuk mencapai mufakat.
                        </p>
                      </div>

                      <div>
                        <p className="font-bold text-center text-slate-900 text-[11px]">Pasal 9</p>
                        <p className="font-bold text-center text-[9px] uppercase text-slate-700">Lain-Lain</p>
                        <p className="text-[9.5px] text-slate-700 text-justify leading-relaxed mt-1">
                          (1) Apabila sampai dengan berakhirnya kegiatan Partai Politik Pada Tahun Anggaran {tahunAnggaran} masih terdapat sisa Dana Bantuan Keuangan Partai Politik pada PIHAK KEDUA, PIHAK KEDUA wajib menyetorkan sepenuhnya ke Kas Umum Daerah Pemerintahan Provinsi Nusa Tenggara Barat melalui Rekening Kas Umum Daerah Nomor 001.21.05807.00-6 pada PT. Bank NTB Syariah Kantor Cabang Utama Pejanggik.
                        </p>
                        <p className="text-[9.5px] text-slate-700 text-justify leading-relaxed mt-0.5">
                          (2) Dalam hal pengelolaan Rekening Bantuan Keuangan Partai Politik pada PIHAK KEDUA diperoleh Jasa Giro/Bunga, PIHAK KEDUA berkewajiban menyetorkan Jasa Giro ke Kas Negara.
                        </p>
                      </div>

                      <div>
                        <p className="font-bold text-center text-slate-900 text-[11px]">Pasal 10</p>
                        <p className="font-bold text-center text-[9px] uppercase text-slate-700">Perubahan (Addendum)</p>
                        <p className="text-[9.5px] text-slate-700 text-justify leading-relaxed mt-1">
                          (1) Hal-hal yang belum diatur dalam perjanjian Hibah ini akan diatur lebih lanjut sesuai dengan kesepakatan PARA PIHAK.
                          (2) Apabila terjadi perubahan maupun penambahan akan diatur lebih lanjut dalam Addendum Perjanjian yang merupakan bagian tidak terpisahkan dari perjanjian ini.
                        </p>
                      </div>

                      <div>
                        <p className="font-bold text-center text-slate-900 text-[11px]">Pasal 11</p>
                        <p className="font-bold text-center text-[9px] uppercase text-slate-700">Penutup</p>
                        <p className="text-[9.5px] text-slate-700 text-justify leading-relaxed mt-1">
                          Demikian Perjanjian Hibah Daerah ini dibuat dalam rangkap 2 (dua) bermaterai cukup, ditandatangani oleh para pihak dan masing-masing mempunyai kekuatan hukum yang sama.
                        </p>
                      </div>

                      {/* Signatures Row */}
                      <div className="grid grid-cols-2 gap-4 pt-4 text-center text-[10px] leading-snug">
                        <div className="space-y-12">
                          <p className="font-bold uppercase text-slate-800">PIHAK KEDUA<br/>{designation.full}<br/>{partai.nama}</p>
                          <div>
                            <p className="font-bold underline text-slate-900">{partai.ketua}</p>
                            <p className="text-slate-500 text-[9px]">Ketua {designation.short} {partai.singkatan} Provinsi NTB</p>
                          </div>
                        </div>
                        <div className="space-y-12">
                          <p className="font-bold uppercase text-slate-800">PIHAK KESATU<br/>Kepala Badan Kesatuan Bangsa dan<br/>Politik Dalam Negeri Provinsi NTB</p>
                          <div>
                            <p className="font-bold underline text-slate-900">Drs. H. SURYA BAHARI, M.M.Pd.</p>
                            <p className="text-slate-500 text-[9px]">Pembina Utama Madya - IV/d</p>
                            <p className="text-slate-400 font-mono text-[8px]">NIP. 19680219 198811 1 001</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Page Footer */}
                    <div className="flex justify-between items-center text-[9px] text-slate-400 font-sans border-t pt-2 mt-4">
                      <span>Naskah Perjanjian Hibah Daerah (NPHD) &bull; {partai.singkatan} &bull; TA {tahunAnggaran}</span>
                      <span>Halaman 6 dari 6</span>
                    </div>
                  </div>
                </div>
              )}

              {/* DOCUMENT 2: SPTJM (Surat Pernyataan Tanggung Jawab Mutlak) */}
              {activeDoc === 'SPTJM' && (
                <div className={a4PageClass}>
                  <div>
                    {/* Letter Header */}
                    <div className="text-center border-b-2 border-slate-900 pb-4">
                      <img 
                        src={partai.logo || "https://images.unsplash.com/photo-1624996379697-f01d168b1a52?w=100&h=100&fit=crop&q=80"} 
                        alt="Logo Partai" 
                        className="w-16 h-16 object-contain mx-auto mb-2"
                        referrerPolicy="no-referrer"
                      />
                      <h4 className="font-extrabold uppercase text-slate-800 text-[13px] tracking-wide">
                        {designation.full.toUpperCase()} {partai.nama.toUpperCase()}
                      </h4>
                      <h5 className="font-bold uppercase text-slate-700 text-xs tracking-wide">
                        PROVINSI NUSA TENGGARA BARAT
                      </h5>
                      <p className="text-[9px] text-slate-400 font-sans font-medium mt-1">
                        Alamat: {partai.alamatKantor} &bull; Tlp: {partai.nomorTelepon} &bull; Email: {partai.email}
                      </p>
                    </div>

                    <div className="text-center space-y-1 mt-4">
                      <h5 className="font-extrabold underline text-sm tracking-wide text-slate-900 uppercase">
                        SURAT PERNYATAAN TANGGUNGJAWAB MUTLAK
                      </h5>
                      <p className="font-mono text-[10px] text-slate-500">Nomor: {noSptjm}</p>
                    </div>

                    <div className="space-y-4 text-justify leading-relaxed text-[11px] mt-6">
                      <p>Yang bertanda tangan di bawah ini :</p>
                      
                      <table className="w-full border-0 ml-4 font-sans text-[11px] leading-relaxed">
                        <tbody>
                          <tr>
                            <td className="w-24 font-bold py-1 text-slate-500">Nama</td>
                            <td className="w-4">:</td>
                            <td className="font-bold text-slate-800">{partai.ketua}</td>
                          </tr>
                          <tr>
                            <td className="font-bold py-1 text-slate-500">Jabatan</td>
                            <td>:</td>
                            <td className="font-bold text-slate-800">Ketua {designation.short} {partai.nama} Provinsi NTB</td>
                          </tr>
                          <tr>
                            <td className="font-bold py-1 text-slate-500">Alamat Kantor</td>
                            <td>:</td>
                            <td>{partai.alamatKantor}</td>
                          </tr>
                        </tbody>
                      </table>

                      <p className="mt-4">
                        Bertindak sebagai Ketua {designation.short} {partai.nama} Provinsi NTB, dengan ini menyatakan dengan sesungguhnya bahwa saya bertanggungjawab penuh atas pencairan dan penggunaan Bantuan Keuangan bagi Partai Politik yang Mendapatkan Kursi di Dewan Perwakilan Rakyat Daerah Provinsi Nusa Tenggara Barat Hasil Pemilihan Umum Tahun {partai.tahunPemilu} Tahun Anggaran {tahunAnggaran} sebesar <span className="font-bold">Rp {formattedNominal},- ({nominalTerbilang})</span>.
                      </p>

                      <p>
                        Apabila dikemudian hari atas pencairan dan penggunaan dana bantuan keuangan diatas mengakibatkan terjadinya kerugian Negara, maka kami bersedia untuk mengembalikan kepada Kas Negara / Kas Daerah sesuai dengan peraturan perundang-undangan yang berlaku.
                      </p>

                      <p>
                        Bukti-bukti pengeluaran terkait dengan penggunaan dana bantuan keuangan tersebut disimpan sesuai ketentuan pada satuan kerja kami untuk kelengkapan administrasi dan keperluan pemeriksaan aparat pengawas Fungsional.
                      </p>

                      <p>
                        Demikian surat pernyataan ini dibuat dengan sesungguhnya dan penuh tanggung jawab.
                      </p>
                    </div>

                    <div className="pt-12 flex justify-end">
                      <div className="text-center w-64 text-[11px] space-y-16">
                        <p>Mataram, {sptjmDate}</p>
                        <div>
                          <p className="font-bold underline">{partai.ketua}</p>
                          <p className="font-bold font-sans text-[10px] text-slate-500 uppercase mt-0.5">Ketua {designation.short} {partai.singkatan} NTB</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Page Footer */}
                  <div className="flex justify-between items-center text-[9px] text-slate-400 font-sans border-t pt-2 mt-4">
                    <span>Surat Pernyataan Tanggung Jawab Mutlak (SPTJM) &bull; {partai.singkatan} &bull; TA {tahunAnggaran}</span>
                    <span>Halaman 1 dari 1</span>
                  </div>
                </div>
              )}

              {/* DOCUMENT 3: BAP (Berita Acara Pembayaran) */}
              {activeDoc === 'BAP' && (
                <div className={a4PageClass}>
                  <div>
                    {/* Government Header */}
                    <div className="text-center border-b-2 border-double border-slate-800 pb-3">
                      <h4 className="text-[13px] font-extrabold tracking-wide uppercase text-slate-800 leading-tight">PEMERINTAH PROVINSI NUSA TENGGARA BARAT</h4>
                      <h5 className="text-[11px] font-bold tracking-wide uppercase mt-0.5 text-slate-700">BADAN KESATUAN BANGSA DAN POLITIK DALAM NEGERI</h5>
                      <p className="text-[9px] text-slate-500 font-sans font-medium mt-1">Jl. Pendidikan No. 2 Mataram &bull; Tlp. (0370) 7505330 &bull; Website: http://bakesbangpoldagri.ntbprov.go.id</p>
                    </div>

                    <div className="text-center space-y-1 pt-2">
                      <h5 className="font-extrabold underline text-xs tracking-wide text-slate-900 uppercase">
                        BERITA ACARA PEMBAYARAN
                      </h5>
                      <p className="font-mono text-[9px] text-slate-500">Nomor: {noBap}</p>
                    </div>

                    <div className="space-y-4 text-justify leading-relaxed text-[11px] mt-4">
                      <p>
                        Pada hari ini <span className="font-bold">{bapDate}</span>, kami yang bertanda tangan di bawah ini :
                      </p>

                      <ol className="list-decimal pl-5 space-y-3">
                        <li>
                          <p>
                            <span className="font-bold">Drs. H. SURYA BAHARI, M.M.Pd</span>, NIP. 19680219 198811 1 001, Jabatan Kepala Badan Kesatuan Bangsa dan Politik Dalam Negeri Provinsi Nusa Tenggara Barat, beralamat di Jl. Pendidikan No. 2 Mataram, selanjutnya disebut sebagai <span className="font-bold">PIHAK PERTAMA</span>.
                          </p>
                        </li>
                        <li>
                          <p>
                            <span className="font-bold">{partai.ketua}</span>, Jabatan Ketua {designation.short} {partai.nama} Provinsi NTB, beralamat di {partai.alamatKantor}, selanjutnya disebut sebagai <span className="font-bold">PIHAK KEDUA</span>.
                          </p>
                        </li>
                      </ol>

                      <p>
                        PIHAK PERTAMA telah membayar Besaran Bantuan Keuangan bagi Partai Politik yang Mendapatkan Kursi di Dewan Perwakilan Rakyat Daerah Provinsi Nusa Tenggara Barat Hasil Pemilihan Umum Tahun {partai.tahunPemilu} Tahun Anggaran {tahunAnggaran} kepada PIHAK KEDUA sebesar <span className="font-bold">Rp {formattedNominal},- ({nominalTerbilang})</span> sesuai dengan Rencana Anggaran Biaya, dan PIHAK KEDUA menerima pembayaran dari PIHAK PERTAMA sejumlah tersebut diatas melalui pemindahbukuan dari Rekening Kas Umum Daerah Provinsi Nusa Tenggara Barat ke Rekening Bank PIHAK KEDUA dengan Nomor Rekening <span className="font-bold font-mono text-emerald-800">{partai.nomorRekening}</span> pada Bank <span className="font-bold">{partai.namaBank}</span>.
                      </p>

                      <p>
                        Demikian Berita Acara Pembayaran ini dibuat dengan sebenarnya untuk dapat digunakan sebagaimana mestinya.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-10 text-center text-[11px]">
                      <div className="space-y-16">
                        <p className="font-bold uppercase">PIHAK KEDUA</p>
                        <div>
                          <p className="font-bold underline">{partai.ketua}</p>
                          <p className="text-slate-500 font-sans text-[10px]">Ketua {designation.short} {partai.singkatan} NTB</p>
                        </div>
                      </div>
                      <div className="space-y-16">
                        <p className="font-bold uppercase">PIHAK PERTAMA</p>
                        <div>
                          <p className="font-bold underline">Drs. H. SURYA BAHARI, M.M.Pd</p>
                          <p className="text-slate-500 font-sans text-[10px]">Kepala Bakesbangpoldagri Prov. NTB</p>
                          <p className="text-slate-400 font-mono text-[9px]">NIP. 19680219 198811 1 001</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Page Footer */}
                  <div className="flex justify-between items-center text-[9px] text-slate-400 font-sans border-t pt-2 mt-4">
                    <span>Berita Acara Pembayaran (BAP) &bull; {partai.singkatan} &bull; TA {tahunAnggaran}</span>
                    <span>Halaman 1 dari 1</span>
                  </div>
                </div>
              )}

              {/* DOCUMENT 4: KUITANSI */}
              {activeDoc === 'KUITANSI' && (
                <div className={a4PageClass}>
                  <div>
                    {/* Top stamp mark info */}
                    <div className="flex justify-between items-start text-[9px] font-sans text-slate-500 font-medium">
                      <span className="font-bold tracking-wider text-slate-700">UNTUK PEMERINTAH</span>
                      <div className="text-right space-y-0.5">
                        <p>Lembar ke : 1,2,3,4,5,6,7</p>
                        <p>Kb. No. : _________________</p>
                        <p>Tanggal : {kuitansiDate}</p>
                        <p>Kode DPA : _________________</p>
                        <p>Kode SIMDA : _________________</p>
                      </div>
                    </div>

                    <div className="text-center py-2">
                      <h4 className="text-sm font-extrabold tracking-widest underline text-slate-900">K U I T A N S I</h4>
                    </div>

                    <table className="w-full border-collapse text-[11px] font-sans mt-2">
                      <tbody>
                        <tr className="border-b border-slate-100">
                          <td className="w-28 font-bold py-2 text-slate-500">Terima dari</td>
                          <td className="w-4 py-2">:</td>
                          <td className="py-2 text-slate-800">Kepala Badan Kesatuan Bangsa dan Politik Dalam Negeri Provinsi NTB.</td>
                        </tr>
                        <tr className="border-b border-slate-100">
                          <td className="font-bold py-2 text-slate-500">Banyaknya Uang</td>
                          <td className="py-2">:</td>
                          <td className="py-2 bg-slate-50 px-2 font-semibold text-slate-900 italic">== {nominalTerbilang} ==</td>
                        </tr>
                        <tr className="border-b border-slate-100">
                          <td className="font-bold py-2 text-slate-500">Untuk Keperluaan</td>
                          <td className="py-2">:</td>
                          <td className="py-2 text-slate-700 leading-normal">
                            Belanja Besaran Bantuan Keuangan bagi Partai Politik yang Mendapatkan Kursi di Dewan Perwakilan Rakyat Daerah Provinsi Nusa Tenggara Barat Hasil Pemilihan Umum Tahun {partai.tahunPemilu} Tahun Anggaran {tahunAnggaran} kepada {designation.short} {partai.nama} Provinsi Nusa Tenggara Barat dengan alamat {partai.alamatKantor}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-bold py-3 text-slate-500">TERBILANG</td>
                          <td className="py-3">:</td>
                          <td className="py-3 font-mono font-extrabold text-[12px] text-emerald-800 bg-emerald-50 px-3 rounded border border-emerald-100">
                            Rp. {formattedNominal} ,-
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    {/* Multiple signature rows as in original kuitansi page */}
                    <div className="grid grid-cols-3 gap-3 pt-6 text-center text-[10px] leading-relaxed font-sans font-medium">
                      <div>
                        <p>Mengetahui,</p>
                        <p className="font-bold uppercase text-[9px] text-slate-500">Pejabat Pelaksana Teknis Kegiatan (PPTK)</p>
                        <div className="h-12"></div>
                        <p className="font-bold underline">MUHAJIDIN, S.Pd., MM</p>
                        <p className="text-slate-400 text-[8px]">NIP. 19791101 200801 1 014</p>
                      </div>

                      <div>
                        <p>Lunas dibayar</p>
                        <p className="font-bold uppercase text-[9px] text-slate-500">Bendahara Pengeluaran,</p>
                        <div className="h-12"></div>
                        <p className="font-bold underline">LALU PURNAMADI ALAGA</p>
                        <p className="text-slate-400 text-[8px]">NIP. 19810115 200901 1 001</p>
                      </div>

                      <div>
                        <p>Mataram, {kuitansiDate}</p>
                        <p className="font-bold uppercase text-[9px] text-slate-500">Yang menerima uang,</p>
                        <div className="h-12"></div>
                        <p className="font-bold underline">{partai.ketua}</p>
                        <p className="text-slate-500 font-bold uppercase text-[8px]">Ketua {designation.short} {partai.singkatan}</p>
                      </div>
                    </div>

                    <div className="border-t border-slate-200 pt-3 mt-4 text-center">
                      <p className="text-[10px] font-sans">Mengetahui / Menyetujui :</p>
                      <p className="text-[9px] font-bold uppercase text-slate-500">Kepala Badan Kesatuan Bangsa dan Politik Dalam Negeri Provinsi NTB</p>
                      <div className="h-10"></div>
                      <p className="font-bold underline text-[11px]">Drs. H. SURYA BAHARI, M.M.Pd</p>
                      <p className="text-slate-400 text-[9px] font-mono">NIP. 19680219 198811 1 001 &bull; Pembina Utama Madya (IV/d)</p>
                    </div>
                  </div>
                  {/* Page Footer */}
                  <div className="flex justify-between items-center text-[9px] text-slate-400 font-sans border-t pt-2 mt-4">
                    <span>Kuitansi Pembayaran &bull; {partai.singkatan} &bull; TA {tahunAnggaran}</span>
                    <span>Halaman 1 dari 1</span>
                  </div>
                </div>
              )}

              {/* Dynamic printed watermark for preview only */}
              <div className="absolute bottom-4 right-4 text-[8px] text-slate-300 font-mono tracking-wider text-right no-print select-none">
                SIMBAKESBANGPOL PROV NTB &bull; DOKUMEN RESMI DIGITAL
              </div>

            </div>

          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-400">
            Sistem Informasi Dana Hibah Bantuan Partai Politik Provinsi NTB (SIMBAKESBANGPOL)
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-lg text-xs transition cursor-pointer"
            >
              Tutup
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-md transition flex items-center gap-1.5 text-xs cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              Cetak Dokumen
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
