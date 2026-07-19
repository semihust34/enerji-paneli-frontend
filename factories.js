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
    
    // 1. ANA SAYAÇ BÖLÜMÜ
    let html = `
        <h4 style="margin-bottom: 10px;"><i class="fas fa-server"></i> ANA GİRİŞ SAYACI</h4>
        <div onclick="openMeterDetails('Ana Sayaç', '${f.name}')" 
             style="background: #00adb522; padding: 15px; border-radius: 6px; border: 1px solid var(--accent-color); cursor: pointer; margin-bottom: 30px;">
            <div style="display: flex; justify-content: space-between;">
                <span><strong>${f.name} - Ana Enerji Girişi</strong></span>
                <span class="badge success">Aktif</span>
            </div>
        </div>
        
        <h4>Alt Sayaçlar (${f.meterCount} Adet)</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px; margin-top: 15px;">
    `;

    // 2. ALT SAYAÇLAR (Tıklanabilir)
    for(let i = 1; i <= f.meterCount; i++) {
        html += `
            <div onclick="openMeterDetails('Sayaç #${i}', '${f.name}')" 
                 style="background: #2c2c2c; padding: 12px; border-radius: 4px; text-align: center; border: 1px solid #444; cursor: pointer; transition: 0.3s;">
                <i class="fas fa-microchip"></i><br>
                <small>Sayaç #${i}</small>
            </div>
        `;
    }
    html += `</div>`;
    container.innerHTML = html;
}

// Sayaç detay sayfası (Yönlendirme veya yeni bir panel)
window.openMeterDetails = function(meterName, factoryName) {
    alert(`Açılıyor: ${factoryName} - ${meterName} Detay Sayfası...`);
    // İleride buraya: window.location.href = 'meter-detail.html?meter=' + meterName; yazabilirsin.
};
