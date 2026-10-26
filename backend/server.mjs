// Fail: server.mjs
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import db from './db.mjs'

// Import Routes
import authRoutes from './routes/auth.mjs';
import serviceRoutes from './routes/services.mjs';
import orderRoutes from './routes/orders.mjs'; // Tambah baris ini
import customerRoutes from './routes/customers.mjs';
import dashboardRoutes from './routes/dashboard.mjs';
import trackingRoutes from './routes/tracking.mjs'; // Tambah baris ini


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Daftarkan Endpoint API
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.json({ message: 'API Sistem Laundry Berjalan Lancar...' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});