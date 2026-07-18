// customers.js

// Temsili Müşteri Verileri
const mockCustomers = [
    {
        id: 1,
        companyName: "ABC Lojistik",
        username: "abc_admin",
        assignedFactories: ["Plastik Enjeksiyon A.Ş."],
        permissions: ["İzleme", "Rapor İndirme"]
    },
    {
        id: 2,
        companyName: "Mega Metal A.Ş.",
        username: "mega_user",
        assignedFactories: ["Demir Döküm Fabrikası", "Plastik Enjeksiyon A.Ş."],
        permissions: ["İzleme", "Alarm Ayarlama"]
    }
];

// Tabloyu Ekrana Çizdiren Fonksiyon
function renderCustomerTable() {
    const tbody = document.getElementById('customerTableBody');
    tbody.innerHTML = '';
    
    mockCustomers.forEach(cust => {
        // Yetkileri şık rozetlere (badge) dönüştürüyoruz
        const permissionsHtml = cust.permissions.map(p => `<span class="badge success" style="margin-right: 5px;">${p}</span>`).join('');
        // Fabrikaları alt alta yazdırıyoruz
        const factoriesHtml = cust.assignedFactories.join('<br>');

        const row = `
            <tr>
                <td><strong>${cust.companyName}</strong></td>
                <td><span style="color: var(--text-secondary);">@${cust.username}</span></td>
                <td>${factoriesHtml}</td>
                <td>${permissionsHtml}</td>
                <td>
                    <button class="action-btn" style="margin-right: 5px;"><i class="fas fa-edit"></i> Düzenle</button> 
                    <button class="action-btn" style="color: var(--error-color); border-color: var(--error-color);"><i class="fas fa-trash"></i> Sil</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Sayfa yüklendiğinde tabloyu doldur
    renderCustomerTable();

    // Modal (Açılır Pencere) İşlemleri
    const modal = document.getElementById('customerModal');
    const openBtn = document.getElementById('openCustomerModalBtn');
    const closeBtn = document.getElementById('closeCustomerModalBtn');

    openBtn.addEventListener('click', () => {
        modal.classList.remove('hidden');
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    // Çıkış Yap Butonu
    document.getElementById('logoutBtn').addEventListener('click', () => {
        window.location.href = 'index.html';
    });
});