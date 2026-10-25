// Fail: routes/orders.mjs
import express from 'express';
import db from '../db.mjs';

const router = express.Router();

// POST /api/orders - Simpan Transaksi Baharu dari Keranjang (Cart)
router.post('/', async (req, res) => {
    // Ambil satu sambungan khusus dari pool untuk memastikan transaksi diikat pada sesi yang sama
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction(); // Mulakan transaksi SQL

        const { date_of_pickup, total_price, amount_paid, change_amount, cart_items } = req.body;

        // 1. Cipta Pelanggan Baharu secara automatik untuk setiap pesanan
        const [customerResult] = await connection.query('INSERT INTO customers () VALUES ()');
        const customer_id = customerResult.insertId;

        // 2. Simpan Rekod Pesanan Utama
        const [orderResult] = await connection.query(
            'INSERT INTO orders (customer_id, date_of_pickup, total_price, amount_paid, change_amount) VALUES (?, ?, ?, ?, ?)',
            [customer_id, date_of_pickup, total_price, amount_paid, change_amount]
        );
        const order_id = orderResult.insertId;

        // 3. Simpan Setiap Item dalam Keranjang (Loop array cart_items)
        for (let item of cart_items) {
            await connection.query(
                'INSERT INTO order_items (order_id, service_id, kilo, subtotal) VALUES (?, ?, ?, ?)',
                [order_id, item.service_id, item.kilo, item.subtotal]
            );
        }

        await connection.commit(); // Simpan secara kekal jika semua pertanyaan (query) berjaya
        res.status(201).json({
            message: 'Transaksi berjaya disimpan!',
            order_id: order_id,
            customer_id: customer_id
        });

    } catch (error) {
        await connection.rollback(); // Batalkan semua simpanan jika ada sebarang ralat
        res.status(500).json({ error: 'Transaksi gagal dan dibatalkan', detail: error.message });
    } finally {
        connection.release(); // Kembalikan sambungan kepada pool
    }
});

// GET /api/orders - Papar Senarai Pesanan untuk Tujuan Sejarah / Laporan
router.get('/', async (req, res) => {
    try {
        const [orders] = await db.query(`
            SELECT o.id AS order_id, o.date_of_pickup, o.total_price, o.created_at, c.id AS customer_id
            FROM orders o
            JOIN customers c ON o.customer_id = c.id
            ORDER BY o.created_at DESC
        `);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;