// File: src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { apiUrl } from '../config/api.js';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

export default function Dashboard() {
  const [data, setData] = useState({
    summary: { totalCustomers: 0, todayIncome: 0, totalIncome: 0, totalOrders: 0 },
    charts: [],
    serviceStats: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch(apiUrl('/dashboard'));
        const result = await response.json();
        if (response.ok) setData(result);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <h3 style={{ color: '#94a3b8' }}>Memuat data statistik...</h3>
      </div>
    );
  }

  const { summary, charts, serviceStats } = data;

  return (
    <div className="dashboard-page" style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* 4 KARTU RINGKASAN ATAS */}
      <div className="summary-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        <SummaryCard 
          title="Total Customers" 
          value={summary.totalCustomers} 
          icon="👥" 
          color="#3b82f6" 
          bgColor="#eff6ff" 
        />
        <SummaryCard 
          title="Hari Ini (Income)" 
          value={`$${parseFloat(summary.todayIncome).toFixed(2)}`} 
          icon="📈" 
          color="#10b981" 
          bgColor="#ecfdf5" 
        />
        <SummaryCard 
          title="Total Pendapatan" 
          value={`$${parseFloat(summary.totalIncome).toFixed(2)}`} 
          icon="💰" 
          color="#f59e0b" 
          bgColor="#fffbeb" 
        />
        <SummaryCard 
          title="Total Transaksi" 
          value={summary.totalOrders} 
          icon="🛒" 
          color="#8b5cf6" 
          bgColor="#f5f3ff" 
        />
      </div>

      {/* AREA GRAFIK BAWAH - Grid 2x2 (Simetris) */}
      <div className="dashboard-charts" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '24px' }}>
        {/* Grafik 1: Area Chart (Tren Pelanggan/Transaksi) */}
        <div className="chart-card" style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h4 style={{ margin: '0 0 20px 0', color: '#334155', fontSize: '15px', fontWeight: '600' }}>Tren Transaksi Harian</h4>
            <div style={{ height: '280px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={charts} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} tickMargin={10} stroke="#94a3b8" />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} tickMargin={10} stroke="#94a3b8" />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorOrders)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
        </div>

        {/* Grafik 2: Line Chart (Aktivitas Pemesanan / Orders) */}
        <div className="chart-card" style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <h4 style={{ margin: '0 0 20px 0', color: '#334155', fontSize: '15px', fontWeight: '600' }}>Aktivitas Pemesanan</h4>
          <div style={{ height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} tickMargin={10} stroke="#94a3b8" />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tickMargin={10} stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                <Line type="monotone" dataKey="orders" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grafik 3: Bar Chart (Pendapatan) */}
        <div className="chart-card" style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <h4 style={{ margin: '0 0 20px 0', color: '#334155', fontSize: '15px', fontWeight: '600' }}>Pendapatan Harian ($)</h4>
          <div style={{ height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} tickMargin={10} stroke="#94a3b8" />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tickMargin={10} stroke="#94a3b8" />
                <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grafik 4: Pie Chart (Popularitas Layanan) */}
        <div className="chart-card" style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#334155', fontSize: '15px', fontWeight: '600' }}>Layanan Paling Populer</h4>
          <div style={{ height: '280px' }}>
            {serviceStats.length === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>Belum ada data layanan terjual</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={serviceStats} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value">
                    {serviceStats.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

// Komponen Pembantu untuk Kartu Ringkasan
function SummaryCard({ title, value, icon, color, bgColor }) {
  return (
    <div className="summary-card" style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
      <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: bgColor, color: color, fontSize: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500', marginBottom: '4px' }}>{title}</div>
        <div style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b' }}>{value}</div>
      </div>
    </div>
  );
}