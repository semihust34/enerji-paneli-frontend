// factories.js

document.addEventListener('DOMContentLoaded', () => {
    loadFactories(); // Sayfa açılınca verileri veritabanından çek

    // Modal Açma/Kapama
    const modal = document.getElementById('addFactoryModal');
    const openBtn = document.getElementById('openFactoryModalBtn');
    const closeBtn = document.getElementById('closeModalBtn');

    openBtn.addEventListener('click', () => modal.classList.remove('hidden'));
    closeBtn.addEventListener('click', () => modal.classList.add('hidden'));

    // Çıkış Yap
    document.getElementById('logoutBtn').addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // Form Gönderimi (Veritabanına Kayıt)
    document.getElementById('newFactoryForm').addEventListener('submit', async (e) => {
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
                loadFactories(); // Tabloyu güncelle
            }
        } catch (err) {
            console.error("Kayıt hatası:", err);
            alert("Sunucu bağlantı hatası!");
        }
    });
});

// Veritabanından verileri çeken fonksiyon
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

// Tabloyu çizen fonksiyon
function renderMetersTable(data) {
    const tbody = document.getElementById('metersTableBody');
    tbody.innerHTML = '';

    data.forEach(factory => {
        const row = `
            <tr>
                <td><strong>${factory.name}</strong></td>
                <td><span style="color: var(--accent-color); font-family: monospace;">${factory.id}</span></td>
                <td>${factory.ip}</td>
                <td>4G</td>
                <td>Şimdi</td>
                <td><span class="badge success">Aktif</span></td>
                <td><button class="action-btn">Detay</button></td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}
