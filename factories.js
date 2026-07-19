function showDetails(f) {
    document.getElementById('detailTitle').innerText = f.name;
    const container = document.getElementById('meterDisplay');
    
    // Görseldeki 4 ana bölüm (Abone, Endeks, Ceza, Tüketim)
    container.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            
            <!-- 1. Abone Bilgileri -->
            <div style="background: #1e1e1e; padding: 15px; border-radius: 8px; border: 1px solid #333;">
                <h4 style="border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 10px;"><i class="fas fa-user"></i> Abone Bilgileri</h4>
                <p><strong>Abone Ad:</strong> ${f.name}</p>
                <p><strong>Abone No:</strong> 10000400118</p>
                <p><strong>Sayaç SeriNo:</strong> ${f.ip}</p>
                <p><strong>Sözleşme Gücü:</strong> 1,920.00 kW</p>
                <p><strong>Kalan Süre:</strong> 0 gün</p>
            </div>

            <!-- 2. Endeks Bilgileri -->
            <div style="background: #1e1e1e; padding: 15px; border-radius: 8px; border: 1px solid #333;">
                <h4 style="border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 10px;"><i class="fas fa-list"></i> Endeks Bilgileri</h4>
                <p><strong>Aktif Enerji (1.8.0):</strong> 56027.639</p>
                <p><strong>Gündüz (1.8.1):</strong> 26455.239</p>
                <p><strong>Puant (1.8.2):</strong> 11910.743</p>
                <p><strong>Gece (1.8.3):</strong> 17661.657</p>
                <p><strong>End. Reak. En. (5.8.0):</strong> 2603.521</p>
                <p><strong>Kap. Reak. En. (8.8.0):</strong> 871.751</p>
            </div>

            <!-- 3. Ceza Durumu -->
            <div style="background: #1e1e1e; padding: 15px; border-radius: 8px; border: 1px solid #333;">
                <h4 style="border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 10px;"><i class="fas fa-exclamation-triangle"></i> Ceza Durumu</h4>
                <p><strong>Endüktif Oran (%):</strong> <span class="badge success">1.43</span></p>
                <p><strong>Kapasitif Oran (%):</strong> <span class="badge success">1.90</span></p>
                <p><strong>Sözleşme Gücü Aşımı:</strong> Hayır</p>
                <p><strong>Aşım Miktarı:</strong> 0.00</p>
            </div>

            <!-- 4. Tüketim Bilgileri -->
            <div style="background: #1e1e1e; padding: 15px; border-radius: 8px; border: 1px solid #333;">
                <h4 style="border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 10px;"><i class="fas fa-bolt"></i> Tüketim Bilgileri</h4>
                <p><strong>Son Okuma Zamanı:</strong> 19.07.2026</p>
                <p><strong>Aktif Enerji (1.8.0):</strong> 396.710</p>
                <p><strong>End. Reak. En. (5.8.0):</strong> 5.678</p>
                <p><strong>Kap. Reak. En. (8.8.0):</strong> 7.545</p>
            </div>
        </div>

        <!-- Alt Sayaçlar Listesi -->
        <h4 style="margin-top: 30px; margin-bottom: 15px;">Alt Sayaçlar (${f.meterCount} Adet)</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px;">
            ${Array.from({length: f.meterCount}, (_, i) => `
                <div style="background: #2c2c2c; padding: 10px; border-radius: 4px; text-align: center; border: 1px solid #444;">
                    <i class="fas fa-microchip" style="color: var(--accent-color);"></i><br>
                    <small>Sayaç #${i+1}</small>
                </div>
            `).join('')}
        </div>
    `;
}
