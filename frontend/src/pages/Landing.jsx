export default function Landing({ onContinue }) {
    return (
        <main className="landing-page">
            <section className="landing-hero">
                <div className="landing-copy">
                    <div className="landing-brand">SIUJANG LAUNDRY</div>
                    <h1>Laundry lebih rapi, bisnis lebih mudah.</h1>
                    <p>
                        Kelola layanan, pesanan, pelanggan, dan proses cucian
                        dari satu dashboard yang sederhana.
                    </p>
                    <button className="landing-cta" onClick={onContinue}>
                        Masuk ke Dashboard
                        <span aria-hidden="true">→</span>
                    </button>
                </div>

                <div className="landing-visual" aria-hidden="true">
                    <div className="landing-orb landing-orb-large" />
                    <div className="landing-orb landing-orb-small" />
                    <div className="landing-card landing-card-main">
                        <div className="landing-card-icon">✦</div>
                        <div>
                            <strong>Smart Laundry</strong>
                            <span>Everything under control</span>
                        </div>
                    </div>
                    <div className="landing-card landing-card-stat">
                        <span className="landing-stat-check">✓</span>
                        <div>
                            <strong>Pesanan aktif</strong>
                            <span>Siap dikelola</span>
                        </div>
                    </div>
                    <div className="landing-bubble">🧺</div>
                </div>
            </section>

            <div className="landing-features">
                <span>✓ Kelola pesanan dengan mudah</span>
                <span>✓ Pantau status cucian</span>
                <span>✓ Laporan bisnis terpusat</span>
            </div>
        </main>
    );
}
