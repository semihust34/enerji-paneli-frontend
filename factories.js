document.addEventListener('DOMContentLoaded', () => {
    console.log("Sayfa yüklendi, fabrikalar çekiliyor...");
    loadFactories();

    const addModal = document.getElementById('addFactoryModal');
    document.getElementById('openFactoryModalBtn').addEventListener('click', () => addModal.classList.remove('hidden'));
    document.getElementById('closeModalBtn').addEventListener('click', () => addModal.classList.add('hidden'));
    document.getElementById('logoutBtn').addEventListener('click', () => window.location.href = 'index.html');

    document.getElementById('newFactoryForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const factoryData = {
            name: document.getElementById('newFacName').value,
            ip: document.getElementById('newFacIp').value,
            meterCount: parseInt(document.getElementById('newFacCount').value)
        };

        try {
            const res = await fetch('https://web-production-388bad.up.railway.app/api/factories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(factoryData)
            });

            if (res.ok) {
                document.getElementById('newFactoryForm').reset();
                addModal.classList.add('hidden');
                loadFactories();
            } else {
                alert("Kayıt sırasında hata!");
            }
        } catch (err) {
            console.error("Kayıt hatası:", err);
        }
    });
});

async function loadFactories() {
    const list = document.getElementById('factoryList');
    list.innerHTML = 'Yükleniyor...';

    try {
        const res = await fetch('https://web-production-388bad.up.railway.app/api/factories');
        const data = await res.json();
        
        console.log("Backend'den gelen veri:", data); // KONSOLDA BURAYA BAK!

        list.innerHTML = ''; 
        
        // Backend'in "factories" anahtarıyla liste gönderdiğinden emin olalım
        const factories = data.factories || [];

        if (factories.length === 0) {
            list.innerHTML = '<p>Hiç fabrika tanımlanmamış.</p>';
            return;
        }
        
        factories.forEach(f => {
            const btn = document.createElement('div');
            btn.style.cssText = "padding: 15px; background: #1e1e1e; border: 1px solid #333; border-radius: 6px; cursor: pointer; margin-bottom: 5px;";
            btn.innerHTML = `<strong>${f.name}</strong><br><small style="color: var(--accent-color)">${f.meterCount || 0} Sayaç</small>`;
            btn.onclick = () => showDetails(f);
            list.appendChild(btn);
        });
    } catch (err) {
        console.error("Yükleme hatası:", err);
        list.innerHTML = 'Hata: Fabrikalar yüklenemedi.';
    }
}

function showDetails(f) {
    document.getElementById('detailTitle').innerText = f.name;
    const container = document.getElementById('meterDisplay');
    
    container.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div style="background: #1e1e1e; padding: 15px; border-radius: 8px; border: 1px solid #333;">
                <h4><i class="fas fa-user"></i> Abone Bilgileri</h4>
                <p><strong>Tesis:</strong> ${f.name}</p>
                <p><strong>IP:</strong> ${f.ip}</p>
            </div>
            <div style="background: #1e1e1e; padding: 15px; border-radius: 8px; border: 1px solid #333;">
                <h4><i class="fas fa-list"></i> Endeks Bilgileri</h4>
                <p><strong>Aktif Enerji:</strong> --</p>
            </div>
        </div>
        <h4 style="margin-top: 30px;">Alt Sayaçlar (${f.meterCount || 0} Adet)</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 10px; margin-top: 10px;">
            ${Array.from({length: f.meterCount || 0}, (_, i) => `
                <div style="background: #2c2c2c; padding: 10px; border-radius: 4px; text-align: center; border: 1px solid #444;">
                    <i class="fas fa-microchip"></i><br><small>Sayaç #${i+1}</small>
                </div>
            `).join('')}
        </div>
    `;
}
