// factories.js

// Detaylı Sayaç ve Modem Verileri
const mockMeters = [
    {
        id: "SYC-1001",
        factory: "Plastik Enjeksiyon A.Ş.",
        ip: "195.175.22.10",
        signal: "Güçlü",
        lastRead: "1 dk önce",
        isOnline: true
    },
    {
        id: "SYC-1002",
        factory: "Plastik Enjeksiyon A.Ş.",
        ip: "195.175.22.10",
        signal: "Zayıf",
        lastRead: "5 dk önce",
        isOnline: true
    },
    {
        id: "SYC-2044",
        factory: "Demir Döküm Fabrikası",
        ip: "195.175.22.44",
        signal: "Koptu",
        lastRead: "2 saat önce",
        isOnline: false
    },
    {
        id: "SYC-3010",
        factory: "Tekstil Depo Tesisleri",
        ip: "212.15.10.8",
        signal: "Orta",
        lastRead: "10 dk önce",
        isOnline: true
    }
];

// Tabloyu Çizdirme Fonksiyonu
function renderMetersTable(data) {
    const tbody = document.getElementById('metersTableBody');
    tbody.innerHTML = '';

    data.forEach(meter => {
        // Duruma göre Etiket (Badge) belirleme
        const statusBadge = meter.isOnline ? '<span class="badge success">Çevrimiçi</span>' : '<span class="badge danger">Çevrimdışı</span>';
        
        // Sinyal gücüne göre dinamik ikon belirleme
        let signalIcon = '<i class="fas fa-signal" style="color: #4cd137;"></i>'; // Yeşil
        if (meter.signal === "Zayıf") signalIcon = '<i class="fas fa-signal" style="color: #f6e58d;"></i>'; // Sarı
        if (meter.signal === "Koptu") signalIcon = '<i class="fas fa-times-circle" style="color: var(--error-color);"></i>'; // Kırmızı

        const row = `
            <tr>
                <td><strong>${meter.factory}</strong></td>
                <td><span style="color: var(--accent-color); font-family: monospace; letter-spacing: 1px;">${meter.id}</span></td>
                <td>${meter.ip}</td>
                <td>${signalIcon} ${meter.signal}</td>
                <td>${meter.lastRead}</td>
                <td>${statusBadge}</td>
                <td><button class="action-btn"><i class="fas fa-cog"></i> Ayarlar</button></td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Tabloyu ilk açılışta tüm verilerle yükle
    renderMetersTable(mockMeters);

    // 2. Anlık Arama (Filtreleme) İşlemi
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase();
        
        // Yazılan kelimeyi Fabrika Adı, IP veya Sayaç ID içinde ara
        const filteredData = mockMeters.filter(m => 
            m.factory.toLowerCase().includes(searchTerm) || 
            m.ip.includes(searchTerm) || 
            m.id.toLowerCase().includes(searchTerm)
        );
        
        // Tabloyu sadece bulunan sonuçlarla tekrar çiz
        renderMetersTable(filteredData);
    });

    // 3. Çıkış Yap Butonu
    document.getElementById('logoutBtn').addEventListener('click', () => {
        window.location.href = 'index.html';
    });
});