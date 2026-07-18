// customers.js

// 1. GÜVENLİK: Aktif kullanıcının rolünü al
const currentUserRole = localStorage.getItem('userRole');

// Müşterilerin bu sayfaya girmesini engelle
if (currentUserRole === 'CUSTOMER') {
    window.location.href = 'customer-dashboard.html';
}

// Global olarak tüm kullanıcı verilerini tutacağımız dizi
let globalUsersData = [];

// 2. Kullanıcıları Listeleme Fonksiyonu
async function loadCustomers() {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/customers');
        const result = await response.json();
        
        if (result.success) {
            globalUsersData = result.customers;
            const tbody = document.getElementById('customerTableBody');
            tbody.innerHTML = '';
            
            result.customers.forEach(user => {
                // --- A. ŞİFRE GÖSTERİM MANTIĞI ---
                let displayPassword = "*****";
                if (currentUserRole === 'SUPERADMIN') {
                    displayPassword = user.password; 
                } else if (currentUserRole === 'ADMIN') {
                    if (user.role === 'SUPERADMIN') displayPassword = '<span style="color: var(--error-color);">GİZLİ</span>';
                    else displayPassword = user.password;
                }

                // --- B. YETKİ MANTIĞI: KİM KİMİ DÜZENLEYEBİLİR VE SİLEBİLİR? ---
                let canEditAndDelete = false;
                
                if (currentUserRole === 'SUPERADMIN') {
                    canEditAndDelete = true;
                } else if (currentUserRole === 'ADMIN') {
                    if (user.role !== 'SUPERADMIN') {
                        canEditAndDelete = true;
                    }
                }

                let actionHtml = '';
                if (canEditAndDelete) {
                    actionHtml = `
                        <button class="action-btn" onclick="openEditModal(${user.id})" style="border-color: #f6e58d; color: #f6e58d; margin-right: 5px;"><i class="fas fa-edit"></i> Düzenle</button>
                        <button class="action-btn" onclick="deleteUser(${user.id})" style="border-color: var(--error-color); color: var(--error-color);"><i class="fas fa-trash"></i> Sil</button>
                    `;
                } else {
                    actionHtml = `<span style="color: #555; font-size: 0.8rem;"><i class="fas fa-lock"></i> Yetki Yok</span>`;
                }

                // --- C. ROL ETİKETLERİ ---
                let roleBadge = '';
                if (user.role === 'SUPERADMIN') roleBadge = '<span class="badge" style="background: rgba(255, 215, 0, 0.2); color: #ffd700;">Yönetici</span>';
                else if (user.role === 'ADMIN') roleBadge = '<span class="badge danger">Personel</span>';
                else roleBadge = '<span class="badge success">Müşteri</span>';

                tbody.innerHTML += `
                    <tr>
                        <td>${user.company_name}</td>
                        <td>${user.username}</td>
                        <td style="font-family: monospace; color: var(--accent-color);">${displayPassword}</td>
                        <td>Tüm Tesisler</td>
                        <td>${roleBadge}</td>
                        <td>${actionHtml}</td>
                    </tr>
                `;
            });
        }
    } catch (error) {
        console.error('Kullanıcılar çekilemedi:', error);
    }
}

// 3. Silme Fonksiyonu
window.deleteUser = async function(userId) {
    if (!confirm("Bu kullanıcıyı kalıcı olarak silmek istediğinize emin misiniz?")) return;

    try {
        const response = await fetch(`http://127.0.0.1:5000/api/customers/${userId}`, { method: 'DELETE' });
        const result = await response.json();
        if (response.ok && result.success) {
            loadCustomers();
        } else {
            alert("Hata: " + (result.message || 'Silinemedi.'));
        }
    } catch (error) {
        alert("Bağlantı hatası.");
    }
};

