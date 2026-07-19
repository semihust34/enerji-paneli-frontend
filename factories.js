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
            btn.innerHTML = `<strong>${f.name}</strong><br><small style="color: var(--accent-color)">${f.meterCount} Sayaç</small>`;
            btn.onclick = () => showDetails(f);
            list.appendChild(btn);
        });
    } catch (err) { console.error(err); }
}

function showDetails(f) {
    document.getElementById('detailTitle').innerText = f.name;
    const container = document.getElementById('meterDisplay');
    
    container.innerHTML = `
        <h4 style="margin-bottom: 10px;"><i class="fas fa-server"></i> ANA GİRİŞ SAYACI</h4>
        <div onclick="showMeterData('ANA SAYAÇ', '${f.name}')" 
             style="background: #00adb522; padding: 15px; border-radius: 6px; border: 1px solid var(--accent-color); cursor: pointer; margin-bottom: 30px;">
            <div style="display: flex; justify-content: space-between;">
                <span><strong>${f.name} - Ana Giriş</strong></span>
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
        
        <!-- Veri Paneli Buraya Gelecek -->
        <div id="meterDataPanel" style="margin-top: 40px;"></div>
    `;
}

window.showMeterData = function(meterName, factoryName) {
    const panel = document.getElementById('meterDataPanel');
    panel.innerHTML = `
        <h3 style="margin-bottom: 20px; border-bottom: 2px solid var(--accent-color); padding-bottom: 10px;">
            ${factoryName} - ${meterName} Detay Paneli
        </h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div style="background: #1e1e1e; padding: 15px; border-radius: 8px; border: 1px solid #333;">
                <h4><i class="fas fa-user"></i> Abone Bilgileri</h4>
                <p><strong>Abone Ad:</strong> ${factoryName}</p>
                <p><strong>Sayaç:</strong> ${meterName}</p>
                <p><strong>Sözleşme Gücü:</strong> 1,920.00 kW</p>
            </div>
            <div style="background: #1e1e1e; padding: 15px; border-radius: 8px; border: 1px solid #333;">
                <h4><i class="fas fa-list"></i> Endeks Bilgileri</h4>
                <p><strong>Aktif Enerji (1.8.0):</strong> 56027.639</p>
                <p><strong>End. Reak. En. (5.8.0):</strong> 2603.521</p>
            </div>
            <div style="background: #1e1e1e; padding: 15px; border-radius: 8px; border: 1px solid #333;">
                <h4><i class="fas fa-exclamation-triangle"></i> Ceza Durumu</h4>
                <p><strong>Endüktif Oran:</strong> %1.43</p>
                <p><strong>Kapasitif Oran:</strong> %1.90</p>
            </div>
            <div style="background: #1e1e1e; padding: 15px; border-radius: 8px; border: 1px solid #333;">
                <h4><i class="fas fa-bolt"></i> Tüketim Bilgileri</h4>
                <p><strong>Son Okuma:</strong> 19.07.2026</p>
                <p><strong>Aktif Enerji:</strong> 396.710</p>
            </div>
        </div>
    `;
    // Paneli görünür yapmak için aşağı kaydır
    panel.scrollIntoView({ behavior: 'smooth' });
};
