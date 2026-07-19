document.addEventListener('DOMContentLoaded', loadFactories);

async function loadFactories() {
    try {
        const res = await fetch('https://web-production-388bad.up.railway.app/api/factories');
        const { factories } = await res.json();
        const list = document.getElementById('factoryList');
        list.innerHTML = '';
        
        factories.forEach(f => {
            const btn = document.createElement('div');
            btn.style.cssText = "padding: 15px; background: #1e1e1e; border: 1px solid #333; border-radius: 6px; cursor: pointer; margin-bottom: 10px;";
            btn.innerHTML = `<strong>${f.name}</strong><br><small style="color: var(--accent-color)">${f.meterCount} Sayaç Aktif</small>`;
            btn.onclick = () => showDetails(f);
            list.appendChild(btn);
        });
    } catch (err) {
        console.error("Yükleme hatası:", err);
    }
}

function showDetails(f) {
    document.getElementById('detailTitle').innerText = f.name;
    const container = document.getElementById('meterDisplay');
    
    // 4'lü Profesyonel Dashboard Yapısı
    container.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <!-- Abone Bilgileri -->
            <div style="background: #1e1e1e; padding: 15px; border-radius: 8px; border: 1px solid #333;">
                <h4 style="color: var(--text-secondary); margin-bottom: 10px;"><i class="fas fa-user"></i> Abone Bilgileri</h4>
                <p><strong>Tesis:</strong> ${f.name}</p>
                <p><strong>Modem IP:</strong> ${f.ip}</p>
                <p><strong>Sözleşme:</strong> Sanayi TT</p>
            </div>
            <!-- Endeks Bilgileri -->
            <div style="background: #1e1e1e; padding: 15px; border-radius: 8px; border: 1px solid #333;">
                <h4 style="color: var(--text-secondary); margin-bottom: 10px;"><i class="fas fa-list"></i> Endeks Bilgileri</h4>
                <p><strong>Son Okuma:</strong> ${new Date().toLocaleDateString()}</p>
                <p><strong>Aktif Enerji:</strong> -- kWh</p>
            </div>
            <!-- Ceza Durumu -->
            <div style="background: #1e1e1e; padding: 15px; border-radius: 8px; border: 1px solid #333;">
                <h4 style="color: var(--text-secondary); margin-bottom: 10px;"><i class="fas fa-exclamation-triangle"></i> Ceza Durumu</h4>
                <p><strong>Endüktif Oran:</strong> <span class="badge success">%0.00</span></p>
                <p><strong>Kapasitif Oran:</strong> <span class="badge success">%0.00</span></p>
            </div>
            <!-- Tüketim Bilgileri -->
            <div style="background: #1e1e1e; padding: 15px; border-radius: 8px; border: 1px solid #333;">
                <h4 style="color: var(--text-secondary); margin-bottom: 10px;"><i class="fas fa-bolt"></i> Tüketim Özeti</h4>
                <p><strong>Sayaç Adedi:</strong> ${f.meterCount}</p>
            </div>
        </div>
        
        <!-- Alt Sayaçlar Grid'i -->
        <h4 style="margin-top: 30px; margin-bottom: 15px;">Alt Sayaç Detayları (${f.meterCount} Adet)</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 10px;">
            ${Array.from({length: f.meterCount}, (_, i) => `
                <div style="background: #2c2c2c; padding: 10px; border-radius: 4px; text-align: center; border: 1px solid #444;">
                    <i class="fas fa-microchip" style="color: var(--accent-color);"></i><br>
                    <small>Sayaç #${i+1}</small>
                </div>
            `).join('')}
        </div>
    `;
}

// Modal Form İşlemi
document.getElementById('newFactoryForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const factoryData = {
        name: document.getElementById('newFacName').value,
        ip: document.getElementById('newFacIp').value,
        meterCount: parseInt(document.getElementById('newFacCount').value)
    };

    const res = await fetch('https://web-production-388bad.up.railway.app/api/factories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(factoryData)
    });

    if (res.ok) {
        document.getElementById('newFactoryForm').reset();
        document.getElementById('addFactoryModal').classList.add('hidden');
        loadFactories();
    } else alert("Kayıt başarısız.");
});

// Modal Aç/Kapa
document.getElementById('openFactoryModalBtn').addEventListener('click', () => document.getElementById('addFactoryModal').classList.remove('hidden'));
document.getElementById('closeModalBtn').addEventListener('click', () => document.getElementById('addFactoryModal').classList.add('hidden'));
