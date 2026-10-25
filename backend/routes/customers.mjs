// File: routes/customers.mjs
import express from 'express';
import db from '../db.mjs';

const router = express.Router();

// GET /api/customers
router.get('/', async (req, res) => {
    try {
        const [customers] = await db.query(`
            SELECT c.id AS customer_id, DATE(MAX(o.created_at)) AS date_ordered
            FROM customers c
                     JOIN orders o ON c.id = o.customer_id
            GROUP BY c.id
            ORDER BY c.id ASC
        `);
        res.json(customers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/customers/:id (Untuk riwayat pesanan/More Info)
router.get('/:id', async (req, res) => {
    try {
        const [history] = await db.query(`
            SELECT id AS order_id, date_of_pickup, total_price, amount_paid, created_at 
            FROM orders 
            WHERE customer_id = ? 
            ORDER BY created_at DESC
        `, [req.params.id]);

        res.json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;