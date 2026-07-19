document.addEventListener('DOMContentLoaded', loadFactories);

async function loadFactories() {
    const res = await fetch('https://web-production-388bad.up.railway.app/api/factories');
    const { factories } = await res.json();
    const list = document.getElementById('factoryList');
    list.innerHTML = '';
    
    factories.forEach(f => {
        const btn = document.createElement('div');
        btn.style.cssText = "padding: 15px; background: #1e1e1e; border: 1px solid #333; border-radius: 6px; cursor: pointer;";
        btn.innerHTML = `<strong>${f.name}</strong><br><small style="color: var(--text-secondary)">${f.ip}</small>`;
        btn.onclick = () => showDetails(f);
        list.appendChild(btn);
    });
}

function showDetails(f) {
    document.getElementById('detailTitle').innerText = f.name;
    const container = document.getElementById('meterDisplay');
    
    container.innerHTML = `
        <div style="background: #00adb522; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
            <h4 style="color: var(--accent-color);">ANA GİRİŞ SAYACI</h4>
            <p>IP: ${f.ip} | Statü: Aktif</p>
        </div>
        <h4>Alt Sayaçlar (${f.meterCount} Adet)</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px;">
            ${Array.from({length: f.meterCount}, (_, i) => `
                <div style="background: #2c2c2c; padding: 10px; border-radius: 4px;">Sayaç #${i+1}</div>
            `).join('')}
        </div>
    `;
}

// Modal işlemleri ve Ekleme formu (öncekiyle aynı)
document.getElementById('openFactoryModalBtn').addEventListener('click', () => document.getElementById('addFactoryModal').classList.remove('hidden'));
document.getElementById('closeModalBtn').addEventListener('click', () => document.getElementById('addFactoryModal').classList.add('hidden'));
// ... (Form submit kısmı öncekiyle aynı kalacak)
