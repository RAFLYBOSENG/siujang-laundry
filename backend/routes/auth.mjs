// File: routes/auth.mjs
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db.mjs'; // Wajib pakai .mjs

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query(
            'INSERT INTO admins (username, password) VALUES (?, ?)',
            [username, hashedPassword]
        );
        res.status(201).json({ message: 'Akun admin berhasil dibuat!' });
    } catch (error) {
        res.status(500).json({ error: 'Gagal membuat admin', detail: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const [admins] = await db.query('SELECT * FROM admins WHERE username = ?', [username]);
        if (admins.length === 0) return res.status(401).json({ message: 'Username tidak ditemukan!' });

        const validPassword = await bcrypt.compare(password, admins[0].password);
        if (!validPassword) return res.status(401).json({ message: 'Password salah!' });

        const token = jwt.sign(
            { id: admins[0].id, username: admins[0].username },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({ message: 'Login sukses!', token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;