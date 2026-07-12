/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

// Firebase imports
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  collection, 
  query, 
  where 
} from 'firebase/firestore';

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

// Initialize Firebase
const firebaseConfigPath = path.resolve(__dirname, 'firebase-applet-config.json');
let firestoreDb: any = null;

if (fs.existsSync(firebaseConfigPath)) {
  try {
    const config = JSON.parse(fs.readFileSync(firebaseConfigPath, 'utf-8'));
    const app = initializeApp({
      apiKey: config.apiKey,
      authDomain: config.authDomain,
      projectId: config.projectId,
      storageBucket: config.storageBucket,
      messagingSenderId: config.messagingSenderId,
      appId: config.appId
    });
    firestoreDb = getFirestore(app, config.firestoreDatabaseId || undefined);
    console.log('Firebase initialized successfully on server-side.');
  } catch (err) {
    console.error('Failed to initialize Firebase on server-side:', err);
  }
}

// Helper functions for Firestore
async function getCollectionDocs(collectionName: string) {
  if (!firestoreDb) return [];
  try {
    const colRef = collection(firestoreDb, collectionName);
    const snapshot = await getDocs(colRef);
    const list: any[] = [];
    snapshot.forEach((docSnapshot) => {
      list.push(docSnapshot.data());
    });
    return list;
  } catch (err) {
    console.error(`Error loading collection ${collectionName}:`, err);
    return [];
  }
}

async function getSingleDoc(collectionName: string, docId: string) {
  if (!firestoreDb) return null;
  try {
    const docRef = doc(firestoreDb, collectionName, docId);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return snapshot.data();
    }
    return null;
  } catch (err) {
    console.error(`Error loading single doc ${collectionName}/${docId}:`, err);
    return null;
  }
}

async function saveSingleDoc(collectionName: string, docId: string, data: any) {
  if (!firestoreDb) return;
  try {
    const docRef = doc(firestoreDb, collectionName, docId);
    await setDoc(docRef, data);
  } catch (err) {
    console.error(`Error saving doc ${collectionName}/${docId}:`, err);
  }
}

