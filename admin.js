// admin.js
document.addEventListener('DOMContentLoaded', () => {
    // 1. Güvenlik Kontrolü (Sadece Adminler ve Yöneticiler girebilir)
    const userRole = localStorage.getItem('userRole');
    
    if (userRole !== 'ADMIN' && userRole !== 'SUPERADMIN') {
        alert("Bu sayfayı görüntüleme yetkiniz yok!");
        window.location.href = 'index.html'; // Giriş sayfasına geri şutla
        return;
    }

    // 2. Çıkış Yapma İşlemi
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('userToken');
            localStorage.removeItem('userRole');
            window.location.href = 'index.html';
        });
    }

    // Tabloyu ve Grafiği Çalıştır
    if (typeof loadTableData === 'function') loadTableData();
    if (typeof renderChart === 'function') renderChart();
});


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
    if (!tableBody) return;
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

// Formu Gönderme ve Tabloyu Anlık Güncelleme
const newFactoryForm = document.getElementById('newFactoryForm');
if (newFactoryForm) {
    newFactoryForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Sayfa yenilenmesini engelle

        // Inputlardaki değerleri al
        const nameVal = document.getElementById('newFacName').value;
        const ipVal = document.getElementById('newFacIp').value;
        const countVal = document.getElementById('newFacCount').value;

        // Yeni objeyi sahte veri dizimize ekle
        const newFactory = {
            id: mockFactoryData.length + 1,
            name: nameVal,
            ip: ipVal,
            meterCount: parseInt(countVal),
            lastSeen: "Şimdi eklendi",
            status: "Bağlantı Bekleniyor",
            isWarning: false
        };

        mockFactoryData.push(newFactory);

        // Tabloyu yeniden çiz (JavaScript dizisindeki yeni veriyle)
        loadTableData();

        // Formu temizle ve modalı kapat
        newFactoryForm.reset();
        modal.classList.add('hidden');
    });
}

// --- GRAFİK (CHART.JS) OLUŞTURMA ---
function renderChart() {
    const chartCanvas = document.getElementById('energyChart');
    if (!chartCanvas) return;
    
    const ctx = chartCanvas.getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
            datasets: [{
                label: 'Ortalama Reaktif Oran (%)',
                data: [12, 15, 18, 14, 22, 19, 20],
                borderColor: '#00adb5', // Bizim vurgu rengimiz (Turkuaz)
                backgroundColor: 'rgba(0, 173, 181, 0.1)', // Altını hafif doldurma
                borderWidth: 2,
                pointBackgroundColor: '#121212',
                pointBorderColor: '#00adb5',
                pointBorderWidth: 2,
                pointRadius: 4,
                fill: true,
                tension: 0.4 // Çizgileri kavisli (smooth) yapar
            }]
        },
        options: {
            maintainAspectRatio: false, // <-- BU SATIRI EKLE
            responsive: true,
             layout: {
                padding: {
                    bottom: 10 
                }
            },           
            plugins: {
                legend: { display: false } // Üstteki etiketi gizler
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: '#2c2c2c' }, // Arka plan çizgileri (Koyu)
                    ticks: { color: '#a0a0a0' } // Rakam renkleri
                },
                x: {
                    grid: { color: '#2c2c2c' },
                    ticks: { 
                        color: '#a0a0a0',
                        // 2. EKLENEN KISIM: Saat yazılarını (08:00 vb.) çizgiden aşağı iter
                        padding: 10 
                    }
                }
            }
        }
    });
}
