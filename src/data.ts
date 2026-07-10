/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Partai, 
  DokumenHibah, 
  DataHibah, 
  LaporanPertanggungjawaban, 
  AuditLog, 
  Pengguna, 
  PengaturanSistem,
  Notifikasi
} from './types';

export const INITIAL_PENGATURAN: PengaturanSistem = {
  tahunAnggaranAktif: 2026,
  nilaiBantuanPerSuara: 5000, // Rp 5.000 per suara sah sesuai aturan daerah
  namaInstansi: "Badan Kesatuan Bangsa dan Politik (Kesbangpol) Provinsi Nusa Tenggara Barat",
  logoInstansi: "https://images.unsplash.com/photo-1624996379697-f01d168b1a52?w=150&h=150&fit=crop&q=80", // Coat of arms styled placeholder
  alamatInstansi: "Jl. Pejanggik No. 12, Mataram, Nusa Tenggara Barat",
  kabupatenDaftar: [
    "Kota Mataram",
    "Kab. Lombok Barat",
    "Kab. Lombok Tengah",
    "Kab. Lombok Timur",
    "Kab. Sumbawa Barat",
    "Kab. Sumbawa",
    "Kab. Dompu",
    "Kabupaten Bima",
    "Kota Bima"
  ],
  kecamatanDaftar: [
    "Mataram",
    "Selaparang",
    "Cakranegara",
    "Ampenan",
    "Sekarbela",
    "Sandubaya",
    "Senggigi",
    "Narmada",
    "Batu Layar",
    "Praya",
    "Selong",
    "Sumbawa Besar",
    "Taliwang",
    "Dompu",
    "Bima"
  ],
  tipeDokumenDaftar: [
    "Surat Permohonan Hibah",
    "Proposal Bantuan",
    "SK Kepengurusan",
    "NPWP",
    "Rekening Bank",
    "Surat Domisili",
    "Pakta Integritas",
    "Surat Pernyataan",
    "Rencana Penggunaan Dana",
    "Laporan Pertanggungjawaban Tahun Sebelumnya",
    "Berita Acara Verifikasi",
    "SK Penetapan Penerima Hibah",
    "Naskah Perjanjian Hibah Daerah (NPHD)",
    "Kwitansi",
    "Bukti Transfer",
    "Dokumentasi",
    "Dokumen Lainnya"
  ]
};

