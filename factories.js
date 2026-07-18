// factories.js

document.addEventListener('DOMContentLoaded', () => {
    loadFactories(); // Veritabanından verileri çek

    // Çıkış Yap Butonu
    document.getElementById('logoutBtn').addEventListener('click', () => {
        window.location.href = 'index.html';
    });
});

async function loadFactories() {
    try {
        const response = await fetch('https://web-production-388bad.up.railway.app/api/factories', {
            method: 'GET',
            headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        const result = await response.json();
        
        if (result.success) {
            renderMetersTable(result.factories);
        } else {
            console.error("Veri çekme hatası:", result.message);
        }
    } catch (error) {
        console.error("Sunucu bağlantı hatası:", error);
    }
}

function renderMetersTable(data) {
    const tbody = document.getElementById('metersTableBody');
    tbody.innerHTML = '';

    data.forEach(factory => {
        // Not: Şu an API'den sadece fabrika bilgisi dönüyor, 
        // detaylı sayaç durumlarını backend'e eklediğinde burayı genişleteceğiz.
        const row = `
            <tr>
                <td><strong>${factory.name}</strong></td>
                <td><span style="color: var(--accent-color);">${factory.id}</span></td>
                <td>${factory.ip}</td>
                <td>N/A</td> 
                <td>Şimdi</td>
                <td><span class="badge success">Aktif</span></td>
                <td><button class="action-btn"><i class="fas fa-cog"></i> Ayarlar</button></td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}
