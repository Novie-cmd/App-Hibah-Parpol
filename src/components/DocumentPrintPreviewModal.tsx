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
  const noNphd = hibah?.nomorNphd || `900/${partai.nomorUrut + 20}/NPHD-KESBANGPOL/${tahunAnggaran}`;
  const noSk = hibah?.nomorSk || `SK-GUBERNUR/100.3.3.1-${partai.nomorUrut + 100}/${tahunAnggaran}`;
  
  // Format dates elegantly
  const dateStr = hibah?.tanggalPenandatanganan 
    ? new Date(hibah.tanggalPenandatanganan).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : "Rabu, 24 Juni 2026";

  const shortDateStr = hibah?.tanggalPenandatanganan
    ? new Date(hibah.tanggalPenandatanganan).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
    : "Juni 2026";

  const formattedNominal = nominal.toLocaleString('id-ID');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      {/* Dynamic Style injection for print view */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
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
            padding: 2.5cm 2cm 2.5cm 2cm !important;
            border: none !important;
            box-shadow: none !important;
            background: white !important;
            color: black !important;
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
              className="bg-white max-w-[210mm] w-full p-[2cm] shadow-xl border border-slate-200 rounded-sm font-serif text-slate-900 select-none leading-relaxed text-xs relative"
              style={{ minHeight: '297mm' }}
            >
              
              {/* DOCUMENT 1: NPHD (Naskah Perjanjian Hibah Daerah) */}
              {activeDoc === 'NPHD' && (
                <div className="space-y-6">
                  {/* Title Header with Logos */}
                  <div className="flex justify-between items-center border-b pb-4 mb-4">
                    <img 
                      src={pengaturan.logoInstansi || "https://images.unsplash.com/photo-1624996379697-f01d168b1a52?w=100&h=100&fit=crop&q=80"} 
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
                      DEWAN PIMPINAN WILAYAH {partai.nama.toUpperCase()}
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

                  {/* Body Text */}
                  <div className="space-y-4 text-justify leading-relaxed text-[11px]">
                    <p>
                      Pada hari ini <span className="font-bold">{dateStr}</span>, yang bertanda tangan di bawah ini :
                    </p>

                    <ol className="list-decimal pl-5 space-y-4">
                      <li>
                        <p>
                          <span className="font-bold">Drs. H. SURYA BAHARI, M.M.Pd.</span>, Jabatan Kepala Badan Kesatuan Bangsa dan Politik Dalam Negeri Provinsi Nusa Tenggara Barat, beralamat di Jalan Pendidikan No.2, Kota Mataram Provinsi Nusa Tenggara Barat, bertindak dalam jabatannya untuk dan atas nama Pemerintah Provinsi Nusa Tenggara Barat sebagai Pemberi Hibah, selanjutnya disebut <span className="font-bold">PIHAK KESATU</span>.
                        </p>
                      </li>
                      <li>
                        <p>
                          <span className="font-bold">{partai.ketua}</span>, Jabatan Ketua Dewan Pimpinan Wilayah {partai.nama} ({partai.singkatan}) Provinsi Nusa Tenggara Barat, beralamat di {partai.alamatKantor}, bertindak dalam jabatannya untuk dan atas nama Dewan Pimpinan Wilayah {partai.nama} ({partai.singkatan}) Provinsi Nusa Tenggara Barat sebagai Penerima Dana Bantuan Keuangan Partai Politik, selanjutnya disebut <span className="font-bold">PIHAK KEDUA</span>.
                        </p>
                      </li>
                    </ol>

                    <p>
                      Berdasarkan :
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-[10px] text-slate-600">
                      <li>Undang-Undang Nomor 23 Tahun 2014 tentang Pemerintahan Daerah sebagaimana telah diubah beberapa kali, terakhir dengan Undang-Undang Nomor 9 Tahun 2015.</li>
                      <li>Undang-Undang Nomor 20 Tahun 2022 tentang Provinsi Nusa Tenggara Barat.</li>
                      <li>Peraturan Pemerintah Nomor 2 Tahun 2012 tentang Hibah Daerah.</li>
                      <li>Peraturan Pemerintah Nomor 12 Tahun 2019 tentang Pengelolaan Keuangan Daerah.</li>
                      <li>Peraturan Presiden Nomor 46 Tahun 2025 tentang Perubahan Kedua atas Peraturan Presiden Nomor 16 Tahun 2018 tentang Pengadaan Barang atau Jasa Pemerintah.</li>
                      <li>Keputusan Gubernur Nusa Tenggara Barat Nomor: 100.3.3.1 - 124 Tahun {tahunAnggaran} tentang Besaran Bantuan Keuangan Kepada Partai Politik yang mendapatkan kursi di Dewan Perwakilan Rakyat Daerah Provinsi Nusa Tenggara Barat.</li>
                    </ul>

                    <p className="pt-2 font-bold text-center">Pasal 1</p>
                    <p className="font-bold text-center text-[10px] -mt-3 uppercase">Jumlah dan Sumber Pembiayaan Hibah</p>
                    
                    <p>
                      (1) PIHAK KESATU memberikan Bantuan Keuangan Partai Politik kepada PIHAK KEDUA, dan PIHAK KEDUA menerima Bantuan Keuangan bagi Partai Politik yang Mendapatkan Kursi di Dewan Perwakilan Rakyat Daerah Provinsi Nusa Tenggara Barat Hasil Pemilihan Umum Tahun {partai.tahunPemilu} Tahun Anggaran {tahunAnggaran} dari PIHAK KESATU sebesar <span className="font-bold">Rp {formattedNominal},- ({nominalTerbilang})</span>.
                    </p>
                    <p>
                      (2) Pemberian Bantuan Keuangan Partai Politik sebagaimana dimaksud pada ayat (1), bersumber dari Anggaran Pendapatan dan Belanja Daerah Provinsi Nusa Tenggara Barat Tahun Anggaran {tahunAnggaran}.
                    </p>
                  </div>

                  {/* Signatures */}
                  <div className="grid grid-cols-2 gap-4 pt-12 text-center text-[11px]">
                    <div className="space-y-16">
                      <p className="font-bold uppercase">PIHAK KEDUA</p>
                      <div>
                        <p className="font-bold underline">{partai.ketua}</p>
                        <p className="text-slate-500 font-sans text-[10px]">Ketua {partai.singkatan} Provinsi NTB</p>
                      </div>
                    </div>
                    <div className="space-y-16">
                      <p className="font-bold uppercase">PIHAK KESATU</p>
                      <div>
                        <p className="font-bold underline">Drs. H. SURYA BAHARI, M.M.Pd.</p>
                        <p className="text-slate-500 font-sans text-[10px]">Kepala Bakesbangpoldagri Prov. NTB</p>
                        <p className="text-slate-400 font-mono text-[9px]">Pembina Utama Madya - IV/d</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* DOCUMENT 2: SPTJM (Surat Pernyataan Tanggung Jawab Mutlak) */}
              {activeDoc === 'SPTJM' && (
                <div className="space-y-8">
                  {/* Letter Header */}
                  <div className="text-center border-b-2 border-slate-900 pb-4">
                    <img 
                      src={partai.logo || "https://images.unsplash.com/photo-1624996379697-f01d168b1a52?w=100&h=100&fit=crop&q=80"} 
                      alt="Logo Partai" 
                      className="w-16 h-16 object-contain mx-auto mb-2"
                      referrerPolicy="no-referrer"
                    />
                    <h4 className="font-extrabold uppercase text-slate-800 text-[13px] tracking-wide">
                      DEWAN PIMPINAN WILAYAH PARTAI {partai.nama.toUpperCase()}
                    </h4>
                    <h5 className="font-bold uppercase text-slate-700 text-xs tracking-wide">
                      PROVINSI NUSA TENGGARA BARAT
                    </h5>
                    <p className="text-[9px] text-slate-400 font-sans font-medium mt-1">
                      Alamat: {partai.alamatKantor} &bull; Tlp: {partai.nomorTelepon} &bull; Email: {partai.email}
                    </p>
                  </div>

                  <div className="text-center space-y-1">
                    <h5 className="font-extrabold underline text-sm tracking-wide text-slate-900 uppercase">
                      SURAT PERNYATAAN TANGGUNGJAWAB MUTLAK
                    </h5>
                    <p className="font-mono text-[10px] text-slate-500">Nomor: {partai.nomorUrut + 10}/SPTJM/{partai.singkatan}/{tahunAnggaran}</p>
                  </div>

                  <div className="space-y-4 text-justify leading-relaxed text-[11px]">
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
                          <td className="font-bold text-slate-800">Ketua DPW {partai.nama} Provinsi NTB</td>
                        </tr>
                        <tr>
                          <td className="font-bold py-1 text-slate-500">Alamat Kantor</td>
                          <td>:</td>
                          <td>{partai.alamatKantor}</td>
                        </tr>
                      </tbody>
                    </table>

                    <p>
                      Bertindak sebagai Ketua Umum DPW {partai.nama} Provinsi NTB, dengan ini menyatakan dengan sesungguhnya bahwa saya bertanggungjawab penuh atas pencairan dan penggunaan Bantuan Keuangan bagi Partai Politik yang Mendapatkan Kursi di Dewan Perwakilan Rakyat Daerah Provinsi Nusa Tenggara Barat Hasil Pemilihan Umum Tahun {partai.tahunPemilu} Tahun Anggaran {tahunAnggaran} sebesar <span className="font-bold">Rp {formattedNominal},- ({nominalTerbilang})</span>.
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
                      <p>Mataram, {shortDateStr}</p>
                      <div>
                        <p className="font-bold underline">{partai.ketua}</p>
                        <p className="font-bold font-sans text-[10px] text-slate-500 uppercase mt-0.5">Ketua DPW {partai.singkatan} NTB</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* DOCUMENT 3: BAP (Berita Acara Pembayaran) */}
              {activeDoc === 'BAP' && (
                <div className="space-y-6">
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
                    <p className="font-mono text-[9px] text-slate-500">Nomor: 900/{partai.nomorUrut + 10}/BAP-KESBANGPOL/{tahunAnggaran}</p>
                  </div>

                  <div className="space-y-4 text-justify leading-relaxed text-[11px]">
                    <p>
                      Pada hari ini <span className="font-bold">{dateStr}</span>, kami yang bertanda tangan di bawah ini :
                    </p>

                    <ol className="list-decimal pl-5 space-y-3">
                      <li>
                        <p>
                          <span className="font-bold">Drs. H. SURYA BAHARI, M.M.Pd</span>, NIP. 19680219 198811 1 001, Jabatan Kepala Badan Kesatuan Bangsa dan Politik Dalam Negeri Provinsi Nusa Tenggara Barat, beralamat di Jl. Pendidikan No. 2 Mataram, selanjutnya disebut sebagai <span className="font-bold">PIHAK PERTAMA</span>.
                        </p>
                      </li>
                      <li>
                        <p>
                          <span className="font-bold">{partai.ketua}</span>, Jabatan Ketua DPW {partai.nama} Provinsi NTB, beralamat di {partai.alamatKantor}, selanjutnya disebut sebagai <span className="font-bold">PIHAK KEDUA</span>.
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
                        <p className="text-slate-500 font-sans text-[10px]">Ketua DPW {partai.singkatan} NTB</p>
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
              )}

              {/* DOCUMENT 4: KUITANSI */}
              {activeDoc === 'KUITANSI' && (
                <div className="space-y-5">
                  {/* Top stamp mark info */}
                  <div className="flex justify-between items-start text-[9px] font-sans text-slate-500 font-medium">
                    <span className="font-bold tracking-wider text-slate-700">UNTUK PEMERINTAH</span>
                    <div className="text-right space-y-0.5">
                      <p>Lembar ke : 1,2,3,4,5,6,7</p>
                      <p>Kb. No. : _________________</p>
                      <p>Tanggal : {shortDateStr}</p>
                      <p>Kode DPA : _________________</p>
                      <p>Kode SIMDA : _________________</p>
                    </div>
                  </div>

                  <div className="text-center py-2">
                    <h4 className="text-sm font-extrabold tracking-widest underline text-slate-900">K U I T A N S I</h4>
                  </div>

                  <table className="w-full border-collapse text-[11px] font-sans">
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
                          Belanja Besaran Bantuan Keuangan bagi Partai Politik yang Mendapatkan Kursi di Dewan Perwakilan Rakyat Daerah Provinsi Nusa Tenggara Barat Hasil Pemilihan Umum Tahun {partai.tahunPemilu} Tahun Anggaran {tahunAnggaran} kepada DPW/DPD {partai.nama} Provinsi Nusa Tenggara Barat dengan alamat {partai.alamatKantor}
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
                      <p>Mataram, {shortDateStr}</p>
                      <p className="font-bold uppercase text-[9px] text-slate-500">Yang menerima uang,</p>
                      <div className="h-12"></div>
                      <p className="font-bold underline">{partai.ketua}</p>
                      <p className="text-slate-500 font-bold uppercase text-[8px]">Ketua DPW {partai.singkatan}</p>
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
