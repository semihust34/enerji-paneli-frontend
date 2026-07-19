document.addEventListener('DOMContentLoaded', () => {
    loadFactories();

    // Modal açma/kapama
    const addModal = document.getElementById('addFactoryModal');
    document.getElementById('openFactoryModalBtn').addEventListener('click', () => addModal.classList.remove('hidden'));
    document.getElementById('closeModalBtn').addEventListener('click', () => addModal.classList.add('hidden'));

    // Çıkış yap
    document.getElementById('logoutBtn').addEventListener('click', () => window.location.href = 'index.html');

    // FORM GÖNDERME İŞLEMİ (Eksik olan kısım burasıydı)
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
                document.getElementById('newFactoryForm').reset(); // Formu temizle
                addModal.classList.add('hidden'); // Modalı kapat
                loadFactories(); // Listeyi yeniden çek ve göster
            } else {
                alert("Kayıt sırasında bir hata oluştu.");
            }
        } catch (err) {
            console.error(err);
            alert("Sunucu bağlantı hatası!");
        }
    });
});

async function loadFactories() {
    try {
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
    } catch (err) {
        console.error("Yükleme hatası:", err);
    }
}

function showDetails(f) {
    document.getElementById('detailTitle').innerText = f.name;
    const container = document.getElementById('meterDisplay');
    
    container.innerHTML = `
        <div style="background: #00adb522; padding: 15px; border-radius: 6px; margin-bottom: 20px; border: 1px solid var(--accent-color);">
            <h4 style="color: var(--accent-color); margin-bottom: 5px;"><i class="fas fa-bolt"></i> ANA GİRİŞ SAYACI</h4>
            <p>IP: ${f.ip} | Statü: Aktif</p>
        </div>
        <h4>Alt Sayaçlar (${f.meterCount} Adet)</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px;">
            ${Array.from({length: f.meterCount}, (_, i) => `
                <div style="background: #2c2c2c; padding: 10px; border-radius: 4px; text-align: center; border: 1px solid #444;">
                    Sayaç #${i+1}
                </div>
            `).join('')}
        </div>
    `;
}
