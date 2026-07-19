document.addEventListener('DOMContentLoaded', loadFactories);

async function loadFactories() {
    const list = document.getElementById('factoryList');
    try {
        const res = await fetch('https://web-production-388bad.up.railway.app/api/factories');
        const { factories } = await res.json();
        list.innerHTML = '';
        factories.forEach(f => {
            const btn = document.createElement('div');
            btn.style.cssText = "padding: 15px; background: #1e1e1e; border: 1px solid #333; border-radius: 6px; cursor: pointer; margin-bottom: 10px;";
            btn.innerHTML = `<strong>${f.name}</strong><br><small style="color: var(--accent-color)">${f.meterCount} Sayaç Aktif</small>`;
            btn.onclick = () => showDetails(f);
            list.appendChild(btn);
        });
    } catch (err) { console.error(err); }
}

function showDetails(f) {
    document.getElementById('detailTitle').innerText = f.name;
    const container = document.getElementById('meterDisplay');
    
    container.innerHTML = `
        <h4 style="margin-bottom: 15px;"><i class="fas fa-server"></i> ANA GİRİŞ SAYACI</h4>
        <div onclick="showMeterData('ANA SAYAÇ', '${f.name}')" 
             style="background: #00adb522; padding: 15px; border-radius: 6px; border: 1px solid var(--accent-color); cursor: pointer; margin-bottom: 30px;">
            <div style="display: flex; justify-content: space-between;">
                <span><strong>${f.name} - Ana Enerji Girişi</strong></span>
                <span class="badge success">Aktif</span>
            </div>
        </div>
        
        <h4>Alt Sayaçlar (${f.meterCount} Adet)</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px; margin-top: 15px;">
            ${Array.from({length: f.meterCount}, (_, i) => `
                <div onclick="showMeterData('Sayaç #${i+1}', '${f.name}')" 
                     style="background: #2c2c2c; padding: 12px; border-radius: 4px; text-align: center; border: 1px solid #444; cursor: pointer;">
                    <i class="fas fa-microchip"></i><br>
                    <small>Sayaç #${i+1}</small>
                </div>
            `).join('')}
        </div>
        <div id="meterDataPanel" style="margin-top: 40px;"></div>
    `;
}

window.showMeterData = function(meterName, factoryName) {
    const panel = document.getElementById('meterDataPanel');
    panel.innerHTML = `
        <h3 style="margin-bottom: 20px; border-bottom: 2px solid var(--accent-color); padding-bottom: 10px;">
            ${factoryName} - ${meterName} Detaylı Raporu
        </h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            
            <!-- 1. Abone Bilgileri -->
            <div style="background: #1e1e1e; padding: 15px; border-radius: 8px; border: 1px solid #333;">
                <h4 style="margin-bottom: 10px;">Abone Bilgileri</h4>
                <p><strong>Abone Ad:</strong> ESAN AKÜMÜLATÖR MALZEME SAN.VE.TİC.AŞ</p>
                <p><strong>Abone No:</strong> 10000400158 | <strong>SeriNo:</strong> 50672742</p>
                <p><strong>Sözleşme Gücü:</strong> 240,00 kW | <strong>Çarpan:</strong> 1000</p>
                <p><strong>Abo. Bas. Tarih:</strong> 23.09.2020 | <strong>Kalan Süre:</strong> 0 gün</p>
            </div>

            <!-- 2. Endeks Bilgileri -->
            <div style="background: #1e1e1e; padding: 15px; border-radius: 8px; border: 1px solid #333;">
                <h4 style="margin-bottom: 10px;">Endeks Bilgileri (01.07.2026 - 19.07.2026)</h4>
                <p><strong>Aktif Enerji (1.8.0):</strong> 828.776 - 931.602</p>
                <p><strong>Gündüz (1.8.1):</strong> 404.792 - 456.589</p>
                <p><strong>Puant (1.8.2):</strong> 161.864 - 181.16</p>
                <p><strong>Gece (1.8.3):</strong> 262.122 - 293.853</p>
                <p><strong>End. Reak. En. (5.8.0):</strong> 32.931 - 34.957</p>
                <p><strong>Kap. Reak. En. (8.8.0):</strong> 84.987 - 88.941</p>
            </div>

            <!-- 3. Ceza Durumu -->
            <div style="background: #1e1e1e; padding: 15px; border-radius: 8px; border: 1px solid #333;">
                <h4 style="margin-bottom: 10px;">Ceza Durumu</h4>
                <p><strong>Aktif Enerji:</strong> 102,83 | <strong>End. Reak:</strong> 2,03 | <strong>Kap. Reak:</strong> 3,95</p>
                <p><strong>Endüktif Oran (%20):</strong> <span class="badge danger">1,97</span></p>
                <p><strong>Kapasitif Oran (%15):</strong> <span class="badge success">3,85</span></p>
                <p><strong>Sözleşme Gücü Aşımı:</strong> Evet | <strong>Aşım:</strong> 180,00</p>
            </div>

            <!-- 4. Tüketim Bilgileri -->
            <div style="background: #1e1e1e; padding: 15px; border-radius: 8px; border: 1px solid #333;">
                <h4 style="margin-bottom: 10px;">Tüketim Bilgileri (19.07.2026)</h4>
                <p><strong>Aktif Enerji (1.8.0):</strong> 102.826,00</p>
                <p><strong>Gündüz/Puant/Gece:</strong> 51.797 / 19.296 / 31.733</p>
                <p><strong>End. Reak. / Kap. Reak:</strong> 2.026,00 / 3.954,00</p>
                <p><strong>Maks. Demand (1.6.0):</strong> 420,00</p>
            </div>
        </div>
    `;
    panel.scrollIntoView({ behavior: 'smooth' });
};
