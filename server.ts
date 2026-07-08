/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProd = process.env.NODE_ENV === 'production';
const PORT = 3000;

// Seed Data
import { 
  INITIAL_PARTAI, 
  generateInitialDokumen, 
  INITIAL_HIBAH, 
  INITIAL_LPJ, 
  INITIAL_AUDIT, 
  INITIAL_PENGGUNA, 
  INITIAL_NOTIFIKASI, 
  INITIAL_PENGATURAN 
} from './src/data';

const dbPath = path.resolve(__dirname, 'database.json');

// Initialize Database File if not exists
function getDatabase() {
  if (!fs.existsSync(dbPath)) {
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
    fs.writeFileSync(dbPath, JSON.stringify(defaultDb, null, 2), 'utf-8');
    return defaultDb;
  }
  try {
    const raw = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse database.json, resetting...', err);
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
    fs.writeFileSync(dbPath, JSON.stringify(defaultDb, null, 2), 'utf-8');
    return defaultDb;
  }
}

function saveDatabase(db: any) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '50mb' }));

  // API Routes
  app.get('/api/data', (req, res) => {
    try {
      const db = getDatabase();
      res.json(db);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Master Data Partai
  app.post('/api/partai', (req, res) => {
    try {
      const db = getDatabase();
      const p = req.body;
      const idx = db.partai.findIndex((item: any) => item.id === p.id);
      if (idx > -1) {
        db.partai[idx] = p;
      } else {
        db.partai.push(p);
      }
      saveDatabase(db);
      res.json({ success: true, data: p });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete('/api/partai/:id', (req, res) => {
    try {
      const db = getDatabase();
      const id = req.params.id;
      db.partai = db.partai.filter((p: any) => p.id !== id);
      db.dokumen = db.dokumen.filter((d: any) => d.partaiId !== id);
      db.hibah = db.hibah.filter((h: any) => h.partaiId !== id);
      db.lpj = db.lpj.filter((l: any) => l.partaiId !== id);
      saveDatabase(db);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Dokumen
  app.post('/api/dokumen', (req, res) => {
    try {
      const db = getDatabase();
      const d = req.body;
      const idx = db.dokumen.findIndex((item: any) => item.id === d.id);
      if (idx > -1) {
        db.dokumen[idx] = d;
      } else {
        db.dokumen.push(d);
      }
      saveDatabase(db);
      res.json({ success: true, data: d });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Verifikasi Dokumen
  app.post('/api/dokumen/verifikasi', (req, res) => {
    try {
      const db = getDatabase();
      const { id, statusVerifikasi, catatanVerifikator, namaVerifikator } = req.body;
      const idx = db.dokumen.findIndex((item: any) => item.id === id);
      if (idx > -1) {
        db.dokumen[idx].statusVerifikasi = statusVerifikasi;
        db.dokumen[idx].catatanVerifikator = catatanVerifikator;
        db.dokumen[idx].updatedAt = new Date().toISOString();
        db.dokumen[idx].uploadedBy = `${namaVerifikator} (Verifikator)`;
        
        // Add log
        db.audit.push({
          id: `a_${Date.now()}`,
          userId: 'v1',
          username: 'verifikator_kesbang',
          role: 'Verifikator',
          aktivitas: 'Verifikasi',
          objek: db.dokumen[idx].tipeDokumen,
          detail: `Verifikasi dokumen partai (ID: ${db.dokumen[idx].partaiId}) menjadi ${statusVerifikasi}. Catatan: ${catatanVerifikator}`,
          timestamp: new Date().toISOString(),
          ipAddress: req.ip || '127.0.0.1'
        });

        // Add Notification
        const partaiObj = db.partai.find((p: any) => p.id === db.dokumen[idx].partaiId);
        db.notifikasi.push({
          id: `n_${Date.now()}`,
          partaiId: db.dokumen[idx].partaiId,
          partaiNama: partaiObj ? partaiObj.singkatan : 'Parpol',
          tipe: statusVerifikasi === 'Lengkap' ? 'diterima' : 'ditolak',
          pesan: `Dokumen "${db.dokumen[idx].tipeDokumen}" partai ${partaiObj ? partaiObj.singkatan : ''} dinyatakan ${statusVerifikasi}. ${catatanVerifikator ? 'Catatan: ' + catatanVerifikator : ''}`,
          tanggal: new Date().toISOString(),
          dibaca: false
        });

        saveDatabase(db);
        res.json({ success: true, data: db.dokumen[idx] });
      } else {
        res.status(404).json({ error: 'Dokumen tidak ditemukan' });
      }
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Data Hibah
  app.post('/api/hibah', (req, res) => {
    try {
      const db = getDatabase();
      const h = req.body;
      const idx = db.hibah.findIndex((item: any) => item.id === h.id);
      if (idx > -1) {
        db.hibah[idx] = h;
      } else {
        db.hibah.push(h);
      }

      // If status is 'Cair', create a notification if it's new
      if (h.statusPenyaluran === 'Cair') {
        const partaiObj = db.partai.find((p: any) => p.id === h.partaiId);
        db.notifikasi.push({
          id: `n_cair_${Date.now()}`,
          partaiId: h.partaiId,
          partaiNama: partaiObj ? partaiObj.singkatan : 'Parpol',
          tipe: 'cair',
          pesan: `Dana Hibah TA ${h.tahunAnggaran} Partai ${partaiObj ? partaiObj.singkatan : ''} sebesar Rp ${h.nilaiBantuan.toLocaleString('id-ID')} telah dicairkan (SP2D: ${h.nomorSp2d}).`,
          tanggal: new Date().toISOString(),
          dibaca: false
        });
      }

      saveDatabase(db);
      res.json({ success: true, data: h });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Laporan Pertanggungjawaban (LPJ)
  app.post('/api/lpj', (req, res) => {
    try {
      const db = getDatabase();
      const l = req.body;
      const idx = db.lpj.findIndex((item: any) => item.id === l.id);
      if (idx > -1) {
        db.lpj[idx] = l;
      } else {
        db.lpj.push(l);
      }
      saveDatabase(db);
      res.json({ success: true, data: l });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Pengaturan Sistem
  app.post('/api/settings', (req, res) => {
    try {
      const db = getDatabase();
      db.pengaturan = req.body;
      saveDatabase(db);
      res.json({ success: true, data: db.pengaturan });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Audit Logs
  app.post('/api/audit', (req, res) => {
    try {
      const db = getDatabase();
      const log = req.body;
      log.id = `a_${Date.now()}`;
      log.timestamp = new Date().toISOString();
      log.ipAddress = req.ip || '127.0.0.1';
      db.audit.push(log);
      saveDatabase(db);
      res.json({ success: true, data: log });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Notifications
  app.post('/api/notifikasi/read', (req, res) => {
    try {
      const db = getDatabase();
      const { id } = req.body;
      const idx = db.notifikasi.findIndex((n: any) => n.id === id);
      if (idx > -1) {
        db.notifikasi[idx].dibaca = true;
      } else if (id === 'all') {
        db.notifikasi.forEach((n: any) => n.dibaca = true);
      }
      saveDatabase(db);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Pengguna CRUD
  app.post('/api/pengguna', (req, res) => {
    try {
      const db = getDatabase();
      const u = req.body;
      const idx = db.pengguna.findIndex((item: any) => item.id === u.id);
      if (idx > -1) {
        db.pengguna[idx] = u;
      } else {
        db.pengguna.push(u);
      }
      saveDatabase(db);
      res.json({ success: true, data: u });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete('/api/pengguna/:id', (req, res) => {
    try {
      const db = getDatabase();
      const { id } = req.params;
      db.pengguna = db.pengguna.filter((item: any) => item.id !== id);
      saveDatabase(db);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Spreadsheet Database Management (Backup, Restore, Raw Edit)
  app.post('/api/database/restore', (req, res) => {
    try {
      const backupDb = req.body;
      if (backupDb.partai && backupDb.dokumen && backupDb.pengaturan) {
        saveDatabase(backupDb);
        res.json({ success: true, message: 'Database restored successfully' });
      } else {
        res.status(400).json({ error: 'Format backup database tidak valid' });
      }
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/database/reset', (req, res) => {
    try {
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
      saveDatabase(defaultDb);
      res.json({ success: true, data: defaultDb });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Serving Web Content
  if (isProd) {
    // Serve Static Production Files
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    // Vite Dev Integration Middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT} in ${isProd ? 'production' : 'development'} mode`);
  });
}

startServer().catch((err) => {
  console.error('Server startup failed:', err);
});