export const INITIAL_PARTAI: Partai[] = [
  {
    id: "p1",
    nama: "Partai Demokrasi Indonesia Perjuangan",
    singkatan: "PDI-P",
    nomorUrut: 3,
    logo: "🔴",
    alamatKantor: "Jl. Sultan Agung No. 25, Mataram",
    provinsi: "Nusa Tenggara Barat",
    kabupatenKota: "Kota Mataram",
    kecamatan: "Mataram",
    kelurahan: "Karangasih",
    kodePos: "17530",
    nomorTelepon: "021-8902134",
    email: "ntb-prov@pdiperjuangan.id",
    website: "pdiperjuangan.id",
    statusAktif: true,
    tanggalBerdiri: "1999-01-10",
    nomorSkKemenkumham: "M.HH-05.AH.11.01 TAHUN 2024",
    tanggalSk: "2024-05-15",
    npwpPartai: "01.234.567.8-024.000",
    namaBank: "Bank NTB Syariah Cabang Utama Mataram",
    nomorRekening: "0012233445566",
    atasNamaRekening: "DPC PDI Perjuangan Kota Mataram",
    
    // Kepengurusan
    ketua: "Dr. H. Soleman, S.E., M.Si.",
    sekretaris: "Yusup Sulaeman, S.IP.",
    bendahara: "Hj. Sumiyati",
    masaJabatan: "2024 - 2029",
    nomorHp: "081234567801",
    emailPengurus: "soleman.dpc@pdiperjuangan.id",
    fotoPengurus: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80",
    skKepengurusan: "SK-DPC/PDIP-KB/VIII/2024",
    masaBerlakuSk: "2029-08-25",
    
    // Pemilu
    tahunPemilu: "2024",
    jumlahSuaraSah: 184500,
    jumlahKursiDprd: 8,
    daerahPemilihan: "Dapil 1, Dapil 2, Dapil 3, Dapil 4, Dapil 5, Dapil 6, Dapil 7",
    nilaiBantuanPerSuara: 5000,
    totalHakBantuan: 184500 * 5000
  },
  {
    id: "p2",
    nama: "Partai Gerakan Indonesia Raya",
    singkatan: "GERINDRA",
    nomorUrut: 2,
    logo: "🦅",
    alamatKantor: "Jl. Tarumajaya Raya No. 45, Sekarbela",
    provinsi: "Nusa Tenggara Barat",
    kabupatenKota: "Kota Mataram",
    kecamatan: "Sekarbela",
    kelurahan: "Jayamukti",
    kodePos: "17510",
    nomorTelepon: "021-8894123",
    email: "gerindra.ntbprov@gmail.com",
    website: "gerindra.id",
    statusAktif: true,
    tanggalBerdiri: "2008-02-06",
    nomorSkKemenkumham: "M.HH-12.AH.11.01 TAHUN 2024",
    tanggalSk: "2024-06-11",
    npwpPartai: "01.765.432.1-024.000",
    namaBank: "Bank Mandiri Cabang Mataram",
    nomorRekening: "1560012345678",
    atasNamaRekening: "DPC Partai Gerindra Kota Mataram",
    
    // Kepengurusan
    ketua: "H. BN. Holik Qodratullah, S.E., M.Si.",
    sekretaris: "Helmi, S.E.",
    bendahara: "H. Ridwan Arifin, S.H.",
    masaJabatan: "2024 - 2029",
    nomorHp: "081234567802",
    emailPengurus: "bnholik.dpc@gerindra.id",
    fotoPengurus: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&q=80",
    skKepengurusan: "SK-DPC/GERINDRA-KB/IX/2024",
    masaBerlakuSk: "2029-09-12",
    
    // Pemilu
    tahunPemilu: "2024",
    jumlahSuaraSah: 198200,
    jumlahKursiDprd: 9,
    daerahPemilihan: "Dapil 1, Dapil 2, Dapil 3, Dapil 4, Dapil 5, Dapil 6, Dapil 7",
    nilaiBantuanPerSuara: 5000,
    totalHakBantuan: 198200 * 5000
  },
  {
    id: "p3",
    nama: "Partai Golongan Karya",
    singkatan: "GOLKAR",
    nomorUrut: 4,
    logo: "🌳",
    alamatKantor: "Jl. Achmad Yani No. 12, Cakranegara",
    provinsi: "Nusa Tenggara Barat",
    kabupatenKota: "Kota Mataram",
    kecamatan: "Cakranegara",
    kelurahan: "Hegarmanah",
    kodePos: "17535",
    nomorTelepon: "021-8932456",
    email: "golkar.ntbprov@yahoo.com",
    website: "golkar.id",
    statusAktif: true,
    tanggalBerdiri: "1964-10-20",
    nomorSkKemenkumham: "M.HH-08.AH.11.01 TAHUN 2024",
    tanggalSk: "2024-05-30",
    npwpPartai: "02.123.456.7-024.000",
    namaBank: "Bank NTB Syariah Cabang Utama Mataram",
    nomorRekening: "0023344556677",
    atasNamaRekening: "DPD Golkar Kota Mataram",
    
    // Kepengurusan
    ketua: "H. Akhmad Marjuki, S.E.",
    sekretaris: "Novi Yasin, S.KG.",
    bendahara: "H. Sunandar, S.E.",
    masaJabatan: "2024 - 2029",
    nomorHp: "081234567803",
    emailPengurus: "amarjuki.dpd@golkar.id",
    fotoPengurus: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&q=80",
    skKepengurusan: "SK-DPD/GOLKAR-KB/VII/2024",
    masaBerlakuSk: "2026-08-30", // AKAN BERAKHIR SEGERA (untuk testing notifikasi)
    
    // Pemilu
    tahunPemilu: "2024",
    jumlahSuaraSah: 215400,
    jumlahKursiDprd: 10,
    daerahPemilihan: "Dapil 1, Dapil 2, Dapil 3, Dapil 4, Dapil 5, Dapil 6, Dapil 7",
    nilaiBantuanPerSuara: 5000,
    totalHakBantuan: 215400 * 5000
  },
  {
    id: "p4",
    nama: "Partai Keadilan Sejahtera",
    singkatan: "PKS",
    nomorUrut: 8,
    logo: "🟠",
    alamatKantor: "Jl. KH. Noer Ali No. 88, Ampenan",
    provinsi: "Nusa Tenggara Barat",
    kabupatenKota: "Kota Mataram",
    kecamatan: "Ampenan",
    kelurahan: "Wanasari",
    kodePos: "17520",
    nomorTelepon: "021-8837123",
    email: "info@ntb.pks.id",
    website: "pks.id",
    statusAktif: true,
    tanggalBerdiri: "1998-07-20",
    nomorSkKemenkumham: "M.HH-01.AH.11.01 TAHUN 2024",
    tanggalSk: "2024-04-10",
    npwpPartai: "03.456.789.1-024.000",
    namaBank: "Bank Syariah Indonesia (BSI) Cabang Mataram",
    nomorRekening: "7102233445",
    atasNamaRekening: "DPD PKS Kota Mataram",
    
    // Kepengurusan
    ketua: "H. Budi Muhammad Mustafa",
    sekretaris: "Uryana Suryana, S.H.",
    bendahara: "Hj. Ani Rukmini, S.Ag.",
    masaJabatan: "2024 - 2029",
    nomorHp: "081234567804",
    emailPengurus: "budi.mustafa@pks.id",
    fotoPengurus: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&q=80",
    skKepengurusan: "SK-DPD/PKS-KB/V/2024",
    masaBerlakuSk: "2029-05-10",
    
    // Pemilu
    tahunPemilu: "2024",
    jumlahSuaraSah: 156300,
    jumlahKursiDprd: 7,
    daerahPemilihan: "Dapil 1, Dapil 2, Dapil 3, Dapil 4, Dapil 5, Dapil 6, Dapil 7",
    nilaiBantuanPerSuara: 5000,
    totalHakBantuan: 156300 * 5000
  },
  {
    id: "p5",
    nama: "Partai Kebangkitan Bangsa",
    singkatan: "PKB",
    nomorUrut: 1,
    logo: "🟢",
    alamatKantor: "Jl. Industri No. 100, Selaparang",
    provinsi: "Nusa Tenggara Barat",
    kabupatenKota: "Kota Mataram",
    kecamatan: "Selaparang",
    kelurahan: "Pasirsari",
    kodePos: "17530",
    nomorTelepon: "021-8984321",
    email: "pkb.prov.ntb@gmail.com",
    website: "pkb.id",
    statusAktif: true,
    tanggalBerdiri: "1998-07-23",
    nomorSkKemenkumham: "M.HH-02.AH.11.01 TAHUN 2024",
    tanggalSk: "2024-04-18",
    npwpPartai: "04.567.891.2-024.000",
    namaBank: "Bank NTB Syariah Cabang Utama Mataram",
    nomorRekening: "0054455667788",
    atasNamaRekening: "DPC PKB Kota Mataram",
    
    // Kepengurusan
    ketua: "H. Muhamad Rochadi, S.H.",
    sekretaris: "Ahmad Faisal, S.Pd.I.",
    bendahara: "H. Hendra Wardana",
    masaJabatan: "2024 - 2029",
    nomorHp: "081234567805",
    emailPengurus: "rochadi.dpc@pkb.id",
    fotoPengurus: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&q=80",
    skKepengurusan: "SK-DPC/PKB-KB/VI/2024",
    masaBerlakuSk: "2029-06-20",
    
    // Pemilu
    tahunPemilu: "2024",
    jumlahSuaraSah: 124100,
    jumlahKursiDprd: 5,
    daerahPemilihan: "Dapil 1, Dapil 2, Dapil 3, Dapil 4, Dapil 5, Dapil 6",
    nilaiBantuanPerSuara: 5000,
    totalHakBantuan: 124100 * 5000
  },
  {
    id: "p6",
    nama: "Partai Demokrat",
    singkatan: "DEMOKRAT",
    nomorUrut: 14,
    logo: "🔵",
    alamatKantor: "Jl. Gatot Subroto No. 45, Mataram",
    provinsi: "Nusa Tenggara Barat",
    kabupatenKota: "Kota Mataram",
    kecamatan: "Mataram",
    kelurahan: "Cikarang Kota",
    kodePos: "17530",
    nomorTelepon: "021-8905678",
    email: "demokrat.prov.ntb@yahoo.co.id",
    website: "demokrat.or.id",
    statusAktif: true,
    tanggalBerdiri: "2001-09-09",
    nomorSkKemenkumham: "M.HH-14.AH.11.01 TAHUN 2024",
    tanggalSk: "2024-07-01",
    npwpPartai: "05.678.912.3-024.000",
    namaBank: "Bank NTB Syariah Cabang Utama Mataram",
    nomorRekening: "0065566778899",
    atasNamaRekening: "DPC Partai Demokrat Kota Mataram",
    
    // Kepengurusan
    ketua: "H. Romli HM",
    sekretaris: "M. Jamil, S.E.",
    bendahara: "Hj. Mia El-Dabo",
    masaJabatan: "2024 - 2029",
    nomorHp: "081234567806",
    emailPengurus: "romli.hm@demokrat.id",
    fotoPengurus: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=200&h=200&fit=crop&q=80",
    skKepengurusan: "SK-DPC/DEMOKRAT-KB/VIII/2024",
    masaBerlakuSk: "2029-08-15",
    
    // Pemilu
    tahunPemilu: "2024",
    jumlahSuaraSah: 98500,
    jumlahKursiDprd: 4,
    daerahPemilihan: "Dapil 1, Dapil 2, Dapil 3, Dapil 5",
    nilaiBantuanPerSuara: 5000,
    totalHakBantuan: 98500 * 5000
  },
  {
    id: "p7",
    nama: "Partai Amanat Nasional",
    singkatan: "PAN",
    nomorUrut: 12,
    logo: "☀️",
    alamatKantor: "Jl. Sandubaya Raya No. 120, Sandubaya",
    provinsi: "Nusa Tenggara Barat",
    kabupatenKota: "Kota Mataram",
    kecamatan: "Sandubaya",
    kelurahan: "Lubangbuaya",
    kodePos: "17320",
    nomorTelepon: "021-82603412",
    email: "pan.ntbprov@pan.or.id",
    website: "pan.or.id",
    statusAktif: true,
    tanggalBerdiri: "1998-08-23",
    nomorSkKemenkumham: "M.HH-10.AH.11.01 TAHUN 2024",
    tanggalSk: "2024-05-10",
    npwpPartai: "06.789.123.4-024.000",
    namaBank: "Bank Syariah Indonesia (BSI) Cabang Mataram",
    nomorRekening: "7109988776",
    atasNamaRekening: "DPD PAN Kota Mataram",
    
    // Kepengurusan
    ketua: "H. Jamil, S.E.",
    sekretaris: "Roy Kamarullah, S.T.",
    bendahara: "H. Warsimin",
    masaJabatan: "2024 - 2029",
    nomorHp: "081234567807",
    emailPengurus: "jamil.pan@pan.id",
    fotoPengurus: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&q=80",
    skKepengurusan: "SK-DPD/PAN-KB/VI/2024",
    masaBerlakuSk: "2029-06-15",
    
    // Pemilu
    tahunPemilu: "2024",
    jumlahSuaraSah: 76200,
    jumlahKursiDprd: 3,
    daerahPemilihan: "Dapil 1, Dapil 4, Dapil 6",
    nilaiBantuanPerSuara: 5000,
    totalHakBantuan: 76200 * 5000
  },
  {
    id: "p8",
    nama: "Partai Nasional Demokrat",
    singkatan: "NASDEM",
    nomorUrut: 5,
    logo: "🔵☀️",
    alamatKantor: "Jl. KH. Fudholi No. 90, Mataram",
    provinsi: "Nusa Tenggara Barat",
    kabupatenKota: "Kota Mataram",
    kecamatan: "Mataram",
    kelurahan: "Karangasih",
    kodePos: "17530",
    nomorTelepon: "021-8902451",
    email: "nasdem.ntbprov@nasdem.id",
    website: "nasdem.id",
    statusAktif: true,
    tanggalBerdiri: "2011-11-11",
    nomorSkKemenkumham: "M.HH-06.AH.11.01 TAHUN 2024",
    tanggalSk: "2024-05-20",
    npwpPartai: "07.891.234.5-024.000",
    namaBank: "Bank NTB Syariah Cabang Utama Mataram",
    nomorRekening: "0076677889900",
    atasNamaRekening: "DPD NasDem Kota Mataram",
    
    // Kepengurusan
    ketua: "H. Marjaya Sargan, S.H.",
    sekretaris: "H. Mustakim, S.E.",
    bendahara: "Hj. Endah Sri Handayani",
    masaJabatan: "2024 - 2029",
    nomorHp: "081234567808",
    emailPengurus: "marjaya.dpd@nasdem.id",
    fotoPengurus: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&q=80",
    skKepengurusan: "SK-DPD/NASDEM-KB/VII/2024",
    masaBerlakuSk: "2029-07-22",
    
    // Pemilu
    tahunPemilu: "2024",
    jumlahSuaraSah: 82400,
    jumlahKursiDprd: 3,
    daerahPemilihan: "Dapil 2, Dapil 4, Dapil 7",
    nilaiBantuanPerSuara: 5000,
    totalHakBantuan: 82400 * 5000
  },
  {
    id: "p9",
    nama: "Partai Persatuan Pembangunan",
    singkatan: "PPP",
    nomorUrut: 17,
    logo: "🟢🕋",
    alamatKantor: "Jl. RE Martadinata No. 50, Mataram",
    provinsi: "Nusa Tenggara Barat",
    kabupatenKota: "Kota Mataram",
    kecamatan: "Mataram",
    kelurahan: "Cikarang Kota",
    kodePos: "17530",
    nomorTelepon: "021-8905142",
    email: "ppp_ntbprov@ppp.or.id",
    website: "ppp.or.id",
    statusAktif: true,
    tanggalBerdiri: "1973-01-05",
    nomorSkKemenkumham: "M.HH-15.AH.11.01 TAHUN 2024",
    tanggalSk: "2024-07-15",
    npwpPartai: "08.912.345.6-024.000",
    namaBank: "Bank NTB Syariah Cabang Utama Mataram",
    nomorRekening: "0087788990011",
    atasNamaRekening: "DPC PPP Kota Mataram",
    
    // Kepengurusan
    ketua: "H. Cecep Noor",
    sekretaris: "Nunung, S.E.",
    bendahara: "Hj. Himayatul Latifah",
    masaJabatan: "2024 - 2029",
    nomorHp: "081234567809",
    emailPengurus: "cecepnoor.dpc@ppp.id",
    fotoPengurus: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=200&h=200&fit=crop&q=80",
    skKepengurusan: "SK-DPC/PPP-KB/IX/2024",
    masaBerlakuSk: "2029-09-01",
    
    // Pemilu
    tahunPemilu: "2024",
    jumlahSuaraSah: 52100,
    jumlahKursiDprd: 2,
    daerahPemilihan: "Dapil 3, Dapil 5",
    nilaiBantuanPerSuara: 5000,
    totalHakBantuan: 52100 * 5000
  },
  {
    id: "p10",
    nama: "Partai Solidaritas Indonesia",
    singkatan: "PSI",
    nomorUrut: 15,
    logo: "🔴🌹",
    alamatKantor: "Ruko Thamrin Boulevard Block B No. 3, Selaparang",
    provinsi: "Nusa Tenggara Barat",
    kabupatenKota: "Kota Mataram",
    kecamatan: "Selaparang",
    kelurahan: "Cibatu",
    kodePos: "17550",
    nomorTelepon: "021-89912431",
    email: "psi.ntbprov@psi.id",
    website: "psi.id",
    statusAktif: false, // TIDAK AKTIF (tidak ada kursi atau tidak mengajukan hibah)
    tanggalBerdiri: "2014-11-16",
    nomorSkKemenkumham: "M.HH-11.AH.11.01 TAHUN 2024",
    tanggalSk: "2024-06-05",
    npwpPartai: "09.123.456.7-024.000",
    namaBank: "Bank Mandiri Cabang Mataram",
    nomorRekening: "1560098765432",
    atasNamaRekening: "DPD PSI Kota Mataram",
    
    // Kepengurusan
    ketua: "Muhammad Syahril",
    sekretaris: "Yolanda, S.Kom.",
    bendahara: "Hendry Prasetyo",
    masaJabatan: "2024 - 2029",
    nomorHp: "081234567810",
    emailPengurus: "syahril.psi@psi.id",
    fotoPengurus: "https://images.unsplash.com/photo-1542206395-9feb3edaa68d?w=200&h=200&fit=crop&q=80",
    skKepengurusan: "SK-DPD/PSI-KB/VI/2024",
    masaBerlakuSk: "2029-06-10",
    
    // Pemilu
    tahunPemilu: "2024",
    jumlahSuaraSah: 18500,
    jumlahKursiDprd: 0, // Kursi DPRD kosong
    daerahPemilihan: "-",
    nilaiBantuanPerSuara: 5000,
    totalHakBantuan: 0 // Tidak mendapatkan hibah bantuan karena tidak mendapat kursi
  }
];

