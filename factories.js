document.addEventListener('DOMContentLoaded', () => {
    loadFactories(); // Sayfa açılır açılmaz veritabanından verileri çek

    // Modal açma/kapama
    const modal = document.getElementById('addFactoryModal');
    const openBtn = document.getElementById('openFactoryModalBtn');
    const closeBtn = document.getElementById('closeModalBtn');

    openBtn.addEventListener('click', () => modal.classList.remove('hidden'));
    closeBtn.addEventListener('click', () => modal.classList.add('hidden'));

    // Form gönderme (Veritabanına kayıt)
    document.getElementById('newFactoryForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const factoryData = {
            name: document.getElementById('newFacName').value,
            ip: document.getElementById('newFacIp').value,
            meterCount: parseInt(document.getElementById('newFacCount').value)
        };

        const response = await fetch('https://web-production-388bad.up.railway.app/api/factories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(factoryData)
        });

        if (response.ok) {
            modal.classList.add('hidden');
            loadFactories(); // Listeyi güncelle
            document.getElementById('newFactoryForm').reset();
        }
    });
});

async function loadFactories() {
    const response = await fetch('https://web-production-388bad.up.railway.app/api/factories');
    const result = await response.json();
    if (result.success) {
        const tbody = document.getElementById('metersTableBody');
        tbody.innerHTML = '';
        result.factories.forEach(f => {
            tbody.innerHTML += `<tr>
                <td><strong>${f.name}</strong></td>
                <td>${f.id}</td>
                <td>${f.ip}</td>
                <td>Aktif</td>
                <td>Şimdi</td>
                <td><span class="badge success">Çevrimiçi</span></td>
                <td><button class="action-btn">Ayarlar</button></td>
            </tr>`;
        });
    }
}
