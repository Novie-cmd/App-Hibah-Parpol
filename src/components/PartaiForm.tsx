/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  CreditCard, 
  Users2, 
  Vote, 
  Save, 
  X,
  Plus,
  Trash2,
  FileText
} from 'lucide-react';
import { Partai, PengaturanSistem } from '../types';

interface PartaiFormProps {
  partai: Partai | null; // null if adding new parpol
  pengaturan: PengaturanSistem;
  onSave: (p: Partai) => void;
  onClose: () => void;
}

const BANK_PRESETS = [
  "Bank NTB Syariah Cabang Utama Mataram",
  "Bank NTB Syariah Cabang Selong",
  "Bank Rakyat Indonesia (BRI) Cabang Mataram",
  "Bank Mandiri Cabang Mataram",
  "Bank Negara Indonesia (BNI) Cabang Mataram",
  "Bank Syariah Indonesia (BSI) Cabang Mataram"
];

export default function PartaiForm({
  partai,
  pengaturan,
  onSave,
  onClose
}: PartaiFormProps) {
  const [id, setId] = useState('');
  const [nama, setNama] = useState('');
  const [singkatan, setSingkatan] = useState('');
  const [nomorUrut, setNomorUrut] = useState(1);
  const [logo, setLogo] = useState('🔴');
  const [alamatKantor, setAlamatKantor] = useState('');
  const [provinsi, setProvinsi] = useState('Nusa Tenggara Barat');
  const [kabupatenKota, setKabupatenKota] = useState('Kota Mataram');
  const [kecamatan, setKecamatan] = useState('');
  const [kelurahan, setKelurahan] = useState('');
  const [kodePos, setKodePos] = useState('');
  const [nomorTelepon, setNomorTelepon] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [statusAktif, setStatusAktif] = useState(true);
  const [tanggalBerdiri, setTanggalBerdiri] = useState('');
  const [nomorSkKemenkumham, setNomorSkKemenkumham] = useState('');
  const [tanggalSk, setTanggalSk] = useState('');
  const [npwpPartai, setNpwpPartai] = useState('');

  // Rekening Bank
  const [namaBank, setNamaBank] = useState('Bank NTB Syariah Cabang Utama Mataram');
  const [isCustomBank, setIsCustomBank] = useState(false);
  const [nomorRekening, setNomorRekening] = useState('');
  const [atasNamaRekening, setAtasNamaRekening] = useState('');

  // Kepengurusan
  const [ketua, setKetua] = useState('');
  const [sekretaris, setSekretaris] = useState('');
  const [bendahara, setBendahara] = useState('');
  const [masaJabatan, setMasaJabatan] = useState('2024 - 2029');
  const [nomorHp, setNomorHp] = useState('');
  const [emailPengurus, setEmailPengurus] = useState('');
  const [fotoPengurus, setFotoPengurus] = useState('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80');
  const [skKepengurusan, setSkKepengurusan] = useState('');
  const [masaBerlakuSk, setMasaBerlakuSk] = useState('');

  // Perolehan Kursi DPRD
  const [tahunPemilu, setTahunPemilu] = useState('2024');
  const [jumlahSuaraSah, setJumlahSuaraSah] = useState(0);
  const [jumlahKursiDprd, setJumlahKursiDprd] = useState(0);
  const [daerahPemilihan, setDaerahPemilihan] = useState('Dapil 1, Dapil 2');
  const [nilaiBantuanPerSuara, setNilaiBantuanPerSuara] = useState(pengaturan.nilaiBantuanPerSuara);

  // No. 5 Data Bantuan Hibah
  const [nomorNphd, setNomorNphd] = useState('');
  const [tanggalNphd, setTanggalNphd] = useState('');
  const [nomorSptjm, setNomorSptjm] = useState('');
  const [tanggalSptjm, setTanggalSptjm] = useState('');
  const [nomorBap, setNomorBap] = useState('');
  const [tanggalBap, setTanggalBap] = useState('');

  useEffect(() => {
    if (partai) {
      setId(partai.id);
      setNama(partai.nama);
      setSingkatan(partai.singkatan);
      setNomorUrut(partai.nomorUrut);
      setLogo(partai.logo);
      setAlamatKantor(partai.alamatKantor);
      setProvinsi(partai.provinsi);
      setKabupatenKota(partai.kabupatenKota);
      setKecamatan(partai.kecamatan || '');
      setKelurahan(partai.kelurahan);
      setKodePos(partai.kodePos);
      setNomorTelepon(partai.nomorTelepon);
      setEmail(partai.email);
      setWebsite(partai.website);
      setStatusAktif(partai.statusAktif);
      setTanggalBerdiri(partai.tanggalBerdiri);
      setNomorSkKemenkumham(partai.nomorSkKemenkumham);
      setTanggalSk(partai.tanggalSk);
      setNpwpPartai(partai.npwpPartai);

      setNamaBank(partai.namaBank);
      const isPreset = BANK_PRESETS.includes(partai.namaBank);
      setIsCustomBank(!isPreset && partai.namaBank !== '');
      setNomorRekening(partai.nomorRekening);
      setAtasNamaRekening(partai.atasNamaRekening);

      setKetua(partai.ketua);
      setSekretaris(partai.sekretaris);
      setBendahara(partai.bendahara);
      setMasaJabatan(partai.masaJabatan);
      setNomorHp(partai.nomorHp);
      setEmailPengurus(partai.emailPengurus);
      setFotoPengurus(partai.fotoPengurus);
      setSkKepengurusan(partai.skKepengurusan);
      setMasaBerlakuSk(partai.masaBerlakuSk);

      setTahunPemilu(partai.tahunPemilu);
      setJumlahSuaraSah(partai.jumlahSuaraSah);
      setJumlahKursiDprd(partai.jumlahKursiDprd);
      setDaerahPemilihan(partai.daerahPemilihan);
      setNilaiBantuanPerSuara(partai.nilaiBantuanPerSuara);

      setNomorNphd(partai.nomorNphd || '');
      setTanggalNphd(partai.tanggalNphd || '');
      setNomorSptjm(partai.nomorSptjm || '');
      setTanggalSptjm(partai.tanggalSptjm || '');
      setNomorBap(partai.nomorBap || '');
      setTanggalBap(partai.tanggalBap || '');
    } else {
      setId(`p_${Date.now()}`);
      setKecamatan('');
    }
  }, [partai, pengaturan]);

  // Handle Logo file import and convert to Base64 string
  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran berkas logo gambar maksimal 2 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setLogo(event.target.result as string);
      }
    };
    reader.onerror = () => {
      alert("Gagal membaca file gambar.");
    };
    reader.readAsDataURL(file);
  };

  // Handle submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !singkatan || !ketua || !nomorRekening) {
      alert("Harap isi semua kolom wajib (Nama Partai, Singkatan, Ketua DPC, dan Nomor Rekening Bank).");
      return;
    }

    const calculatedTotal = statusAktif ? (jumlahSuaraSah * nilaiBantuanPerSuara) : 0;

    onSave({
      id,
      nama,
      singkatan,
      nomorUrut: Number(nomorUrut),
      logo,
      alamatKantor,
      provinsi,
      kabupatenKota,
      kecamatan,
      kelurahan,
      kodePos,
      nomorTelepon,
      email,
      website,
      statusAktif,
      tanggalBerdiri,
      nomorSkKemenkumham,
      tanggalSk,
      npwpPartai,
      
      namaBank,
      nomorRekening,
      atasNamaRekening,

      ketua,
      sekretaris,
      bendahara,
      masaJabatan,
      nomorHp,
      emailPengurus,
      fotoPengurus,
      skKepengurusan,
      masaBerlakuSk,

      tahunPemilu,
      jumlahSuaraSah: Number(jumlahSuaraSah),
      jumlahKursiDprd: Number(jumlahKursiDprd),
      daerahPemilihan,
      nilaiBantuanPerSuara: Number(nilaiBantuanPerSuara),
      totalHakBantuan: calculatedTotal,

      // No. 5 Data Bantuan Hibah
      nomorNphd,
      tanggalNphd,
      nomorSptjm,
      tanggalSptjm,
      nomorBap,
      tanggalBap
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-100 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-5 border-b border-slate-150 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">{partai ? 'Edit Profil Partai Politik' : 'Pendaftaran Partai Politik Baru'}</h3>
              <p className="text-xs text-slate-500">Isi lengkap seluruh identitas, pengurus, rekening bank, dan perolehan suara pemilu daerah.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-8 text-xs">
          
          {/* SECTION 1: IDENTITAS PARTAI */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 flex items-center gap-2 border-b border-emerald-100 pb-1.5 select-none">
              <Building2 className="h-4 w-4" />
              1. Identitas Partai Politik (Kemenkumham)
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-500 font-bold mb-1">Nama Partai <span className="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  value={nama} 
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Partai Demokrasi Indonesia"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium focus:bg-white focus:outline-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Singkatan <span className="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  value={singkatan} 
                  onChange={(e) => setSingkatan(e.target.value)}
                  placeholder="Contoh: PDI-P"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold font-mono focus:bg-white focus:outline-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Nomor Urut</label>
                  <input 
                    type="number" 
                    value={nomorUrut} 
                    onChange={(e) => setNomorUrut(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium focus:bg-white focus:outline-emerald-500 text-center"
                    min={1}
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Logo / Lambang Parpol</label>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                      {logo && (logo.startsWith('data:image') || logo.startsWith('http') || logo.startsWith('/')) ? (
                        <img src={logo} alt="Pratinjau" className="w-8 h-8 object-contain rounded" />
                      ) : (
                        <span className="text-xl select-none">{logo || '🔴'}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <input 
                        type="text" 
                        value={logo && logo.startsWith('data:image') ? '🔴 [Logo Gambar Diimpor]' : logo} 
                        onChange={(e) => setLogo(e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-center font-bold focus:bg-white"
                        placeholder="🔴 atau ketik Emoji"
                        disabled={logo && logo.startsWith('data:image')}
                        title={logo && logo.startsWith('data:image') ? "Logo saat ini menggunakan gambar. Klik 'Reset' untuk kembali menggunakan emoji." : "Ketik emoji lambang parpol"}
                      />
                    </div>
                  </div>
                  <div className="mt-2 flex gap-1.5 justify-between">
                    <label className="cursor-pointer bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-1 rounded text-[10px] font-extrabold text-center block flex-1 transition shadow-2xs">
                      <span>📥 Import Logo</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleLogoFileChange}
                        className="hidden" 
                      />
                    </label>
                    {logo && logo.startsWith('data:image') && (
                      <button 
                        type="button"
                        onClick={() => setLogo('🔴')}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 px-2.5 py-1 rounded text-[10px] font-extrabold transition"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="block text-slate-500 font-bold mb-1">Alamat Kantor Sekretariat DPC/DPD</label>
                <input 
                  type="text" 
                  value={alamatKantor} 
                  onChange={(e) => setAlamatKantor(e.target.value)}
                  placeholder="Jl. Pejanggik No. 12, Mataram"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Kabupaten / Kota di NTB</label>
                <select 
                  value={kabupatenKota} 
                  onChange={(e) => setKabupatenKota(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold focus:bg-white cursor-pointer"
                >
                  {pengaturan.kabupatenDaftar.map((kab, i) => (
                    <option key={i} value={kab}>{kab}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Kecamatan <span className="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  value={kecamatan} 
                  onChange={(e) => setKecamatan(e.target.value)}
                  placeholder="Ketik Kecamatan..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium focus:bg-white focus:outline-emerald-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-slate-500 font-bold mb-1">No. SK Kemenkumham</label>
                <input 
                  type="text" 
                  value={nomorSkKemenkumham} 
                  onChange={(e) => setNomorSkKemenkumham(e.target.value)}
                  placeholder="M.HH-05.AH.11.01 TAHUN 2024"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                />
              </div>
              <div>
                <label className="block text-slate-500 font-bold mb-1">Tanggal SK Terbit</label>
                <input 
                  type="date" 
                  value={tanggalSk} 
                  onChange={(e) => setTanggalSk(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                />
              </div>
              <div>
                <label className="block text-slate-500 font-bold mb-1">NPWP Partai Politik</label>
                <input 
                  type="text" 
                  value={npwpPartai} 
                  onChange={(e) => setNpwpPartai(e.target.value)}
                  placeholder="01.234.567.8-024.000"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                />
              </div>
              <div>
                <label className="block text-slate-500 font-bold mb-1">Status Keaktifan Daerah</label>
                <div className="flex items-center gap-2 mt-2">
                  <input 
                    type="checkbox" 
                    id="status_aktif"
                    checked={statusAktif} 
                    onChange={(e) => setStatusAktif(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                  />
                  <label htmlFor="status_aktif" className="text-slate-700 font-bold cursor-pointer">
                    Partai Politik Aktif Penerima Hibah
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: REKENING BANK */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 flex items-center gap-2 border-b border-emerald-100 pb-1.5 select-none">
              <CreditCard className="h-4 w-4" />
              2. Data Rekening Bank Rekanan Resmi
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-500 font-bold mb-1">Nama Bank Penerima <span className="text-rose-500">*</span></label>
                {isCustomBank ? (
                  <div className="relative">
                    <input 
                      type="text"
                      value={namaBank}
                      onChange={(e) => setNamaBank(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold focus:bg-white"
                      placeholder="Ketik nama bank secara manual..."
                      required
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomBank(false);
                        setNamaBank(BANK_PRESETS[0]);
                      }}
                      className="mt-1 text-[10px] text-emerald-600 font-bold hover:underline block cursor-pointer"
                    >
                      &larr; Pilih dari daftar bank preset
                    </button>
                  </div>
                ) : (
                  <select 
                    value={namaBank} 
                    onChange={(e) => {
                      if (e.target.value === "CUSTOM") {
                        setIsCustomBank(true);
                        setNamaBank('');
                      } else {
                        setNamaBank(e.target.value);
                      }
                    }}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold cursor-pointer"
                  >
                    {BANK_PRESETS.map((preset) => (
                      <option key={preset} value={preset}>{preset}</option>
                    ))}
                    <option value="CUSTOM">&#9998; Ketik manual / bank lainnya...</option>
                  </select>
                )}
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Nomor Rekening Bank <span className="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  value={nomorRekening} 
                  onChange={(e) => setNomorRekening(e.target.value)}
                  placeholder="0012233445566"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold font-mono text-emerald-700 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Nama Pemilik Rekening (Harus Sesuai SK)</label>
                <input 
                  type="text" 
                  value={atasNamaRekening} 
                  onChange={(e) => setAtasNamaRekening(e.target.value)}
                  placeholder="DPD PARPOL PROV NTB"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold uppercase"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: KEPENGURUSAN */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 flex items-center gap-2 border-b border-emerald-100 pb-1.5 select-none">
              <Users2 className="h-4 w-4" />
              3. Komposisi Kepengurusan Inti (DPC / DPD)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-500 font-bold mb-1">Ketua Umum / Ketua DPC <span className="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  value={ketua} 
                  onChange={(e) => setKetua(e.target.value)}
                  placeholder="Nama Lengkap & Gelar"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Sekretaris Jenderal / Cabang</label>
                <input 
                  type="text" 
                  value={sekretaris} 
                  onChange={(e) => setSekretaris(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Bendahara Umum / Cabang</label>
                <input 
                  type="text" 
                  value={bendahara} 
                  onChange={(e) => setBendahara(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-slate-500 font-bold mb-1">Masa Jabatan Bakti</label>
                <input 
                  type="text" 
                  value={masaJabatan} 
                  onChange={(e) => setMasaJabatan(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                  placeholder="2024 - 2029"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">No. HP Pengurus (Aktif)</label>
                <input 
                  type="text" 
                  value={nomorHp} 
                  onChange={(e) => setNomorHp(e.target.value)}
                  placeholder="0812345678"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">No. SK Kepengurusan</label>
                <input 
                  type="text" 
                  value={skKepengurusan} 
                  onChange={(e) => setSkKepengurusan(e.target.value)}
                  placeholder="SK-DPC/PARPOL/VIII/2024"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Masa Berlaku SK Kepengurusan</label>
                <input 
                  type="date" 
                  value={masaBerlakuSk} 
                  onChange={(e) => setMasaBerlakuSk(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium border-rose-200 focus:outline-rose-500"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: HAK BANTUAN SUARA */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 flex items-center gap-2 border-b border-emerald-100 pb-1.5 select-none">
              <Vote className="h-4 w-4" />
              4. Perolehan Kursi Pemilu & Hak Bantuan Hibah
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/60">
              <div>
                <label className="block text-slate-500 font-bold mb-1">Jumlah Suara Sah (DPRD Kab)</label>
                <input 
                  type="number" 
                  value={jumlahSuaraSah} 
                  onChange={(e) => setJumlahSuaraSah(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-800"
                  min={0}
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Jumlah Kursi DPRD</label>
                <input 
                  type="number" 
                  value={jumlahKursiDprd} 
                  onChange={(e) => setJumlahKursiDprd(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold text-center"
                  min={0}
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Nilai Bantuan per Suara (Rp)</label>
                <input 
                  type="number" 
                  value={nilaiBantuanPerSuara} 
                  className="w-full p-2 bg-slate-100 border border-slate-200 rounded-lg font-bold text-center text-slate-500"
                  disabled
                />
              </div>

              <div>
                <label className="block text-emerald-700 font-bold mb-1">Total Hak Bantuan Hibah (Auto)</label>
                <div className="w-full p-2 bg-emerald-100/60 border border-emerald-200 rounded-lg font-extrabold text-emerald-800 text-sm">
                  Rp {statusAktif ? (jumlahSuaraSah * nilaiBantuanPerSuara).toLocaleString('id-ID') : '0'}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 5: DATA BANTUAN HIBAH */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 flex items-center gap-2 border-b border-emerald-100 pb-1.5 select-none">
              <FileText className="h-4 w-4" />
              5. Data Bantuan Hibah ({pengaturan.tahunAnggaranAktif})
            </h4>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* NPHD */}
                <div className="space-y-3 p-3 bg-white rounded-lg border border-slate-200">
                  <span className="font-extrabold text-slate-700 text-[10px] uppercase block border-b pb-1">1. DOKUMEN NPHD</span>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-slate-500 font-bold mb-1">Nomor NPHD</label>
                      <input 
                        type="text" 
                        value={nomorNphd} 
                        onChange={(e) => setNomorNphd(e.target.value)}
                        placeholder={`Contoh: 900/${partai ? partai.nomorUrut + 20 : 21}/NPHD-KESBANGPOL/${pengaturan.tahunAnggaranAktif}`}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold mb-1">Tanggal NPHD</label>
                      <input 
                        type="date" 
                        value={tanggalNphd} 
                        onChange={(e) => setTanggalNphd(e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                {/* SPTJM */}
                <div className="space-y-3 p-3 bg-white rounded-lg border border-slate-200">
                  <span className="font-extrabold text-slate-700 text-[10px] uppercase block border-b pb-1">2. DOKUMEN SPTJM</span>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-slate-500 font-bold mb-1">Nomor SPTJM</label>
                      <input 
                        type="text" 
                        value={nomorSptjm} 
                        onChange={(e) => setNomorSptjm(e.target.value)}
                        placeholder={`Contoh: ${partai ? partai.nomorUrut + 10 : 11}/SPTJM/${partai?.singkatan || 'PARPOL'}/${pengaturan.tahunAnggaranAktif}`}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold mb-1">Tanggal SPTJM</label>
                      <input 
                        type="date" 
                        value={tanggalSptjm} 
                        onChange={(e) => setTanggalSptjm(e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                {/* BAP */}
                <div className="space-y-3 p-3 bg-white rounded-lg border border-slate-200 md:col-span-2">
                  <span className="font-extrabold text-slate-700 text-[10px] uppercase block border-b pb-1">3. DOKUMEN BAP (Berita Acara Pembayaran)</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-500 font-bold mb-1">Nomor BAP</label>
                      <input 
                        type="text" 
                        value={nomorBap} 
                        onChange={(e) => setNomorBap(e.target.value)}
                        placeholder={`Contoh: 900/${partai ? partai.nomorUrut + 10 : 11}/BAP-KESBANGPOL/${pengaturan.tahunAnggaranAktif}`}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold mb-1">Tanggal BAP</label>
                      <input 
                        type="date" 
                        value={tanggalBap} 
                        onChange={(e) => setTanggalBap(e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-5 border-t border-slate-150 flex items-center justify-end gap-3 bg-slate-50 -mx-6 -mb-6 p-5 rounded-b-xl">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-lg shadow-2xs transition"
            >
              Batal
            </button>
            <button 
              type="submit" 
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition"
            >
              <Save className="h-4 w-4" />
              Simpan Data Partai
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