// Seed Dokumen untuk P1, P2, P3, P4
// Kita generate dokumen lengkap untuk P2 (Gerindra - Selesai), 
// Dokumen sebagian menunggu verifikasi untuk P1 (PDIP - Menunggu),
// Dokumen dengan perbaikan untuk P3 (Golkar - Perbaikan),
// Sisanya belum lengkap.
export const generateInitialDokumen = (partaiList: Partai[]): DokumenHibah[] => {
  const docs: DokumenHibah[] = [];
  const tipeList = INITIAL_PENGATURAN.tipeDokumenDaftar;
  
  partaiList.forEach(p => {
    // PSI tidak mendapatkan hibah, jadi tidak ada dokumen
    if (p.id === "p10" || p.totalHakBantuan === 0) return;
    
    tipeList.forEach((tipe, idx) => {
      // P2 (Gerindra) - Sangat Tertib, Lengkap semua
      if (p.id === "p2") {
        docs.push({
          id: `d_${p.id}_${idx}`,
          partaiId: p.id,
          tipeDokumen: tipe,
          nomorDokumen: `026/DPC-GERINDRA/KB/${idx+1}/2026`,
          tanggal: "2026-02-15",
          masaBerlaku: tipe === "SK Kepengurusan" ? p.masaBerlakuSk : "2027-02-15",
          statusVerifikasi: "Lengkap",
          catatanVerifikator: "Dokumen sesuai, valid, dan sangat jelas.",
          fileName: `${p.singkatan.toLowerCase()}_${tipe.toLowerCase().replace(/ /g, "_")}_2026.pdf`,
          fileType: "pdf",
          fileSize: "1.2 MB",
          version: 1,
          updatedAt: "2026-02-20T09:00:00Z",
          uploadedBy: "Helmi (Operator Partai)"
        });
      }
      
      // P1 (PDI-P) - Sebagian besar Lengkap, 3 Menunggu Verifikasi
      else if (p.id === "p1") {
        const isVerif = idx >= 12; // Dokumen NPHD, Kwitansi, Bukti Transfer dst masih Menunggu Verifikasi atau kosong
        const isKosong = idx >= 14; // Kwitansi & Bukti Transfer belum diupload
        
        if (!isKosong) {
          docs.push({
            id: `d_${p.id}_${idx}`,
            partaiId: p.id,
            tipeDokumen: tipe,
            nomorDokumen: `112/DPC-PDIP/KB/IV/2026`,
            tanggal: "2026-03-01",
            masaBerlaku: tipe === "SK Kepengurusan" ? p.masaBerlakuSk : "2027-03-01",
            statusVerifikasi: isVerif ? "Menunggu Verifikasi" : "Lengkap",
            catatanVerifikator: isVerif ? "Menunggu pemeriksaan fisik" : "Sesuai berkas pendaftaran",
            fileName: `${p.singkatan.toLowerCase()}_${tipe.toLowerCase().replace(/ /g, "_")}_2026.pdf`,
            fileType: "pdf",
            fileSize: "2.4 MB",
            version: 1,
            updatedAt: "2026-03-05T10:15:00Z",
            uploadedBy: "Yusup S. (Operator Partai)"
          });
        }
      }
      
      // P3 (Golkar) - Lengkap sebagian, 2 Perlu Perbaikan (Misal Rekening & NPWP)
      else if (p.id === "p3") {
        const isPerbaikan = tipe === "Rekening Bank" || tipe === "NPWP";
        const isKosong = idx >= 10; // Dokumen penetapan dan sesudahnya belum ada
        
        if (!isKosong) {
          docs.push({
            id: `d_${p.id}_${idx}`,
            partaiId: p.id,
            tipeDokumen: tipe,
            nomorDokumen: `GOLKAR-KB/SK-DOK/${idx+100}/2026`,
            tanggal: "2026-02-10",
            masaBerlaku: tipe === "SK Kepengurusan" ? p.masaBerlakuSk : "2027-02-10",
            statusVerifikasi: isPerbaikan ? "Perbaikan" : "Lengkap",
            catatanVerifikator: isPerbaikan 
              ? (tipe === "NPWP" ? "NPWP tidak terbaca jelas, mohon scan ulang dengan resolusi lebih tinggi." : "Nama di rekening bank tidak sama persis dengan SK Kemenkumham. Silakan lampirkan surat keterangan bank.")
              : "Valid",
            fileName: `${p.singkatan.toLowerCase()}_${tipe.toLowerCase().replace(/ /g, "_")}_2026.pdf`,
            fileType: "pdf",
            fileSize: "1.8 MB",
            version: 1,
            updatedAt: "2026-02-12T14:30:00Z",
            uploadedBy: "Novi Yasin (Operator Partai)",
            history: isPerbaikan ? [
              {
                version: 1,
                fileName: `${p.singkatan.toLowerCase()}_${tipe.toLowerCase().replace(/ /g, "_")}_v1.pdf`,
                updatedAt: "2026-02-12T14:30:00Z",
                uploadedBy: "Novi Yasin (Operator)",
                catatan: "Draft pertama diupload."
              }
            ] : undefined
          });
        }
      }
      
      // Partai Lain - Hanya upload beberapa dokumen dasar saja (Belum Lengkap)
      else {
        const isUploaded = idx < 5; // Hanya upload 5 dokumen awal
        if (isUploaded) {
          docs.push({
            id: `d_${p.id}_${idx}`,
            partaiId: p.id,
            tipeDokumen: tipe,
            nomorDokumen: `DOC-${p.singkatan}-${idx+1}/2026`,
            tanggal: "2026-04-10",
            masaBerlaku: "2027-04-10",
            statusVerifikasi: "Menunggu Verifikasi",
            catatanVerifikator: "Berkas baru diupload, belum divalidasi.",
            fileName: `${p.singkatan.toLowerCase()}_${tipe.toLowerCase().replace(/ /g, "_")}_2026.pdf`,
            fileType: "pdf",
            fileSize: "950 KB",
            version: 1,
            updatedAt: "2026-04-12T11:00:00Z",
            uploadedBy: "Operator Partai"
          });
        }
      }
    });
  });
  
  return docs;
};

