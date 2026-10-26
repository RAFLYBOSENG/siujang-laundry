// File: routes/tracking.mjs
import express from 'express';
import db from '../db.mjs';

const router = express.Router();

// GET: Ambil semua pesanan yang belum selesai (Proses / Siap Diambil)
router.get('/', async (req, res) => {
    try {
        const [orders] = await db.query(`
            SELECT id AS order_id, customer_id, created_at, date_of_pickup, status, total_price 
            FROM orders 
            WHERE status != 'Selesai' 
            ORDER BY date_of_pickup ASC
        `);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT: Update status pesanan
router.put('/:id', async (req, res) => {
    try {
        const { status } = req.body;
        await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
        res.json({ message: 'Status berhasil diperbarui' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;