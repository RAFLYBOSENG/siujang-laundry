// File: src/pages/Services.jsx
import { useState, useEffect } from 'react';

export default function Services() {
    const [services, setServices] = useState([]);
    const [formData, setFormData] = useState({
        id: '',
        cloth_type: 'Cloth',
        service_name: 'Washing',
        price_per_kilo: ''
    });
    const [isEdit, setIsEdit] = useState(false);

    // Fungsi mengambil data dari API Backend
    const fetchServices = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/services');
            const data = await response.json();
            setServices(data);
        } catch (error) {
            console.error('Gagal mengambil data:', error);
        }
    };

    // Ambil data saat komponen pertama kali dimuat
    useEffect(() => {
        fetchServices();
    }, []);

    // Handle perubahan input di form
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle klik baris tabel untuk Edit
    const handleSelectRow = (service) => {
        setFormData({
            id: service.id,
            cloth_type: service.cloth_type,
            service_name: service.service_name,
            price_per_kilo: service.price_per_kilo
        });
        setIsEdit(true);
    };

    // Bersihkan Form (Clear)
    const handleClear = () => {
        setFormData({ id: '', cloth_type: 'Cloth', service_name: 'Washing', price_per_kilo: '' });
        setIsEdit(false);
    };

    // Handle Insert / Update Data
    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const url = isEdit
                ? `http://localhost:5000/api/services/${formData.id}`
                : 'http://localhost:5000/api/services';

            const method = isEdit ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert(isEdit ? 'Data berhasil diupdate!' : 'Data berhasil ditambahkan!');
                fetchServices();
                handleClear();
            } else {
                const errorData = await response.json();
                alert(`Gagal: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Handle Delete Data
    const handleDelete = async () => {
        if (!formData.id) return alert('Pilih data yang mau dihapus dulu!');
        if (!window.confirm('Yakin ingin menghapus layanan ini?')) return;

        try {
            const response = await fetch(`http://localhost:5000/api/services/${formData.id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Data berhasil dihapus!');
                fetchServices();
                handleClear();
            } else {
                const errorData = await response.json();
                alert(`Gagal: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="services-page" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* BAGIAN ATAS: Tabel Data */}
            <div className="panel" style={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ backgroundColor: '#2a5a7d', color: 'white', padding: '10px' }}>
                    <strong>Table for Service List</strong>
                </div>
                <div className="table-wrap"><table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: '#337ab7', color: 'white' }}>
                    <tr>
                        <th style={{ padding: '8px', border: '1px solid #ddd' }}>ID</th>
                        <th style={{ padding: '8px', border: '1px solid #ddd' }}>Cloth Type</th>
                        <th style={{ padding: '8px', border: '1px solid #ddd' }}>Services</th>
                        <th style={{ padding: '8px', border: '1px solid #ddd' }}>Price Per Kilo</th>
                        <th style={{ padding: '8px', border: '1px solid #ddd' }}>Date Insert</th>
                    </tr>
                    </thead>
                    <tbody>
                    {services.map((srv) => (
                        <tr
                            key={srv.id}
                            onClick={() => handleSelectRow(srv)}
                            style={{ cursor: 'pointer', borderBottom: '1px solid #ddd' }}
                        >
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{srv.id}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{srv.cloth_type}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{srv.service_name}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{srv.price_per_kilo}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{new Date(srv.date_insert).toLocaleDateString()}</td>
                        </tr>
                    ))}
                    </tbody>
                </table></div>
            </div>

            {/* BAGIAN BAWAH: Form Input & Tombol */}
            <div className="panel service-form-panel" style={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '5px', padding: '20px' }}>
                <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                            <label>ID:</label>
                            <input type="text" name="id" value={formData.id} onChange={handleChange} disabled={isEdit} placeholder="e.g. SRV-001" style={{ padding: '5px' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                            <label>Service:</label>
                            <select name="service_name" value={formData.service_name} onChange={handleChange} style={{ padding: '5px' }}>
                                <option value="Washing">Washing</option>
                                <option value="Washing and Drying">Washing and Drying</option>
                                <option value="Washing, Drying and Ironing">Washing, Drying and Ironing</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                            <label>Cloth Type:</label>
                            <select name="cloth_type" value={formData.cloth_type} onChange={handleChange} style={{ padding: '5px' }}>
                                <option value="Cloth">Cloth</option>
                                <option value="Silk">Silk</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                            <label>Price Per Kilo:</label>
                            <input type="number" name="price_per_kilo" value={formData.price_per_kilo} onChange={handleChange} step="0.1" style={{ padding: '5px' }} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
                        <button type="button" onClick={handleSave} disabled={isEdit} style={{ padding: '8px 20px', backgroundColor: '#337ab7', color: 'white', border: 'none', cursor: 'pointer' }}>Insert</button>
                        <button type="button" onClick={handleSave} disabled={!isEdit} style={{ padding: '8px 20px', backgroundColor: '#337ab7', color: 'white', border: 'none', cursor: 'pointer' }}>Update</button>
                        <button type="button" onClick={handleClear} style={{ padding: '8px 20px', backgroundColor: '#337ab7', color: 'white', border: 'none', cursor: 'pointer' }}>Clear</button>
                        <button type="button" onClick={handleDelete} disabled={!isEdit} style={{ padding: '8px 20px', backgroundColor: '#337ab7', color: 'white', border: 'none', cursor: 'pointer' }}>Delete</button>
                    </div>
                </form>
            </div>

        </div>
    );
}