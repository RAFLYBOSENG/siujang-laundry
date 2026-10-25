// File: src/pages/Orders.jsx
import { useState, useEffect } from 'react';

export default function Orders() {
    const [services, setServices] = useState([]);
    const [cart, setCart] = useState([]);

    // State khusus untuk menampung input "Kilo" di masing-masing Card Layanan
    const [kiloInputs, setKiloInputs] = useState({});

    // State untuk form Pembayaran
    const [dateOfPickup, setDateOfPickup] = useState('');
    const [amountPaid, setAmountPaid] = useState('');

    // Hitung Total Belanjaan Otomatis
    const totalPrice = cart.reduce((sum, item) => sum + item.subtotal, 0);

    // Hitung Kembalian Otomatis
    const changeAmount = amountPaid ? (parseFloat(amountPaid) - totalPrice) : 0;

    // 1. Ambil data layanan dari Backend
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/services');
                const data = await response.json();
                setServices(data);
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        };
        fetchServices();
    }, []);

    // 2. Handle perubahan input Kilo pada Card
    const handleKiloChange = (id, value) => {
        setKiloInputs({ ...kiloInputs, [id]: value });
    };

    // 3. Masukkan layanan ke Keranjang (Cart)
    const handleAddToCart = (service) => {
        const kilo = parseFloat(kiloInputs[service.id]);
        if (!kilo || kilo <= 0) {
            return alert('Masukkan jumlah Kilo yang valid terlebih dahulu!');
        }

        const newItem = {
            service_id: service.id,
            cloth_type: service.cloth_type,
            service_name: service.service_name,
            price_per_kilo: service.price_per_kilo,
            kilo: kilo,
            subtotal: kilo * parseFloat(service.price_per_kilo)
        };

        setCart([...cart, newItem]);

        // Reset input kilo setelah dimasukkan ke keranjang
        setKiloInputs({ ...kiloInputs, [service.id]: '' });
    };

    // 4. Proses Pembayaran ke Backend
    const handlePay = async () => {
        if (cart.length === 0) return alert('Keranjang masih kosong!');
        if (!dateOfPickup) return alert('Masukkan tanggal pengambilan (Date of Pickup)!');
        if (!amountPaid || parseFloat(amountPaid) < totalPrice) {
            return alert('Jumlah bayar (Amount) tidak boleh kurang dari Total!');
        }

        // Siapkan data sesuai format API Backend
        const payload = {
            date_of_pickup: dateOfPickup,
            total_price: totalPrice,
            amount_paid: parseFloat(amountPaid),
            change_amount: changeAmount,
            cart_items: cart.map(item => ({
                service_id: item.service_id,
                kilo: item.kilo,
                subtotal: item.subtotal
            }))
        };

        try {
            const response = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert('Transaksi Berhasil Disimpan!');
                // Bersihkan seluruh form & keranjang setelah berhasil bayar
                setCart([]);
                setDateOfPickup('');
                setAmountPaid('');
            } else {
                const errorData = await response.json();
                alert(`Gagal: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error saving order:', error);
        }
    };

    return (
        <div className="orders-layout" style={{ display: 'flex', gap: '20px', height: '100%' }}>

            {/* KOLOM KIRI: Daftar Layanan (Available Services) */}
            <div className="panel orders-services" style={{ flex: 2, backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '5px' }}>
                <div style={{ backgroundColor: '#2a5a7d', color: 'white', padding: '10px' }}>
                    <strong>Available Services</strong>
                </div>

                <div className="service-grid" style={{ padding: '15px', display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                    {services.map((srv) => (
                        <div key={srv.id} style={{ width: '200px', border: '1px solid #ddd', borderRadius: '5px', textAlign: 'center', paddingBottom: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                            <div style={{ fontWeight: 'bold', padding: '5px 0' }}>{srv.cloth_type}</div>

                            {/* Placeholder Gambar (Meniru kotak merah/biru pada desain asli) */}
                            <div style={{ backgroundColor: '#4a2c5e', color: 'white', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
                                SERVICE<br/>IMAGE
                            </div>

                            <div style={{ padding: '10px' }}>
                                <div style={{ fontSize: '13px', marginBottom: '10px', height: '35px' }}>
                                    {srv.service_name} <br/> <strong>${srv.price_per_kilo}</strong>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', marginBottom: '10px' }}>
                                    <label style={{ fontSize: '12px' }}>Kilo:</label>
                                    <input
                                        type="number"
                                        min="0.1"
                                        step="0.1"
                                        value={kiloInputs[srv.id] || ''}
                                        onChange={(e) => handleKiloChange(srv.id, e.target.value)}
                                        style={{ width: '60px', padding: '3px' }}
                                    />
                                </div>

                                <button
                                    onClick={() => handleAddToCart(srv)}
                                    style={{ backgroundColor: '#337ab7', color: 'white', border: 'none', padding: '5px 20px', borderRadius: '3px', cursor: 'pointer' }}
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* KOLOM KANAN: Keranjang & Pembayaran (Cart) */}
            <div className="panel cart-panel" style={{ flex: 1, backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '5px', padding: '15px', display: 'flex', flexDirection: 'column' }}>

                <div style={{ border: '1px solid #337ab7', borderRadius: '5px', overflow: 'hidden', minHeight: '200px', marginBottom: '15px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                        <thead style={{ backgroundColor: '#337ab7', color: 'white' }}>
                        <tr>
                            <th style={{ padding: '8px' }}>Type</th>
                            <th style={{ padding: '8px' }}>Service</th>
                            <th style={{ padding: '8px' }}>Kilo</th>
                            <th style={{ padding: '8px' }}>Price</th>
                        </tr>
                        </thead>
                        <tbody>
                        {cart.length === 0 ? (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>No content in table</td>
                            </tr>
                        ) : (
                            cart.map((item, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '8px' }}>{item.cloth_type}</td>
                                    <td style={{ padding: '8px' }}>{item.service_name}</td>
                                    <td style={{ padding: '8px', textAlign: 'center' }}>{item.kilo}</td>
                                    <td style={{ padding: '8px', textAlign: 'right' }}>${item.subtotal.toFixed(2)}</td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                <button
                    onClick={() => setCart([])}
                    style={{ alignSelf: 'center', backgroundColor: '#337ab7', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '3px', cursor: 'pointer', marginBottom: '20px' }}
                >
                    Refresh
                </button>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '10px' }}>
                    <label style={{ marginRight: '10px' }}>Date of Pickup:</label>
                    <input
                        type="date"
                        value={dateOfPickup}
                        onChange={(e) => setDateOfPickup(e.target.value)}
                        style={{ padding: '5px' }}
                    />
                </div>

                <div style={{ textAlign: 'right', fontSize: '18px', margin: '15px 0' }}>
                    Total: <strong>${totalPrice.toFixed(2)}</strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '10px' }}>
                    <label style={{ marginRight: '10px' }}>Amount:</label>
                    <input
                        type="number"
                        value={amountPaid}
                        onChange={(e) => setAmountPaid(e.target.value)}
                        placeholder="$0.0"
                        style={{ padding: '5px', width: '100px', textAlign: 'right' }}
                    />
                </div>

                <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                    Change: <strong>${changeAmount < 0 ? '0.00' : changeAmount.toFixed(2)}</strong>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={handlePay}
                        style={{ flex: 1, backgroundColor: '#337ab7', color: 'white', border: 'none', padding: '15px', fontSize: '16px', borderRadius: '3px', cursor: 'pointer' }}
                    >
                        Pay
                    </button>
                </div>

            </div>

        </div>
    );
}