// File: src/pages/Services.jsx
import { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import { apiUrl, assetUrl } from '../config/api.js';

export default function Services() {
    const [services, setServices] = useState([]);
    const [formData, setFormData] = useState({ id: '', cloth_type: 'Cloth', service_name: 'Washing', price_per_kilo: '' });
    const [imageFile, setImageFile] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const fileInputRef = useRef(null);

    const fetchServices = async () => {
        try {
            const response = await fetch(apiUrl('/services'));
            setServices(await response.json());
        } catch (error) { console.error(error); }
    };

    useEffect(() => { fetchServices(); }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleFileChange = (e) => setImageFile(e.target.files[0]);

    const handleSelectRow = (srv) => {
        setFormData({ id: srv.id, cloth_type: srv.cloth_type, service_name: srv.service_name, price_per_kilo: srv.price_per_kilo });
        setImageFile(null);
        setIsEdit(true);
    };

    const handleClear = () => {
        setFormData({ id: '', cloth_type: 'Cloth', service_name: 'Washing', price_per_kilo: '' });
        setImageFile(null);
        const fileInput = document.getElementById('imageInput');
        if (fileInput) fileInput.value = '';
        setIsEdit(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const dataToSend = new FormData();
        dataToSend.append('id', formData.id);
        dataToSend.append('cloth_type', formData.cloth_type);
        dataToSend.append('service_name', formData.service_name);
        dataToSend.append('price_per_kilo', formData.price_per_kilo);
        if (imageFile) dataToSend.append('image', imageFile);

        try {
            const url = isEdit ? apiUrl(`/services/${formData.id}`) : apiUrl('/services');
            const response = await fetch(url, { method: isEdit ? 'PUT' : 'POST', body: dataToSend });
            if (response.ok) {
                alert('Berhasil disimpan!');
                fetchServices();
                handleClear();
            } else {
                const err = await response.json();
                alert(err.message);
            }
        } catch (error) { console.error(error); }
    };

    const handleDelete = async () => {
        if (!formData.id || !window.confirm('Hapus layanan ini?')) return;
        const response = await fetch(apiUrl(`/services/${formData.id}`), { method: 'DELETE' });
        if (response.ok) { alert('Terhapus!'); fetchServices(); handleClear(); }
    };

    const handleImportExcel = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                const formattedData = jsonData.map((row) => ({
                    id: row['ID'],
                    cloth_type: row['Tipe Kain'],
                    service_name: row['Jenis Layanan'],
                    price_per_kilo: row['Harga per Kilo']
                }));

                const response = await fetch(apiUrl('/services/bulk'), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formattedData)
                });

                if (response.ok) {
                    alert('Berhasil mengimport data dari Excel!');
                    fetchServices();
                } else {
                    alert('Gagal mengimport data.');
                }
            } catch (error) {
                alert('Format Excel tidak sesuai! Pastikan kolom Header benar.');
                console.error(error);
            }
        };
        reader.readAsArrayBuffer(file);
        e.target.value = null;
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, color: '#1e293b', fontSize: '24px', fontWeight: '700' }}>Kelola Layanan</h2>
                <div>
                    <input type="file" accept=".xlsx, .xls, .csv" ref={fileInputRef} onChange={handleImportExcel} style={{ display: 'none' }} />
                    <button onClick={() => fileInputRef.current?.click()} style={{ padding: '10px 20px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                        📊 Import Excel
                    </button>
                </div>
            </div>
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                    <h3 style={{ fontSize: '15px', color: '#1e293b' }}>Daftar Layanan Laundry</h3>
                </div>
                <div className="services-list-scroll">
                <table style={{ width: '100%', minWidth: '680px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                    <thead><tr style={{ backgroundColor: '#f1f5f9', color: '#475569', fontSize: '13px' }}>
                        <th style={{ padding: '12px 20px' }}>ID</th><th style={{ padding: '12px 20px' }}>Gambar</th><th style={{ padding: '12px 20px' }}>Cloth Type</th><th style={{ padding: '12px 20px' }}>Services</th><th style={{ padding: '12px 20px' }}>Price / Kilo</th>
                    </tr></thead>
                    <tbody>{services.map((srv) => (
                        <tr key={srv.id} onClick={() => handleSelectRow(srv)} style={{ cursor: 'pointer', borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '12px 20px', fontWeight: '600', color: '#0284c7' }}>{srv.id}</td>
                            <td style={{ padding: '12px 20px' }}>{srv.image_url ? <img src={assetUrl(srv.image_url)} alt={srv.service_name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} /> : <span style={{ fontSize: '12px', color: '#94a3b8' }}>No Image</span>}</td>
                            <td style={{ padding: '12px 20px' }}>{srv.cloth_type}</td><td style={{ padding: '12px 20px' }}>{srv.service_name}</td><td style={{ padding: '12px 20px', fontWeight: '600' }}>${srv.price_per_kilo}</td>
                        </tr>
                    ))}</tbody>
                </table>
                </div>
            </div>

            <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <h3 style={{ fontSize: '15px', color: '#1e293b', marginBottom: '16px' }}>Kelola Data Layanan</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
                    <div><label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '6px' }}>Service ID</label><input type="text" name="id" value={formData.id} onChange={handleChange} disabled={isEdit} placeholder="e.g. SRV-005" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }} /></div>
                    <div><label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '6px' }}>Jenis Layanan</label><select name="service_name" value={formData.service_name} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', backgroundColor: '#fff', outline: 'none' }}><option value="Washing">Washing</option><option value="Washing and Drying">Washing and Drying</option><option value="Washing, Drying and Ironing">Washing, Drying and Ironing</option></select></div>
                    <div><label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '6px' }}>Tipe Kain (Cloth Type)</label><select name="cloth_type" value={formData.cloth_type} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', backgroundColor: '#fff', outline: 'none' }}>
                        <option value="Cloth">Cloth</option>
                        <option value="Silk">Slik</option>
                        <option value="Linen">Linen</option>
                        <option value="Polyester">Polyester</option>
                        <option value="Katun">Katun</option>
                        <option value="Denim/Jeans">Denim/Jeans</option>
                        <option value="Campuran">Campuran</option>
                    </select></div>
                    <div><label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '6px' }}>Harga per Kilo ($)</label><input type="number" name="price_per_kilo" value={formData.price_per_kilo} onChange={handleChange} step="0.1" placeholder="0.00" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }} /></div>
                    <div style={{ gridColumn: 'span 2' }}><label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '6px' }}>Upload Gambar Kain / Layanan (Opsional)</label><input type="file" id="imageInput" accept="image/*" onChange={handleFileChange} style={{ width: '100%', padding: '7px 12px', borderRadius: '8px', border: '1px dashed #cbd5e1', fontSize: '14px', outline: 'none', backgroundColor: '#f8fafc', cursor: 'pointer' }} /></div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={handleSave} disabled={isEdit} style={{ padding: '10px 20px', backgroundColor: '#0284c7', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '500', cursor: 'pointer', opacity: isEdit ? 0.5 : 1 }}>Insert</button>
                    <button onClick={handleSave} disabled={!isEdit} style={{ padding: '10px 20px', backgroundColor: '#0f172a', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '500', cursor: 'pointer', opacity: !isEdit ? 0.5 : 1 }}>Update</button>
                    <button onClick={handleClear} style={{ padding: '10px 20px', backgroundColor: '#e2e8f0', color: '#334155', border: 'none', borderRadius: '8px', fontWeight: '500', cursor: 'pointer' }}>Clear</button>
                    <button onClick={handleDelete} disabled={!isEdit} style={{ padding: '10px 20px', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', fontWeight: '500', cursor: 'pointer', opacity: !isEdit ? 0.5 : 1, marginLeft: 'auto' }}>Delete</button>
                </div>
            </div>
        </div>
    );
}