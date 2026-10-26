// File: src/pages/Orders.jsx
import { useState, useEffect } from 'react';
import { apiUrl, assetUrl } from '../config/api.js';

export default function Orders() {
  const [services, setServices] = useState([]);
  const [cart, setCart] = useState([]);
  const [kiloInputs, setKiloInputs] = useState({});
  const [dateOfPickup, setDateOfPickup] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [clothSearch, setClothSearch] = useState('');
  
  // State untuk menyimpan data transaksi terakhir agar bisa dicetak struknya
  const [lastTransaction, setLastTransaction] = useState(null);

  const totalPrice = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const changeAmount = amountPaid ? (parseFloat(amountPaid) - totalPrice) : 0;
  const filteredServices = services.filter((service) =>
    String(service.cloth_type || '').toLowerCase().includes(clothSearch.trim().toLowerCase())
  );

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(apiUrl('/services'));
        setServices(await response.json());
      } catch (error) {
        console.error(error);
      }
    };
    fetchServices();
  }, []);

  const handleKiloChange = (id, value) => setKiloInputs({ ...kiloInputs, [id]: value });

  const handleAddToCart = (service) => {
    const kilo = parseFloat(kiloInputs[service.id]);
    if (!kilo || kilo <= 0) return alert('Masukkan jumlah Kilo yang valid!');

    const newItem = { ...service, service_id: service.id, kilo, subtotal: kilo * parseFloat(service.price_per_kilo) };
    setCart([...cart, newItem]);
    setKiloInputs({ ...kiloInputs, [service.id]: '' });
    setLastTransaction(null); // Reset struk sebelumnya jika ada transaksi baru
  };

  const handlePay = async () => {
    if (cart.length === 0) return alert('Keranjang kosong!');
    if (!dateOfPickup) return alert('Masukkan tanggal pengambilan!');
    if (!amountPaid || parseFloat(amountPaid) < totalPrice) return alert('Uang pembayaran kurang!');

    const payload = {
      date_of_pickup: dateOfPickup,
      total_price: totalPrice,
      amount_paid: parseFloat(amountPaid),
      change_amount: changeAmount,
      cart_items: cart.map(item => ({ service_id: item.service_id, kilo: item.kilo, subtotal: item.subtotal }))
    };

    try {
      const response = await fetch(apiUrl('/orders'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        // Simpan data untuk struk sebelum keranjang dikosongkan
        setLastTransaction({ cart: [...cart], totalPrice, amountPaid, changeAmount, dateOfPickup });
        
        alert('Transaksi Berhasil!');
        setCart([]);
        setDateOfPickup('');
        setAmountPaid('');
      } else {
        const err = await response.json();
        alert(`Gagal: ${err.message}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Fungsi Cetak Struk (Thermal Printer Format)
  const printReceipt = () => {
    if (!lastTransaction) return;
    const { cart, totalPrice, amountPaid, changeAmount, dateOfPickup } = lastTransaction;
    
    const printWindow = window.open('', '', 'width=350,height=500');
    printWindow.document.write(`
      <html>
        <head>
          <title>Struk Laundry</title>
          <style>
            body { font-family: 'Courier New', Courier, monospace; font-size: 12px; padding: 10px; color: #000; }
            .center { text-align: center; }
            .line { border-bottom: 1px dashed #000; margin: 10px 0; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
            th, td { text-align: left; padding: 4px 0; }
            .right { text-align: right; }
          </style>
        </head>
        <body>
          <div class="center">
            <h2>SIUJANG LAUNDRY</h2>
            <p>Tgl Pengambilan: ${dateOfPickup}</p>
          </div>
          <div class="line"></div>
          <table>
            <thead><tr><th>Item</th><th class="right">Sub</th></tr></thead>
            <tbody>
              ${cart.map(item => `
                <tr>
                  <td>${item.service_name} (${item.kilo}kg)<br/><small>${item.cloth_type}</small></td>
                  <td class="right">$${item.subtotal.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="line"></div>
          <table>
            <tr><td><strong>TOTAL</strong></td><td class="right"><strong>$${totalPrice.toFixed(2)}</strong></td></tr>
            <tr><td>Tunai</td><td class="right">$${parseFloat(amountPaid).toFixed(2)}</td></tr>
            <tr><td>Kembali</td><td class="right">$${changeAmount.toFixed(2)}</td></tr>
          </table>
          <div class="line"></div>
          <div class="center"><p>Terima Kasih Telah Memilih Layanan Kami!</p></div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
      <div className="orders-layout" style={{ display: 'flex', gap: '24px', height: '100%', maxWidth: '1400px', margin: '0 auto' }}>
        
      {/* KOLOM KIRI: Katalog Layanan */}
      <div className="orders-services" style={{ flex: 7, backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <div className="services-catalog-header" style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', borderRadius: '12px 12px 0 0' }}>
          <h3 style={{ fontSize: '15px', color: '#1e293b' }}>Katalog Layanan</h3>
          <label className="cloth-search">
            <span className="visually-hidden">Cari berdasarkan bahan kain</span>
            <input
              type="search"
              value={clothSearch}
              onChange={(event) => setClothSearch(event.target.value)}
              placeholder="Cari bahan kain..."
              aria-label="Cari layanan berdasarkan bahan kain"
            />
          </label>
        </div>
        
        <div className="service-grid" style={{ flex: 1, minHeight: 0, padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '16px', overflowY: 'auto' }}>
          {filteredServices.length === 0 ? (
            <div className="service-empty-state">
              Tidak ada layanan untuk bahan kain "{clothSearch}".
            </div>
          ) : filteredServices.map((srv) => (
            <div className="service-card" key={srv.id}>
              {srv.image_url ? (
                <div className="service-card-image">
                  <img
                    src={assetUrl(srv.image_url)}
                    alt={srv.cloth_type}
                  />
                </div>
              ) : (
                <div className="service-card-image service-card-image-empty">
                  No Image
                </div>
              )}
              <div className="service-card-body">
                <div className="service-card-title">{srv.cloth_type}</div>
                <div className="service-card-details">
                  <span>{srv.service_name}</span>
                  <strong>${srv.price_per_kilo}<small>/kg</small></strong>
                </div>
                
                <label className="service-card-input">
                  <span>Kilo</span>
                  <input type="number" min="0.1" step="0.1" placeholder="0" value={kiloInputs[srv.id] || ''} onChange={(e) => handleKiloChange(srv.id, e.target.value)} />
                </label>
                <button className="service-card-button" onClick={() => handleAddToCart(srv)}>Tambah</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* KOLOM KANAN: Keranjang & Pembayaran */}
      <div className="cart-panel" style={{ flex: 5, backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', borderRadius: '12px 12px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '15px', color: '#1e293b' }}>Keranjang Pesanan</h3>
          {cart.length > 0 && (
            <button onClick={() => setCart([])} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}>Kosongkan</button>
          )}
        </div>

        {/* Tabel Keranjang */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }}>
          {cart.length === 0 ? (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '14px' }}>Belum ada pesanan.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px', fontSize: '13px' }}>
              <tbody>
                {cart.map((item, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 0' }}>
                      <div style={{ fontWeight: '500', color: '#334155' }}>{item.service_name}</div>
                      <div style={{ color: '#64748b', fontSize: '12px' }}>{item.cloth_type} • {item.kilo}kg</div>
                    </td>
                    <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: '600', color: '#0f172a' }}>${item.subtotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Area Pembayaran */}
        <div className="payment-panel" style={{ padding: '20px', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc', borderRadius: '0 0 12px 12px' }}>
          
          <div className="payment-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Tgl Pengambilan</span>
            <input type="date" value={dateOfPickup} onChange={(e) => setDateOfPickup(e.target.value)} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }} />
          </div>

          <div className="payment-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '15px', color: '#334155', fontWeight: '600' }}>Total Tagihan</span>
            <span style={{ fontSize: '20px', color: '#0284c7', fontWeight: '700' }}>${totalPrice.toFixed(2)}</span>
          </div>

          <div className="payment-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Tunai (Amount)</span>
            <input type="number" placeholder="$0.00" value={amountPaid} onChange={(e) => setAmountPaid(e.target.value)} style={{ width: '120px', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', textAlign: 'right' }} />
          </div>

          <div className="payment-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Kembalian</span>
            <span style={{ fontSize: '15px', color: '#10b981', fontWeight: '600' }}>${changeAmount < 0 ? '0.00' : changeAmount.toFixed(2)}</span>
          </div>

          <button onClick={handlePay} style={{ width: '100%', padding: '14px', backgroundColor: '#0284c7', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginBottom: '10px' }}>
            Proses Pembayaran
          </button>

          {/* Tombol Cetak Struk hanya muncul jika ada transaksi terakhir */}
          {lastTransaction && (
            <button onClick={printReceipt} style={{ width: '100%', padding: '12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '8px' }}>
              🖨️ Cetak Struk Transaksi Terakhir
            </button>
          )}

        </div>
      </div>
    </div>
  );
}