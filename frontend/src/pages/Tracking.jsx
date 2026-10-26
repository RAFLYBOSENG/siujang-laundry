// File: src/pages/Tracking.jsx
import { useState, useEffect } from 'react';
import { apiUrl } from '../config/api.js';

export default function Tracking() {
  const [activeOrders, setActiveOrders] = useState([]);

  const fetchTracking = async () => {
    try {
      const response = await fetch(apiUrl('/tracking'));
      if (!response.ok) {
        throw new Error(`Tracking request failed with status ${response.status}`);
      }
      setActiveOrders(await response.json());
    } catch (error) {
      console.error('Error fetching tracking data:', error);
    }
  };

  useEffect(() => {
    fetchTracking();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(apiUrl(`/tracking/${orderId}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) {
        throw new Error(`Status update failed with status ${response.status}`);
      }
      await fetchTracking();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Fungsi pembantu untuk memberi warna berdasarkan sisa waktu (Urgency)
  const getUrgency = (pickupDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const pickup = new Date(pickupDate);
    pickup.setHours(0, 0, 0, 0);
    
    const diffTime = pickup - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { color: '#ef4444', bg: '#fef2f2', text: 'Terlambat (Lewat H-1)' };
    if (diffDays === 0) return { color: '#f59e0b', bg: '#fffbeb', text: 'Hari Ini!' };
    return { color: '#10b981', bg: '#ecfdf5', text: `H-${diffDays}` };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: '0 0 8px 0', color: '#1e293b', fontSize: '24px', fontWeight: '700' }}>Tracking Cucian</h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Pantau proses cucian dan update status penyelesaian di sini.</p>
        </div>
        <div style={{ padding: '8px 16px', backgroundColor: '#eff6ff', color: '#0284c7', borderRadius: '20px', fontSize: '14px', fontWeight: '600' }}>
          Cucian Aktif: {activeOrders.length}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {activeOrders.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', backgroundColor: '#fff', borderRadius: '12px', border: '1px dashed #cbd5e1', color: '#94a3b8' }}>
            🎉 Hore! Tidak ada cucian yang mengantri.
          </div>
        ) : (
          activeOrders.map((order) => {
            const urgency = getUrgency(order.date_of_pickup);
            return (
              <div key={order.order_id} style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                
                {/* Header Card (Tgl Pickup & Urgency) */}
                <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', backgroundColor: urgency.bg, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#475569' }}>
                    TGL AMBIL: <span style={{ color: '#0f172a' }}>{new Date(order.date_of_pickup).toLocaleDateString('id-ID')}</span>
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: urgency.color, backgroundColor: '#fff', padding: '2px 8px', borderRadius: '12px', border: `1px solid ${urgency.color}40` }}>
                    {urgency.text}
                  </div>
                </div>

                {/* Body Card (Info Customer & Status) */}
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>ORD-{String(order.order_id).padStart(4, '0')}</div>
                      <div style={{ fontSize: '13px', color: '#64748b' }}>Customer ID: #{order.customer_id}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '16px', fontWeight: '700', color: '#0284c7' }}>${parseFloat(order.total_price).toFixed(2)}</div>
                    </div>
                  </div>

                  {/* Indikator Status Saat Ini */}
                  <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: '500', color: '#64748b' }}>Status Saat Ini:</span>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: order.status === 'Proses' ? '#f59e0b' : '#10b981' }}>
                      {order.status === 'Proses' ? '⏳ Sedang Diproses' : '✅ Siap Diambil'}
                    </span>
                  </div>

                  {/* Tombol Aksi */}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {order.status === 'Proses' ? (
                      <button onClick={() => updateStatus(order.order_id, 'Siap Diambil')} style={{ flex: 1, padding: '10px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                        Tandai Siap Diambil
                      </button>
                    ) : (
                      <button onClick={() => updateStatus(order.order_id, 'Selesai')} style={{ flex: 1, padding: '10px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                        Serahkan & Selesai
                      </button>
                    )}
                  </div>
                  
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}