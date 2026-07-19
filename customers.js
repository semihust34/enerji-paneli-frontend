// customers.js

const currentUserRole = localStorage.getItem('userRole');

// Token yoksa veya rol ADMIN/SUPERADMIN değilse login'e at
if (!requireRole(['ADMIN', 'SUPERADMIN'])) {
    // requireRole zaten yönlendirdi; bu dosyanın geri kalanı çalışmasın
    throw new Error('Yetkisiz erişim, yönlendiriliyor.');
}

let globalUsersData = [];
let allFactoriesData = [];

// ---------------------------------------------------------------------
// Fabrika checkbox'ları artık sabit (hardcoded) değil — gerçek
// /api/factories verisinden dinamik olarak oluşturuluyor. Böylece
// Fabrikalar sayfasında eklenen her fabrika otomatik olarak burada da
// seçilebilir hale gelir, ve müşteriye atanan isim gerçek fabrika
// kaydıyla birebir eşleşir (backend filtrelemesi buna dayanıyor).
// ---------------------------------------------------------------------
async function loadFactoriesForCheckboxes() {
    try {
        const res = await fetch(`${API_BASE}/factories`, { headers: authHeaders() });
        if (handleAuthFailure(res)) return [];
        const data = await res.json();
        allFactoriesData = data.factories || data || [];
    } catch (err) {
        console.error('Fabrika listesi yüklenemedi:', err);
        allFactoriesData = [];
    }
    return allFactoriesData;
}

function renderFactoryCheckboxes(containerId, inputName, checkedValues = []) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!allFactoriesData.length) {
        container.innerHTML = '<p style="color: var(--text-secondary); font-size: 0.85rem; margin: 0;">Henüz kayıtlı fabrika yok. Önce "Fabrikalar" sayfasından fabrika ekleyin.</p>';
        return;
    }

    container.innerHTML = allFactoriesData.map(f => {
        const checked = checkedValues.includes(f.name) ? 'checked' : '';
        const inputId = `${inputName}_${f.id}`;
        return `
            <label for="${inputId}" style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                <input type="checkbox" id="${inputId}" name="${inputName}" value="${f.name}" ${checked}> ${f.name}
            </label>`;
    }).join('');
}

