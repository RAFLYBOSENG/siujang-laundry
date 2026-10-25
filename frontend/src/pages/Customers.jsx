// File: src/pages/Customers.jsx
import { useState, useEffect } from 'react';

export default function Customers() {
    const [customers, setCustomers] = useState([]);

    // State untuk Pop-up (Modal) Riwayat Pesanan
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [orderHistory, setOrderHistory] = useState([]);

    // Ambil daftar pelanggan awal
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/customers');
                const data = await response.json();
                setCustomers(data);
            } catch (error) {
                console.error('Error fetching customers:', error);
            }
        };
        fetchCustomers();
    }, []);

    // Fungsi saat tombol "More Info" diklik
    const handleMoreInfo = async (customerId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/customers/${customerId}`);
            const historyData = await response.json();

            setOrderHistory(historyData);
            setSelectedCustomer(customerId);
            setIsModalOpen(true); // Tampilkan Pop-up
        } catch (error) {
            console.error('Error fetching history:', error);
            alert('Gagal mengambil riwayat pelanggan.');
        }
    };

    // Fungsi tutup Pop-up
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedCustomer(null);
        setOrderHistory([]);
    };

    return (
        <div className="panel customers-page" style={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '5px', minHeight: '100%', position: 'relative' }}>
            <div style={{ backgroundColor: '#337ab7', color: 'white', padding: '10px' }}>
                <strong>All Customers</strong>
            </div>

            <div className="customer-grid" style={{ padding: '20px', display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {customers.length === 0 ? (
                    <p style={{ color: '#888' }}>Belum ada data pelanggan.</p>
                ) : (
                    customers.map((cust) => (
                        <div
                            key={cust.customer_id}
                            style={{ width: '200px', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '20px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}
                        >
                            <div style={{ width: '90px', height: '90px', backgroundColor: '#4c7b9e', borderRadius: '50%', margin: '0 auto 15px auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="50" height="50" viewBox="0 0 24 24" fill="white">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                </svg>
                            </div>

                            <div style={{ marginBottom: '10px', fontSize: '14px' }}>
                                Customer ID: {cust.customer_id}
                            </div>
                            <div style={{ marginBottom: '20px', fontSize: '12px', color: '#555' }}>
                                Date Ordered: {new Date(cust.date_ordered).toISOString().split('T')[0]}
                            </div>

                            <button
                                onClick={() => handleMoreInfo(cust.customer_id)}
                                style={{ width: '100%', padding: '8px', backgroundColor: '#337ab7', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                More Info
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* TAMPILAN POP-UP (MODAL) RIWAYAT TRANSAKSI */}
            {isModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '500px', maxWidth: '90%', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                            <h3 style={{ margin: 0, color: '#337ab7' }}>Order History - Customer ID: {selectedCustomer}</h3>
                            <button onClick={closeModal} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#aaa' }}>✖</button>
                        </div>

                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {orderHistory.length === 0 ? (
                                <p style={{ textAlign: 'center', color: '#888' }}>Tidak ada riwayat.</p>
                            ) : (
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                                    <thead style={{ backgroundColor: '#f9f9f9' }}>
                                    <tr>
                                        <th style={{ padding: '8px', borderBottom: '2px solid #ddd', textAlign: 'left' }}>Order ID</th>
                                        <th style={{ padding: '8px', borderBottom: '2px solid #ddd', textAlign: 'left' }}>Date</th>
                                        <th style={{ padding: '8px', borderBottom: '2px solid #ddd', textAlign: 'right' }}>Total ($)</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {orderHistory.map((order) => (
                                        <tr key={order.order_id}>
                                            <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>ORD-{order.order_id}</td>
                                            <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{new Date(order.created_at).toLocaleDateString()}</td>
                                            <td style={{ padding: '8px', borderBottom: '1px solid #eee', textAlign: 'right' }}>{parseFloat(order.total_price).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}