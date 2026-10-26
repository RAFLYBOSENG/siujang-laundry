// File: routes/dashboard.mjs
import express from 'express';
import db from '../db.mjs';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const [[{ totalCustomers }]] = await db.query('SELECT COUNT(id) AS totalCustomers FROM customers');
        const [[{ totalOrders }]] = await db.query('SELECT COUNT(id) AS totalOrders FROM orders');
        const [[{ totalIncome }]] = await db.query('SELECT SUM(total_price) AS totalIncome FROM orders');
        const [[{ todayIncome }]] = await db.query('SELECT SUM(total_price) AS todayIncome FROM orders WHERE DATE(created_at) = CURDATE()');

        // Data Grafik 1: Tren Harian (Pesanan & Pendapatan)
        const [chartData] = await db.query(`
            SELECT 
                DATE(created_at) as date,
                COUNT(id) as orders,
                SUM(total_price) as income
            FROM orders
            GROUP BY DATE(created_at)
            ORDER BY date ASC
        `);

        // Data Grafik 2: Popularitas Layanan (Untuk Pie Chart)
        const [serviceStats] = await db.query(`
            SELECT s.service_name AS name, COUNT(oi.id) AS value
            FROM order_items oi
            JOIN services s ON oi.service_id = s.id
            GROUP BY s.service_name
        `);

        res.json({
            summary: {
                totalCustomers: totalCustomers || 0,
                totalOrders: totalOrders || 0,
                totalIncome: totalIncome || 0,
                todayIncome: todayIncome || 0
            },
            charts: chartData,
            serviceStats
        });
    } catch (error) {
        // Cek terminal backend Anda, error aslinya akan muncul di sana
        console.error("Dashboard API Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

export default router;