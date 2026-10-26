// File: src/pages/Login.jsx
import { useState } from 'react';
import { apiUrl } from '../config/api.js';

export default function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch(apiUrl('/auth/login'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Simpan token ke localStorage agar sesi tetap aktif meski browser di-refresh
                localStorage.setItem('token', data.token);
                onLogin(true); // Beritahu App.jsx bahwa login sukses
            } else {
                setError(data.message || 'Gagal login!');
            }
        } catch {
            setError('Terjadi kesalahan koneksi ke server.');
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-brand">LAUNDRY SHOP</div>
                <h2>Welcome back</h2>
                <p className="login-subtitle">Sign in to manage your business</p>

                {error && <div className="login-error">{error}</div>}

                <form onSubmit={handleLogin} className="login-form">
                    <div className="field">
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="field">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary login-submit">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}