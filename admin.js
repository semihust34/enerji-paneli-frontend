// admin.js
document.addEventListener('DOMContentLoaded', () => {
    // 1. Güvenlik Kontrolü (Sadece Adminler girebilir)
    const userRole = localStorage.getItem('userRole');
    
    if (userRole !== 'ADMIN') {
        alert("Bu sayfayı görüntüleme yetkiniz yok!");
        window.location.href = 'index.html'; // Giriş sayfasına geri şutla
        return;
    }

    // 2. Çıkış Yapma İşlemi
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userRole');
        window.location.href = 'index.html';
    });
});

// admin.js (Mevcut kodların altına eklenecek)

// Backend'den gelecek olan örnek veri yapısı
const mockFactoryData = [
    {
        id: 1,
        name: "Plastik Enjeksiyon A.Ş.",
        ip: "195.175.22.10",
        meterCount: 12,
        lastSeen: "2 dk önce",
        status: "Normal",
        isWarning: false
    },
    {
        id: 2,
        name: "Demir Döküm Fabrikası",
        ip: "195.175.22.44",
        meterCount: 32,
        lastSeen: "1 dk önce",
        status: "%18 Reaktif!",
        isWarning: true
    },
    {
        id: 3,
        name: "Tekstil Depo Tesisleri",
        ip: "212.15.10.8",
        meterCount: 4,
        lastSeen: "15 dk önce",
        status: "Normal",
        isWarning: false
    }
];

// Sayfa yüklendiğinde tabloyu dolduracak fonksiyon
function loadTableData() {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = ''; // Önce tabloyu temizle

    mockFactoryData.forEach(factory => {
        // Duruma göre CSS sınıfı seçimi
        const badgeClass = factory.isWarning ? 'badge danger' : 'badge success';
        
        // Tabloya eklenecek satır (HTML)
        const row = `
            <tr>
                <td>${factory.name}</td>
                <td>${factory.ip}</td>
                <td>${factory.meterCount}</td>
                <td>${factory.lastSeen}</td>
                <td><span class="${badgeClass}">${factory.status}</span></td>
                <td><button class="action-btn" onclick="viewDetails(${factory.id})">Detay</button></td>
            </tr>
        `;
        
        tableBody.innerHTML += row;
    });
}

// Detay butonuna tıklanınca çalışacak fonksiyon
function viewDetails(factoryId) {
    alert("Seçilen Fabrika ID: " + factoryId + "\n(İleride bu butona basınca sayacın anlık verilerine veya grafiğine gideceğiz.)");
}

// Güvenlik kontrolünden sonra (DOMContentLoaded içinde) tabloyu yükle
document.addEventListener('DOMContentLoaded', () => {
    // (Önceki güvenlik kontrolleri ve logout kodu burada duruyor...)
    
    // Tabloyu çalıştır
    loadTableData();
});