// Seed Hibah
export const INITIAL_HIBAH: DataHibah[] = [
  {
    id: "h_p2",
    partaiId: "p2", // Gerindra
    tahunAnggaran: 2026,
    nomorSk: "SK-BUPATI/334/KESBANGPOL/2026",
    nomorNphd: "900/123/NPHD-KESBANGPOL/2026",
    nilaiBantuan: 198200 * 5000, // Rp 991.000.000
    tanggalPenetapan: "2026-03-01",
    tanggalPenandatanganan: "2026-03-10",
    statusPenyaluran: "Cair",
    tahapPenyaluran: "Tahap Tunggal (100%)",
    tanggalCair: "2026-03-25",
    nomorSp2d: "SP2D-900/8892/2026",
    nomorSpm: "SPM-900/1202/2026",
    nomorSpd: "SPD-900/0411/2026",
    keterangan: "Bantuan Hibah Parpol tahun 2026 telah dicairkan penuh ke rekening partai."
  },
  {
    id: "h_p1",
    partaiId: "p1", // PDIP
    tahunAnggaran: 2026,
    nomorSk: "SK-BUPATI/334/KESBANGPOL/2026",
    nomorNphd: "900/124/NPHD-KESBANGPOL/2026",
    nilaiBantuan: 184500 * 5000, // Rp 922.500.000
    tanggalPenetapan: "2026-03-01",
    tanggalPenandatanganan: "2026-03-12",
    statusPenyaluran: "SP2D Terbit",
    tahapPenyaluran: "Tahap Tunggal (100%)",
    tanggalCair: "",
    nomorSp2d: "SP2D-900/9011/2026",
    nomorSpm: "SPM-900/1344/2026",
    nomorSpd: "SPD-900/0411/2026",
    keterangan: "SP2D telah diterbitkan oleh BPKAD, menunggu transfer bank."
  },
  {
    id: "h_p3",
    partaiId: "p3", // Golkar
    tahunAnggaran: 2026,
    nomorSk: "SK-BUPATI/334/KESBANGPOL/2026",
    nomorNphd: "",
    nilaiBantuan: 215400 * 5000, // Rp 1.077.000.000
    tanggalPenetapan: "2026-03-01",
    tanggalPenandatanganan: "",
    statusPenyaluran: "Proses Verifikasi",
    tahapPenyaluran: "-",
    tanggalCair: "",
    nomorSp2d: "",
    nomorSpm: "",
    nomorSpd: "",
    keterangan: "NPHD belum ditandatangani karena dokumen NPWP & Rekening masih memerlukan revisi."
  }
];

