// File: src/App.jsx
import { useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import './App.css';

// Import Pages
import Login from './pages/Login.jsx';
import Landing from './pages/Landing.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Orders from './pages/Orders.jsx';
import Services from './pages/Services.jsx';
import Customers from './pages/Customers.jsx';
import Tracking from './pages/Tracking.jsx';

function App() {
    // Cek token saat aplikasi pertama kali dimuat
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [showLanding, setShowLanding] = useState(!localStorage.getItem('token'));
    const navigate = useNavigate();
    const location = useLocation();

    // Fungsi untuk Logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/');
    };

    // Jika belum login, tampilkan HANYA halaman Login
    if (!isAuthenticated) {
        return showLanding
            ? <Landing onContinue={() => setShowLanding(false)} />
            : <Login onLogin={setIsAuthenticated} />;
    }

    return (
        <div className="app-shell">
            <aside className="sidebar">
                <div className="brand">
                    <h1>Laundry Shop</h1>
                    <span>Management dashboard</span>
                </div>
                <nav className="nav-list">
                    <Link className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} to="/">Dashboard</Link>
                    <Link className={`nav-link ${location.pathname === '/orders' ? 'active' : ''}`} to="/orders">Orders</Link>
                    <Link className={`nav-link ${location.pathname === '/services' ? 'active' : ''}`} to="/services">Services</Link>
                    <Link className={`nav-link ${location.pathname === '/customers'  ? 'active' : ''}`} to="/customers">Customers</Link>
                    <Link className={`nav-link ${location.pathname === '/tracking'  ? 'active' : ''}`} to="/tracking">Tracking</Link>

                </nav>
                <button className="logout-button" onClick={handleLogout}><span>↪</span> Logout</button>
            </aside>
            <main className="main-area">
                <header className="topbar">
                    <div>
                        <h2>Welcome back, Admin</h2>
                        <p>Manage your laundry business with ease</p>
                    </div>
                </header>
                <div className="content">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/customers" element={<Customers />} />
                        <Route path="/tracking" element={<Tracking />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
}

export default App;