async function loadCustomers() {
    try {
        const response = await fetch(`${API_BASE}/customers`, { headers: authHeaders() });
        if (handleAuthFailure(response)) return;
        const result = await response.json();
        
        if (result.success) {
            globalUsersData = result.customers;
            const tbody = document.getElementById('customerTableBody');
            tbody.innerHTML = '';
            
            result.customers.forEach(user => {
                let displayPassword = "*****";
                if (currentUserRole === 'SUPERADMIN') {
                    displayPassword = user.password; 
                } else if (currentUserRole === 'ADMIN') {
                    if (user.role === 'SUPERADMIN') displayPassword = '<span style="color: var(--error-color);">GİZLİ</span>';
                    else displayPassword = user.password;
                }

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

                let roleBadge = '';
                let facilitiesText = '<span style="color: var(--accent-color);">Tüm Tesisler</span>';

                if (user.role === 'SUPERADMIN') {
                    roleBadge = '<span class="badge" style="background: rgba(255, 215, 0, 0.2); color: #ffd700;">Yönetici</span>';
                } else if (user.role === 'ADMIN') {
                    roleBadge = '<span class="badge danger">Personel</span>';
                } else {
                    roleBadge = '<span class="badge success">Müşteri</span>';
                    facilitiesText = user.factories ? user.factories : '<span style="color:var(--error-color)">Atanmadı</span>';
                }

                tbody.innerHTML += `
                    <tr>
                        <td>${user.company_name}</td>
                        <td>${user.username}</td>
                        <td style="font-family: monospace; color: var(--accent-color);">${displayPassword}</td>
                        <td style="font-size: 0.9rem;">${facilitiesText}</td>
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

window.deleteUser = async function(userId) {
    if (!confirm("Bu kullanıcıyı kalıcı olarak silmek istediğinize emin misiniz?")) return;

    try {
        const response = await fetch(`${API_BASE}/customers/${userId}`, {
            method: 'DELETE',
            headers: authHeaders()
        });
        if (handleAuthFailure(response)) return;
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

window.openEditModal = async function(userId) {
    const userToEdit = globalUsersData.find(u => u.id === userId);
    if (!userToEdit) return;

    document.getElementById('editUserId').value = userToEdit.id;
    document.getElementById('editCustName').value = userToEdit.company_name;
    document.getElementById('editCustUsername').value = userToEdit.username;
    document.getElementById('editCustPassword').value = userToEdit.password;
    
    const editRoleSelect = document.getElementById('editCustRole');
    editRoleSelect.value = userToEdit.role;

    // Dinamik Gizleme (Müşteriyse Fabrika Göster, Yoksa Gizle)
    const editFactorySection = document.getElementById('editFactorySection');
    if (userToEdit.role === 'CUSTOMER') {
        editFactorySection.style.display = 'block';
    } else {
        editFactorySection.style.display = 'none';
    }

    // Güncel fabrika listesini çekip checkbox'ları yeniden oluştur,
    // kullanıcının hâlihazırda erişebildiği fabrikaları işaretli getir.
    await loadFactoriesForCheckboxes();
    const checkedValues = (userToEdit.factories && userToEdit.role === 'CUSTOMER')
        ? userToEdit.factories.split(', ').map(f => f.trim())
        : [];
    renderFactoryCheckboxes('editFactoryCheckboxList', 'editFactories', checkedValues);

    document.getElementById('editCustomerModal').classList.remove('hidden');
};

document.addEventListener('DOMContentLoaded', () => {
    const adminNameEl = document.getElementById('adminName');
    if (adminNameEl) adminNameEl.textContent = localStorage.getItem('userCompany') || 'Yetkili';

    loadCustomers();
    loadFactoriesForCheckboxes().then(() => {
        renderFactoryCheckboxes('addFactoryCheckboxList', 'factories');
    });

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

    // --- FORM SEÇENEĞİ DEĞİŞTİĞİNDE FABRİKA KUTULARINI GİZLE/GÖSTER ---
    const custRoleDropdown = document.getElementById('custRole');
    const addFactorySection = document.getElementById('addFactorySection');
    if (custRoleDropdown && addFactorySection) {
        custRoleDropdown.addEventListener('change', function() {
            if (this.value === 'CUSTOMER') {
                addFactorySection.style.display = 'block';
            } else {
                addFactorySection.style.display = 'none';
            }
        });
        // İlk açılış durumu
        addFactorySection.style.display = custRoleDropdown.value === 'CUSTOMER' ? 'block' : 'none';
    }

    const editCustRoleDropdown = document.getElementById('editCustRole');
    const editFactorySection = document.getElementById('editFactorySection');
    if (editCustRoleDropdown && editFactorySection) {
        editCustRoleDropdown.addEventListener('change', function() {
            if (this.value === 'CUSTOMER') {
                editFactorySection.style.display = 'block';
            } else {
                editFactorySection.style.display = 'none';
            }
        });
    }
    // -----------------------------------------------------------------

    const addModal = document.getElementById('customerModal');
    const openAddBtn = document.getElementById('openCustomerModalBtn');
    const closeAddBtn = document.getElementById('closeCustomerModalBtn');
    
    if (openAddBtn) {
        openAddBtn.addEventListener('click', async () => {
            // Ekle butonuna tıklandığında Müşteri seçiliyse blok görünür kalsın
            if(custRoleDropdown) {
                addFactorySection.style.display = custRoleDropdown.value === 'CUSTOMER' ? 'block' : 'none';
            }
            addModal.classList.remove('hidden');
            // Güncel fabrika listesiyle checkbox'ları yenile
            await loadFactoriesForCheckboxes();
            renderFactoryCheckboxes('addFactoryCheckboxList', 'factories');
        });
    }
    if (closeAddBtn) closeAddBtn.addEventListener('click', () => addModal.classList.add('hidden'));

    const editModal = document.getElementById('editCustomerModal');
    const closeEditBtn = document.getElementById('closeEditModalBtn');
    if (closeEditBtn) closeEditBtn.addEventListener('click', () => editModal.classList.add('hidden'));

    window.addEventListener('click', (e) => {
        if (e.target === addModal) addModal.classList.add('hidden');
        if (e.target === editModal) editModal.classList.add('hidden');
    });

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = 'index.html';
        });
    }

    const newCustomerForm = document.getElementById('newCustomerForm');
    if (newCustomerForm) {
        newCustomerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const selectedRole = document.getElementById('custRole').value;
            let checkedFactories = "";
            
            // Sadece rol Müşteri ise fabrikaları topla
            if (selectedRole === 'CUSTOMER') {
                checkedFactories = Array.from(document.querySelectorAll('input[name="factories"]:checked'))
                                          .map(cb => cb.value).join(', ');
            }

            const data = {
                company_name: document.getElementById('custName').value,
                username: document.getElementById('custUsername').value,
                password: document.getElementById('custPassword').value,
                role: selectedRole,
                factories: checkedFactories 
            };

            try {
                const response = await fetch(`${API_BASE}/customers`, {
                    method: 'POST',
                    headers: authHeaders({ 'Content-Type': 'application/json' }),
                    body: JSON.stringify(data)
                });
                if (handleAuthFailure(response)) return;
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

    const editCustomerForm = document.getElementById('editCustomerForm');
    if (editCustomerForm) {
        editCustomerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const userId = document.getElementById('editUserId').value;
            const selectedRole = document.getElementById('editCustRole').value;
            let checkedEditFactories = "";
            
            // Sadece rol Müşteri ise fabrikaları topla
            if (selectedRole === 'CUSTOMER') {
                checkedEditFactories = Array.from(document.querySelectorAll('input[name="editFactories"]:checked'))
                                              .map(cb => cb.value).join(', ');
            }

            const data = {
                company_name: document.getElementById('editCustName').value,
                username: document.getElementById('editCustUsername').value,
                password: document.getElementById('editCustPassword').value,
                role: selectedRole,
                factories: checkedEditFactories
            };

            try {
                const response = await fetch(`${API_BASE}/customers/${userId}`, {
                    method: 'PUT',
                    headers: authHeaders({ 'Content-Type': 'application/json' }),
                    body: JSON.stringify(data)
                });
                if (handleAuthFailure(response)) return;
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
