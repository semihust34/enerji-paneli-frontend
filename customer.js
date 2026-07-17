// customer.js

// Sadece bu müşteriye ait olduğunu varsaydığımız sahte veriler
const mockMyFacilities = [
    {
        id: 101,
        name: "Gebze Üretim Bandı",
        meterCount: 5,
        lastSeen: "3 dk önce",
        status: "Normal",
        isWarning: false
    },
    {
        id: 102,
        name: "Tuzla Depo Alanı",
        meterCount: 2,
        lastSeen: "12 dk önce",
        status: "Sınırda (%19)",
        isWarning: true
    }
];

function loadCustomerData() {
    const tableBody = document.getElementById('customerTableBody');
    tableBody.innerHTML = '';

    mockMyFacilities.forEach(facility => {
        const badgeClass = facility.isWarning ? 'badge danger' : 'badge success';
        
        const row = `
            <tr>
                <td>${facility.name}</td>
                <td>${facility.meterCount}</td>
                <td>${facility.lastSeen}</td>
                <td><span class="${badgeClass}">${facility.status}</span></td>
            </tr>
        `;
        
        tableBody.innerHTML += row;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Güvenlik Kontrolü (Sadece Müşteriler girebilir)
    const userRole = localStorage.getItem('userRole');
    
    if (userRole !== 'CUSTOMER') {
        alert("Yetkisiz erişim! Müşteri girişine yönlendiriliyorsunuz.");
        window.location.href = 'index.html'; 
        return;
    }

    // 2. Tabloyu Doldur
    loadCustomerData();

    // 3. Çıkış Yapma İşlemi
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userRole');
        window.location.href = 'index.html';
    });
});