// Seed LPJ
export const INITIAL_LPJ: LaporanPertanggungjawaban[] = [
  {
    id: "lpj_p2",
    partaiId: "p2", // Gerindra
    hibahId: "h_p2",
    tahun: 2025, // LPJ hibah tahun anggaran sebelumnya
    tanggalLaporan: "2026-01-15",
    nilaiPenggunaanDana: 198200 * 5000, // Berhasil dilaporkan semua
    ringkasanKegiatan: "Laporan realisasi dana hibah parpol 2025 digunakan untuk pendidikan politik bagi kader daerah (60%) dan operasional sekretariat partai (40%).",
    fileNameLpj: "lpj_gerindra_2025_signed.pdf",
    hasilEvaluasi: "Laporan dinyatakan lengkap dan sesuai dengan kriteria kepatuhan administrasi.",
    statusDiterima: "Diterima",
    catatan: "Sesuai dengan ketentuan perundangan-undangan."
  },
  {
    id: "lpj_p1",
    partaiId: "p1", // PDIP
    hibahId: "h_p1",
    tahun: 2025,
    tanggalLaporan: "2026-01-28",
    nilaiPenggunaanDana: 184500 * 5000,
    ringkasanKegiatan: "Penggunaan anggaran 2025 dialokasikan untuk pelaksanaan Muscab Parpol, pembekalan caleg terpilih, serta sewa gedung kantor DPC.",
    fileNameLpj: "lpj_pdip_2025_final.pdf",
    hasilEvaluasi: "LPJ lengkap. Beberapa kuitansi konsumsi perlu dilengkapi dengan daftar hadir peserta.",
    statusDiterima: "Perbaikan",
    catatan: "Harap lampirkan daftar hadir peserta pada lampiran kuitansi nomor 12, 14, dan 19."
  }
];

