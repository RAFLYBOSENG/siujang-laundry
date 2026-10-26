// File: src/pages/Customers.jsx
import { useState, useEffect } from 'react';
import { apiUrl } from '../config/api.js';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  
  // State untuk Pop-up (Modal) Riwayat Pesanan
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(apiUrl('/customers'));
        setCustomers(await response.json());
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };
    fetchCustomers();
  }, []);

  const handleMoreInfo = async (customerId) => {
    try {
      const response = await fetch(apiUrl(`/customers/${customerId}`));
      setOrderHistory(await response.json());
      setSelectedCustomer(customerId);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching history:', error);
      alert('Gagal mengambil riwayat pelanggan.');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
    setOrderHistory([]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1400px', margin: '0 auto', position: 'relative' }}>
      
      {/* Header Halaman */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: '0 0 8px 0', color: '#1e293b', fontSize: '24px', fontWeight: '700' }}>Data Pelanggan</h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Kelola dan lihat riwayat transaksi pelanggan Anda.</p>
        </div>
        <div style={{ padding: '8px 16px', backgroundColor: '#eff6ff', color: '#0284c7', borderRadius: '20px', fontSize: '14px', fontWeight: '600' }}>
          Total: {customers.length} Pelanggan
        </div>
      </div>
      
      {/* Grid Kartu Pelanggan */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
        {customers.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', backgroundColor: '#fff', borderRadius: '12px', border: '1px dashed #cbd5e1', color: '#94a3b8' }}>
            Belum ada data pelanggan yang tersimpan.
          </div>
        ) : (
          customers.map((cust) => (
            <div 
              key={cust.customer_id} 
              style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', transition: 'transform 0.2s, box-shadow 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05)'; }}
            >
              <div style={{ width: '70px', height: '70px', backgroundColor: '#f1f5f9', borderRadius: '50%', margin: '0 auto 16px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              
              <div style={{ marginBottom: '4px', fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
                Customer #{cust.customer_id}
              </div>
              <div style={{ marginBottom: '20px', fontSize: '13px', color: '#64748b' }}>
                Order Terakhir: {new Date(cust.date_ordered).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
              
              <button 
                onClick={() => handleMoreInfo(cust.customer_id)} 
                style={{ width: '100%', padding: '10px', backgroundColor: '#f8fafc', color: '#0284c7', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#eff6ff'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#f8fafc'}
              >
                Lihat Riwayat
              </button>
            </div>
          ))
        )}
      </div>

      {/* TAMPILAN POP-UP (MODAL) MODERN */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', width: '100%', maxWidth: '600px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '85vh' }}>
            
            {/* Header Modal */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
              <div>
                <h3 style={{ margin: 0, color: '#1e293b', fontSize: '18px', fontWeight: '600' }}>Riwayat Transaksi</h3>
                <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '13px' }}>Customer #{selectedCustomer}</p>
              </div>
              <button onClick={closeModal} style={{ background: '#e2e8f0', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b', transition: 'background 0.2s' }} onMouseEnter={(e) => e.target.style.backgroundColor = '#cbd5e1'} onMouseLeave={(e) => e.target.style.backgroundColor = '#e2e8f0'}>
                ✖
              </button>
            </div>
            
            {/* Body Modal */}
            <div style={{ padding: '24px', overflowY: 'auto', backgroundColor: '#f8fafc' }}>
              {orderHistory.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0' }}>Tidak ada riwayat transaksi.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {orderHistory.map((order) => (
                    <div key={order.order_id} style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                      
                      {/* Header Pesanan (Abu-abu terang) */}
                      <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '15px' }}>
                            ORD-{String(order.order_id).padStart(4, '0')}
                          </div>
                          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                            {new Date(order.created_at).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: '700', color: '#0284c7', fontSize: '16px' }}>
                            ${parseFloat(order.total_price).toFixed(2)}
                          </div>
                          <div style={{ fontSize: '11px', fontWeight: '600', color: '#10b981', padding: '2px 8px', backgroundColor: '#d1fae5', borderRadius: '12px', display: 'inline-block', marginTop: '4px' }}>
                            LUNAS
                          </div>
                        </div>
                      </div>

                      {/* Detail Item Paket yang Dipesan */}
                      <div style={{ padding: '16px' }}>
                        <div style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
                          Detail Layanan:
                        </div>
                        
                        {order.items && order.items.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: idx !== order.items.length - 1 ? '12px' : '0', marginBottom: idx !== order.items.length - 1 ? '12px' : '0', borderBottom: idx !== order.items.length - 1 ? '1px dashed #e2e8f0' : 'none' }}>
                            <div>
                              <div style={{ fontWeight: '600', color: '#334155', fontSize: '14px' }}>
                                {item.service_name}
                              </div>
                              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                                {item.cloth_type} • <span style={{ color: '#0284c7', fontWeight: '500' }}>{item.kilo} kg</span>
                              </div>
                            </div>
                            <div style={{ fontWeight: '600', color: '#475569', fontSize: '14px' }}>
                              ${parseFloat(item.subtotal).toFixed(2)}
                            </div>
                          </div>
                        ))}
                        
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}