async function deleteSingleDoc(collectionName: string, docId: string) {
  if (!firestoreDb) return;
  try {
    const docRef = doc(firestoreDb, collectionName, docId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error(`Error deleting doc ${collectionName}/${docId}:`, err);
  }
}

async function checkAndSeedDatabase() {
  if (!firestoreDb) return;
  try {
    const pengaturanDoc = await getSingleDoc('pengaturan', 'default');
    if (!pengaturanDoc) {
      console.log('Firestore is empty. Seeding initial data...');
      
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
      
      // Save pengaturan
      await saveSingleDoc('pengaturan', 'default', defaultDb.pengaturan);
      
      // Save all lists
      for (const p of defaultDb.partai) {
        await saveSingleDoc('partai', p.id, p);
      }
      for (const d of defaultDb.dokumen) {
        await saveSingleDoc('dokumen', d.id, d);
      }
      for (const h of defaultDb.hibah) {
        await saveSingleDoc('hibah', h.id, h);
      }
      for (const l of defaultDb.lpj) {
        await saveSingleDoc('lpj', l.id, l);
      }
      for (const a of defaultDb.audit) {
        await saveSingleDoc('audit', a.id, a);
      }
      for (const u of defaultDb.pengguna) {
        await saveSingleDoc('pengguna', u.id, u);
      }
      for (const n of defaultDb.notifikasi) {
        await saveSingleDoc('notifikasi', n.id, n);
      }
      
      console.log('Firestore seeding completed successfully.');
    }
  } catch (err) {
    console.error('Error seeding Firestore:', err);
  }
}

// Initialize Database File if not exists (Local backup)
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

async function getDatabaseMerged() {
  if (firestoreDb) {
    try {
      await checkAndSeedDatabase();
      const [partai, dokumen, hibah, lpj, audit, pengguna, notifikasi, pengaturan] = await Promise.all([
        getCollectionDocs('partai'),
        getCollectionDocs('dokumen'),
        getCollectionDocs('hibah'),
        getCollectionDocs('lpj'),
        getCollectionDocs('audit'),
        getCollectionDocs('pengguna'),
        getCollectionDocs('notifikasi'),
        getSingleDoc('pengaturan', 'default')
      ]);
      
      return {
        partai,
        dokumen,
        hibah,
        lpj,
        audit,
        pengguna,
        notifikasi,
        pengaturan: pengaturan || INITIAL_PENGATURAN
      };
    } catch (err) {
      console.error('Failed to fetch from Firestore, falling back to database.json:', err);
    }
  }
  return getDatabase();
}

function saveDatabase(db: any) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '50mb' }));

  // API Routes
  app.get('/api/data', async (req, res) => {
    try {
      const db = await getDatabaseMerged();
      res.json(db);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Master Data Partai
  app.post('/api/partai', async (req, res) => {
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
      
      if (firestoreDb) {
        await saveSingleDoc('partai', p.id, p);
      }
      
      res.json({ success: true, data: p });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete('/api/partai/:id', async (req, res) => {
    try {
      const db = getDatabase();
      const id = req.params.id;
      db.partai = db.partai.filter((p: any) => p.id !== id);
      db.dokumen = db.dokumen.filter((d: any) => d.partaiId !== id);
      db.hibah = db.hibah.filter((h: any) => h.partaiId !== id);
      db.lpj = db.lpj.filter((l: any) => l.partaiId !== id);
      saveDatabase(db);
      
      if (firestoreDb) {
        await deleteSingleDoc('partai', id);
        // Delete related documents
        const docs = await getCollectionDocs('dokumen');
        for (const d of docs) {
          if (d.partaiId === id) await deleteSingleDoc('dokumen', d.id);
        }
        const hibahs = await getCollectionDocs('hibah');
        for (const h of hibahs) {
          if (h.partaiId === id) await deleteSingleDoc('hibah', h.id);
        }
        const lpjs = await getCollectionDocs('lpj');
        for (const l of lpjs) {
          if (l.partaiId === id) await deleteSingleDoc('lpj', l.id);
        }
      }
      
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Dokumen
  app.post('/api/dokumen', async (req, res) => {
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
      
      if (firestoreDb) {
        await saveSingleDoc('dokumen', d.id, d);
      }
      
      res.json({ success: true, data: d });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Verifikasi Dokumen
  app.post('/api/dokumen/verifikasi', async (req, res) => {
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
        const auditLog = {
          id: `a_${Date.now()}`,
          userId: 'v1',
          username: 'verifikator_kesbang',
          role: 'Verifikator',
          aktivitas: 'Verifikasi',
          objek: db.dokumen[idx].tipeDokumen,
          detail: `Verifikasi dokumen partai (ID: ${db.dokumen[idx].partaiId}) menjadi ${statusVerifikasi}. Catatan: ${catatanVerifikator}`,
          timestamp: new Date().toISOString(),
          ipAddress: req.ip || '127.0.0.1'
        };
        db.audit.push(auditLog);

        // Add Notification
        const partaiObj = db.partai.find((p: any) => p.id === db.dokumen[idx].partaiId);
        const notif = {
          id: `n_${Date.now()}`,
          partaiId: db.dokumen[idx].partaiId,
          partaiNama: partaiObj ? partaiObj.singkatan : 'Parpol',
          tipe: statusVerifikasi === 'Lengkap' ? 'diterima' : 'ditolak',
          pesan: `Dokumen "${db.dokumen[idx].tipeDokumen}" partai ${partaiObj ? partaiObj.singkatan : ''} dinyatakan ${statusVerifikasi}. ${catatanVerifikator ? 'Catatan: ' + catatanVerifikator : ''}`,
          tanggal: new Date().toISOString(),
          dibaca: false
        };
        db.notifikasi.push(notif);

        saveDatabase(db);
        
        if (firestoreDb) {
          await saveSingleDoc('dokumen', id, db.dokumen[idx]);
          await saveSingleDoc('audit', auditLog.id, auditLog);
          await saveSingleDoc('notifikasi', notif.id, notif);
        }
        
        res.json({ success: true, data: db.dokumen[idx] });
      } else {
        res.status(404).json({ error: 'Dokumen tidak ditemukan' });
      }
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Data Hibah
  app.post('/api/hibah', async (req, res) => {
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
      let notif: any = null;
      if (h.statusPenyaluran === 'Cair') {
        const partaiObj = db.partai.find((p: any) => p.id === h.partaiId);
        notif = {
          id: `n_cair_${Date.now()}`,
          partaiId: h.partaiId,
          partaiNama: partaiObj ? partaiObj.singkatan : 'Parpol',
          tipe: 'cair',
          pesan: `Dana Hibah TA ${h.tahunAnggaran} Partai ${partaiObj ? partaiObj.singkatan : ''} sebesar Rp ${h.nilaiBantuan.toLocaleString('id-ID')} telah dicairkan (SP2D: ${h.nomorSp2d}).`,
          tanggal: new Date().toISOString(),
          dibaca: false
        };
        db.notifikasi.push(notif);
      }

      saveDatabase(db);
      
      if (firestoreDb) {
        await saveSingleDoc('hibah', h.id, h);
        if (notif) {
          await saveSingleDoc('notifikasi', notif.id, notif);
        }
      }
      
      res.json({ success: true, data: h });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Laporan Pertanggungjawaban (LPJ)
  app.post('/api/lpj', async (req, res) => {
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
      
      if (firestoreDb) {
        await saveSingleDoc('lpj', l.id, l);
      }
      
      res.json({ success: true, data: l });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Pengaturan Sistem
  app.post('/api/settings', async (req, res) => {
    try {
      const db = getDatabase();
      db.pengaturan = req.body;
      saveDatabase(db);
      
      if (firestoreDb) {
        await saveSingleDoc('pengaturan', 'default', db.pengaturan);
      }
      
      res.json({ success: true, data: db.pengaturan });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Audit Logs
  app.post('/api/audit', async (req, res) => {
    try {
      const db = getDatabase();
      const log = req.body;
      log.id = `a_${Date.now()}`;
      log.timestamp = new Date().toISOString();
      log.ipAddress = req.ip || '127.0.0.1';
      db.audit.push(log);
      saveDatabase(db);
      
      if (firestoreDb) {
        await saveSingleDoc('audit', log.id, log);
      }
      
      res.json({ success: true, data: log });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Notifications
  app.post('/api/notifikasi/read', async (req, res) => {
    try {
      const db = getDatabase();
      const { id } = req.body;
      const idx = db.notifikasi.findIndex((n: any) => n.id === id);
      if (idx > -1) {
        db.notifikasi[idx].dibaca = true;
        if (firestoreDb) {
          await saveSingleDoc('notifikasi', id, db.notifikasi[idx]);
        }
      } else if (id === 'all') {
        db.notifikasi.forEach((n: any) => {
          n.dibaca = true;
        });
        saveDatabase(db);
        if (firestoreDb) {
          for (const n of db.notifikasi) {
            await saveSingleDoc('notifikasi', n.id, n);
          }
        }
      } else {
        saveDatabase(db);
      }
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Pengguna CRUD
  app.post('/api/pengguna', async (req, res) => {
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
      
      if (firestoreDb) {
        await saveSingleDoc('pengguna', u.id, u);
      }
      
      res.json({ success: true, data: u });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete('/api/pengguna/:id', async (req, res) => {
    try {
      const db = getDatabase();
      const { id } = req.params;
      db.pengguna = db.pengguna.filter((item: any) => item.id !== id);
      saveDatabase(db);
      
      if (firestoreDb) {
        await deleteSingleDoc('pengguna', id);
      }
      
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Spreadsheet Database Management (Backup, Restore, Raw Edit)
  app.post('/api/database/restore', async (req, res) => {
    try {
      const backupDb = req.body;
      if (backupDb.partai && backupDb.dokumen && backupDb.pengaturan) {
        saveDatabase(backupDb);
        
        if (firestoreDb) {
          // Clear and restore
          const collections = ['partai', 'dokumen', 'hibah', 'lpj', 'audit', 'pengguna', 'notifikasi'];
          for (const col of collections) {
            const docs = await getCollectionDocs(col);
            for (const docObj of docs) {
              await deleteSingleDoc(col, docObj.id);
            }
          }
          await saveSingleDoc('pengaturan', 'default', backupDb.pengaturan);
          for (const p of backupDb.partai) await saveSingleDoc('partai', p.id, p);
          for (const d of backupDb.dokumen) await saveSingleDoc('dokumen', d.id, d);
          for (const h of backupDb.hibah || []) await saveSingleDoc('hibah', h.id, h);
          for (const l of backupDb.lpj || []) await saveSingleDoc('lpj', l.id, l);
          for (const a of backupDb.audit || []) await saveSingleDoc('audit', a.id, a);
          for (const u of backupDb.pengguna || []) await saveSingleDoc('pengguna', u.id, u);
          for (const n of backupDb.notifikasi || []) await saveSingleDoc('notifikasi', n.id, n);
        }
        
        res.json({ success: true, message: 'Database restored successfully' });
      } else {
        res.status(400).json({ error: 'Format backup database tidak valid' });
      }
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/database/reset', async (req, res) => {
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
      
      if (firestoreDb) {
        // Clear and restore default
        const collections = ['partai', 'dokumen', 'hibah', 'lpj', 'audit', 'pengguna', 'notifikasi'];
        for (const col of collections) {
          const docs = await getCollectionDocs(col);
          for (const docObj of docs) {
            await deleteSingleDoc(col, docObj.id);
          }
        }
        await saveSingleDoc('pengaturan', 'default', defaultDb.pengaturan);
        for (const p of defaultDb.partai) await saveSingleDoc('partai', p.id, p);
        for (const d of defaultDb.dokumen) await saveSingleDoc('dokumen', d.id, d);
        for (const h of defaultDb.hibah) await saveSingleDoc('hibah', h.id, h);
        for (const l of defaultDb.lpj) await saveSingleDoc('lpj', l.id, l);
        for (const a of defaultDb.audit) await saveSingleDoc('audit', a.id, a);
        for (const u of defaultDb.pengguna) await saveSingleDoc('pengguna', u.id, u);
        for (const n of defaultDb.notifikasi) await saveSingleDoc('notifikasi', n.id, n);
      }
      
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