// Seed Audit Trail
export const INITIAL_AUDIT: AuditLog[] = [
  {
    id: "a1",
    userId: "u1",
    username: "admin_kesbang",
    role: "Admin Kesbangpol",
    aktivitas: "Login",
    objek: "Sistem",
    detail: "Admin Kesbangpol berhasil masuk ke dalam sistem.",
    timestamp: "2026-07-08T08:00:00Z",
    ipAddress: "192.168.10.101"
  },
  {
    id: "a2",
    userId: "u1",
    username: "admin_kesbang",
    role: "Admin Kesbangpol",
    aktivitas: "Tambah Data",
    objek: "Partai Golkar",
    detail: "Berhasil menambahkan perolehan kursi pemilu Partai Golkar DPRD 10 Kursi.",
    timestamp: "2026-07-08T08:15:00Z",
    ipAddress: "192.168.10.101"
  },
  {
    id: "a3",
    userId: "u3",
    username: "operator_gerindra",
    role: "Operator Partai",
    aktivitas: "Upload Dokumen",
    objek: "Proposal Bantuan",
    detail: "Mengunggah proposal bantuan hibah anggaran tahun 2026 Partai Gerindra.",
    timestamp: "2026-07-08T08:30:00Z",
    ipAddress: "182.253.114.10"
  },
  {
    id: "a4",
    userId: "u2",
    username: "verifikator_kesbang",
    role: "Verifikator",
    aktivitas: "Verifikasi",
    objek: "Rekening Bank Partai Golkar",
    detail: "Memberikan status 'Perbaikan' dengan catatan nama rekening tidak sesuai SK.",
    timestamp: "2026-07-08T09:05:00Z",
    ipAddress: "192.168.10.102"
  },
  {
    id: "a5",
    userId: "u2",
    username: "verifikator_kesbang",
    role: "Verifikator",
    aktivitas: "Verifikasi",
    objek: "Proposal Bantuan Partai Gerindra",
    detail: "Memberikan status 'Lengkap' untuk proposal hibah bantuan parpol 2026.",
    timestamp: "2026-07-08T09:12:00Z",
    ipAddress: "192.168.10.102"
  }
];

