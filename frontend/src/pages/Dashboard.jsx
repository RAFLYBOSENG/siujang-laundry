// File: src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
    const [data, setData] = useState({
        summary: { totalCustomers: 0, todayIncome: 0, totalIncome: 0, totalOrders: 0 },
        charts: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/dashboard');
                const result = await response.json();

                // Jangan timpa state dengan pesan error dari backend.
                if (response.ok) {
                    setData(result);
                } else {
                    console.error('API Error:', result.error);
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    const { summary, charts } = data;

    if (loading) return <h2>Loading Dashboard...</h2>;
    if (!summary) return <h2>Gagal memuat data Dashboard. Silakan cek console/backend.</h2>;

    return (
        <div className="dashboard-page" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* 4 KARTU RINGKASAN ATAS */}
            <div className="summary-grid" style={{ display: 'flex', gap: '20px', justifyContent: 'space-between' }}>
                <SummaryCard title="Customers" value={summary.totalCustomers} icon="👥" />
                <SummaryCard title="Today's Income" value={`$${parseFloat(summary.todayIncome).toFixed(1)}`} icon="💵" />
                <SummaryCard title="Total Income" value={`$${parseFloat(summary.totalIncome).toFixed(1)}`} icon="💰" />
                <SummaryCard title="Total Orders" value={summary.totalOrders} icon="🛒" />
            </div>

            {/* AREA GRAFIK BAWAH */}
            <div className="dashboard-charts" style={{ display: 'flex', gap: '20px', height: '400px' }}>

                {/* Kolom Kiri: 2 Grafik Horizontal */}
                <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {/* Area Chart: Number of Customers / Orders over time */}
                    <div style={{ flex: 1, backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '5px', padding: '10px' }}>
                        <h4 style={{ textAlign: 'center', margin: '0 0 10px 0' }}>Number of Customers</h4>
                        <ResponsiveContainer width="100%" height="80%">
                            <AreaChart data={charts}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" fontSize={12} />
                                <YAxis fontSize={12} />
                                <Tooltip />
                                <Area type="monotone" dataKey="orders" stroke="#e74c3c" fill="#fadbd8" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Line Chart: Number of Orders */}
                    <div style={{ flex: 1, backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '5px', padding: '10px' }}>
                        <h4 style={{ textAlign: 'center', margin: '0 0 10px 0' }}>Number of Orders</h4>
                        <ResponsiveContainer width="100%" height="80%">
                            <LineChart data={charts}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" fontSize={12} />
                                <YAxis fontSize={12} />
                                <Tooltip />
                                <Line type="monotone" dataKey="orders" stroke="#e67e22" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                </div>

                {/* Kolom Kanan: 1 Bar Chart Vertikal */}
                <div style={{ flex: 1, backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '5px', padding: '10px' }}>
                    <h4 style={{ textAlign: 'center', margin: '0 0 10px 0' }}>Income Per Day</h4>
                    <ResponsiveContainer width="100%" height="90%">
                        <BarChart data={charts}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" fontSize={12} />
                            <YAxis fontSize={12} />
                            <Tooltip />
                            <Bar dataKey="income" fill="#e67e22" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

            </div>
        </div>
    );
}

// Komponen Pembantu untuk Kartu Ringkasan
function SummaryCard({ title, value, icon }) {
    return (
        <div style={{ flex: 1, backgroundColor: '#337ab7', color: 'white', borderRadius: '5px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '40px' }}>{icon}</div>
            <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '14px', marginBottom: '10px' }}>{title}</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{value}</div>
            </div>
        </div>
    );
}