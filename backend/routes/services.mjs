// File: routes/services.mjs
import express from 'express';
import db from '../db.mjs'; // Wajib pakai .mjs

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const [services] = await db.query('SELECT * FROM services ORDER BY date_insert DESC');
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { id, cloth_type, service_name, price_per_kilo } = req.body;
        await db.query(
            'INSERT INTO services (id, cloth_type, service_name, price_per_kilo) VALUES (?, ?, ?, ?)',
            [id, cloth_type, service_name, price_per_kilo]
        );
        res.status(201).json({ message: 'Layanan berhasil ditambahkan' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { cloth_type, service_name, price_per_kilo } = req.body;
        const [result] = await db.query(
            'UPDATE services SET cloth_type = ?, service_name = ?, price_per_kilo = ? WHERE id = ?',
            [cloth_type, service_name, price_per_kilo, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Layanan tidak ditemukan' });
        res.json({ message: 'Layanan berhasil diupdate' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM services WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Layanan tidak ditemukan' });
        res.json({ message: 'Layanan berhasil dihapus' });
    } catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ message: 'Gagal dihapus: Layanan sudah terpakai.' });
        }
        res.status(500).json({ error: error.message });
    }
});

export default router;