// 4. Düzenleme Modalını Açma Fonksiyonu
window.openEditModal = function(userId) {
    const userToEdit = globalUsersData.find(u => u.id === userId);
    if (!userToEdit) return;

    document.getElementById('editUserId').value = userToEdit.id;
    document.getElementById('editCustName').value = userToEdit.company_name;
    document.getElementById('editCustUsername').value = userToEdit.username;
    document.getElementById('editCustPassword').value = userToEdit.password;
    document.getElementById('editCustRole').value = userToEdit.role;

    document.getElementById('editCustomerModal').classList.remove('hidden');
};

// 5. Olay Dinleyicileri (Sayfa Yüklendiğinde)
document.addEventListener('DOMContentLoaded', () => {
    loadCustomers();

    // =========================================================================
    // YENİ EKLENEN GÜVENLİK KATI: Personel ise SUPERADMIN seçeneğini DOM'dan sil
    // =========================================================================
    if (currentUserRole !== 'SUPERADMIN') {
        const custRoleSelect = document.getElementById('custRole');
        const editCustRoleSelect = document.getElementById('editCustRole');
        
        if (custRoleSelect) {
            const superAdminOption = custRoleSelect.querySelector('option[value="SUPERADMIN"]');
            if (superAdminOption) superAdminOption.remove();
        }
        
        if (editCustRoleSelect) {
            const superAdminOption = editCustRoleSelect.querySelector('option[value="SUPERADMIN"]');
            if (superAdminOption) superAdminOption.remove();
        }
    }
    // =========================================================================

    // Yeni Kullanıcı Ekleme Modal İşlemleri
    const addModal = document.getElementById('customerModal');
    const openAddBtn = document.getElementById('openCustomerModalBtn');
    const closeAddBtn = document.getElementById('closeCustomerModalBtn');
    
    if (openAddBtn) openAddBtn.addEventListener('click', () => addModal.classList.remove('hidden'));
    if (closeAddBtn) closeAddBtn.addEventListener('click', () => addModal.classList.add('hidden'));

    // Düzenleme Modal İşlemleri
    const editModal = document.getElementById('editCustomerModal');
    const closeEditBtn = document.getElementById('closeEditModalBtn');
    if (closeEditBtn) closeEditBtn.addEventListener('click', () => editModal.classList.add('hidden'));

    // Modalların Dışına Tıklayınca Kapatma
    window.addEventListener('click', (e) => {
        if (e.target === addModal) addModal.classList.add('hidden');
        if (e.target === editModal) editModal.classList.add('hidden');
    });

    // Çıkış Yap
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = 'index.html';
        });
    }

    // A. YENİ KULLANICI KAYIT İŞLEMİ (POST)
    const newCustomerForm = document.getElementById('newCustomerForm');
    if (newCustomerForm) {
        newCustomerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = {
                company_name: document.getElementById('custName').value,
                username: document.getElementById('custUsername').value,
                password: document.getElementById('custPassword').value,
                role: document.getElementById('custRole').value 
            };

            try {
                const response = await fetch('http://127.0.0.1:5000/api/customers', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await response.json();

                if (response.ok && result.success) {
                    newCustomerForm.reset();
                    addModal.classList.add('hidden');
                    loadCustomers();
                } else {
                    alert('Hata: ' + result.message);
                }
            } catch (error) {
                alert('Bağlantı Hatası!');
            }
        });
    }

    // B. KULLANICI DÜZENLEME İŞLEMİ (PUT)
    const editCustomerForm = document.getElementById('editCustomerForm');
    if (editCustomerForm) {
        editCustomerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const userId = document.getElementById('editUserId').value;
            const data = {
                company_name: document.getElementById('editCustName').value,
                username: document.getElementById('editCustUsername').value,
                password: document.getElementById('editCustPassword').value,
                role: document.getElementById('editCustRole').value 
            };

            try {
                const response = await fetch(`http://127.0.0.1:5000/api/customers/${userId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await response.json();

                if (response.ok && result.success) {
                    editCustomerForm.reset();
                    editModal.classList.add('hidden');
                    loadCustomers();
                } else {
                    alert('Hata: ' + result.message);
                }
            } catch (error) {
                alert('Bağlantı Hatası!');
            }
        });
    }
});