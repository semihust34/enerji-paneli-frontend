// factories.js

document.addEventListener('DOMContentLoaded', () => {
    loadFactories(); // Sayfa açılır açılmaz veritabanından verileri çek

    // Modal açma/kapama işlemleri
    const modal = document.getElementById('addFactoryModal');
    const openBtn = document.getElementById('openFactoryModalBtn');
    const closeBtn = document.getElementById('closeModalBtn');

    openBtn.addEventListener('click', () => modal.classList.remove('hidden'));
    closeBtn.addEventListener('click', () => modal.classList.add('hidden'));

    // Çıkış Yap Butonu[cite: 6]
    document.getElementById('logoutBtn').addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // Form gönderme (Veritabanına kayıt işlemi)[cite: 6]
    const factoryForm = document.getElementById('newFactoryForm');
    if (factoryForm) {
        factoryForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const factoryData = {
                name: document.getElementById('newFacName').value,
                ip: document.getElementById('newFacIp').value,
                meterCount: parseInt(document.getElementById('newFacCount').value)
            };

            try {
                const response = await fetch('https://web-production-388bad.up.railway.app/api/factories', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': 'true'
                    },
                    body: JSON.stringify(factoryData)
                });

                if (response.ok) {
                    alert("Fabrika başarıyla eklendi!");
                    document.getElementById('newFactoryForm').reset();
                    modal.classList.add('hidden');
                    loadFactories(); // Tabloyu API'den tekrar çekerek güncelle[cite: 6]
                } else {
                    alert("Kayıt sırasında bir hata oluştu.");
                }
            } catch (err) {
                console.error("Kayıt hatası:", err);
                alert("Sunucu bağlantı hatası!");
            }
        });
    }
});

// Veritabanından fabrikaları çeken fonksiyon[cite: 6]
async function loadFactories() {
    try {
        const response = await fetch('https://web-production-388bad.up.railway.app/api/factories', {
            headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        const result = await response.json();
        
        if (result.success) {
            renderMetersTable(result.factories);
        }
    } catch (error) {
        console.error("Veri çekme hatası:", error);
    }
}

// Tabloyu çizen fonksiyon[cite: 6]
function renderMetersTable(data) {
    const tbody = document.getElementById('metersTableBody');
    tbody.innerHTML = '';

    data.forEach(factory => {
        const row = `
            <tr>
                <td><strong>${factory.name}</strong></td>
                <td><span style="color: var(--accent-color); font-family: monospace;">${factory.id}</span></td>
                <td>${factory.ip}</td>
                <td><i class="fas fa-signal" style="color: #4cd137;"></i> Güçlü</td>
                <td>Şimdi</td>
                <td><span class="badge success">Çevrimiçi</span></td>
                <td><button class="action-btn"><i class="fas fa-cog"></i> Ayarlar</button></td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}
