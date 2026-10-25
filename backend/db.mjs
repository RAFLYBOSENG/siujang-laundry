import mysql from 'mysql2/promise';
import 'dotenv/config';

// Membuat Connection Pool
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Top-level await untuk tes koneksi di awal
try {
    const connection = await db.getConnection();
    console.log('✅ Berhasil terhubung ke database laundry_db!');
    connection.release();
} catch (error) {
    console.error('❌ Gagal terhubung ke database:', error.message);
    process.exit(1); // Hentikan aplikasi jika database gagal konek
}

export default db;