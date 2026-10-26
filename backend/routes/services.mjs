// File: routes/services.mjs
import express from 'express';
import multer from 'multer';
import path from 'path';
import db from '../db.mjs';

const router = express.Router();

// Konfigurasi penyimpanan file Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Simpan ke folder uploads
    },
    filename: (req, file, cb) => {
        // Beri nama unik menggunakan timestamp agar tidak bentrok
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// GET Semua Layanan
router.get('/', async (req, res) => {
    try {
        const [services] = await db.query('SELECT * FROM services ORDER BY date_insert DESC');
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/services/bulk - Import Data dari Excel
router.post('/bulk', async (req, res) => {
    const items = req.body;
    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'Data kosong atau format salah' });
    }

    try {
        // Lakukan perulangan untuk menyimpan setiap baris Excel ke database
        // Menggunakan ON DUPLICATE KEY UPDATE agar jika ID sudah ada, ia akan menimpa/update datanya
        for (const item of items) {
            await db.query(`
                INSERT INTO services (id, cloth_type, service_name, price_per_kilo) 
                VALUES (?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE 
                cloth_type = VALUES(cloth_type), 
                service_name = VALUES(service_name), 
                price_per_kilo = VALUES(price_per_kilo)
            `, [item.id, item.cloth_type, item.service_name, item.price_per_kilo]);
        }
        res.json({ message: `Berhasil mengimport ${items.length} layanan!` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST (Insert) Layanan Baru + Gambar
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { id, cloth_type, service_name, price_per_kilo } = req.body;
        // Jika ada file yg diupload, simpan nama filenya, jika tidak biarkan null
        const image_url = req.file ? `/uploads/${req.file.filename}` : null;

        await db.query(
            'INSERT INTO services (id, cloth_type, service_name, price_per_kilo, image_url) VALUES (?, ?, ?, ?, ?)',
            [id, cloth_type, service_name, price_per_kilo, image_url]
        );
        res.status(201).json({ message: 'Layanan berhasil ditambahkan' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT (Update) Layanan + Gambar
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const { cloth_type, service_name, price_per_kilo } = req.body;
        
        let query = 'UPDATE services SET cloth_type = ?, service_name = ?, price_per_kilo = ? WHERE id = ?';
        let params = [cloth_type, service_name, price_per_kilo, req.params.id];

        // Jika user mengupload gambar baru, update juga kolom image_url
        if (req.file) {
            query = 'UPDATE services SET cloth_type = ?, service_name = ?, price_per_kilo = ?, image_url = ? WHERE id = ?';
            params = [cloth_type, service_name, price_per_kilo, `/uploads/${req.file.filename}`, req.params.id];
        }

        const [result] = await db.query(query, params);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Layanan tidak ditemukan' });
        res.json({ message: 'Layanan berhasil diupdate' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE Layanan
router.delete('/:id', async (req, res) => {
    // (Kode delete tetap sama seperti sebelumnya)
    try {
        const [result] = await db.query('DELETE FROM services WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Layanan tidak ditemukan' });
        res.json({ message: 'Layanan berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;