// Seed Pengguna
export const INITIAL_PENGGUNA: Pengguna[] = [
  {
    id: "u5",
    username: "super_admin",
    namaLengkap: "H. Bambang Setiadi, M.Kom.",
    email: "bambang.admin@ntbprov.go.id",
    role: "Super Admin",
    status: "Aktif",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop&q=80"
  },
  {
    id: "u1",
    username: "admin_kesbang",
    namaLengkap: "Drs. H. Juhanda, M.Si.",
    email: "juhanda.kesbang@ntbprov.go.id",
    role: "Admin Kesbangpol",
    status: "Aktif",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&q=80"
  },
  {
    id: "u2",
    username: "verifikator_kesbang",
    namaLengkap: "Randi Hermawan, S.STP.",
    email: "randi.hermawan@ntbprov.go.id",
    role: "Verifikator",
    status: "Aktif",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&q=80"
  },
  {
    id: "u3",
    username: "operator_gerindra",
    namaLengkap: "Helmi, S.E. (Gerindra)",
    email: "helmi@gerindrantb.or.id",
    role: "Operator Partai",
    status: "Aktif",
    partaiId: "p2",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80"
  },
  {
    id: "u4",
    username: "pimpinan_kesbang",
    namaLengkap: "H. Enun Sarji, S.H., M.M.",
    email: "enunsarji@ntbprov.go.id",
    role: "Pimpinan",
    status: "Aktif",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&q=80"
  }
];

