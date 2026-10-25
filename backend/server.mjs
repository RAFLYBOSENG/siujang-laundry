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


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Daftarkan Endpoint API
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/dashboard', dashboardRoutes);


app.get('/', (req, res) => {
    res.json({ message: 'API Sistem Laundry Berjalan Lancar...' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});