// Seed Notifikasi
export const INITIAL_NOTIFIKASI: Notifikasi[] = [
  {
    id: "n1",
    partaiId: "p3",
    partaiNama: "GOLKAR",
    tipe: "warning_kadaluarsa",
    pesan: "Masa berlaku SK Kepengurusan Partai GOLKAR akan segera habis dalam waktu dekat (Berakhir: 2026-08-30). Harap segera ajukan perpanjangan.",
    tanggal: "2026-07-07T08:00:00Z",
    dibaca: false
  },
  {
    id: "n2",
    partaiId: "p3",
    partaiNama: "GOLKAR",
    tipe: "ditolak",
    pesan: "Dokumen Rekening Bank Partai GOLKAR ditolak oleh Verifikator. Catatan: Nama rekening tidak sama persis dengan SK.",
    tanggal: "2026-07-08T09:05:00Z",
    dibaca: false
  },
  {
    id: "n3",
    partaiId: "p2",
    partaiNama: "GERINDRA",
    tipe: "cair",
    pesan: "Dana Hibah APBD TA 2026 Partai GERINDRA sebesar Rp 991.000.000 telah dicairkan ke rekening partai (No. SP2D: SP2D-900/8892/2026).",
    tanggal: "2026-03-25T14:20:00Z",
    dibaca: true
  },
  {
    id: "n4",
    partaiId: "p1",
    partaiNama: "PDI-P",
    tipe: "lpj_warning",
    pesan: "Laporan Pertanggungjawaban (LPJ) Hibah TA 2025 Partai PDI-P membutuhkan perbaikan berkas kuitansi.",
    tanggal: "2026-07-08T10:00:00Z",
    dibaca: false
  }
];
