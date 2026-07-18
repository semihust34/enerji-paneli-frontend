// customers.js

const currentUserRole = localStorage.getItem('userRole');

if (currentUserRole === 'CUSTOMER') {
    window.location.href = 'customer-dashboard.html';
}

let globalUsersData = [];

async function loadCustomers() {
    try {
        const response = await fetch('https://outnumber-acquire-headscarf.ngrok-free.dev/api/customers');
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
        const response = await fetch(`https://outnumber-acquire-headscarf.ngrok-free.dev/api/customers/${userId}`, { method: 'DELETE' });
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

window.openEditModal = function(userId) {
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

    document.querySelectorAll('input[name="editFactories"]').forEach(cb => cb.checked = false);
    if (userToEdit.factories && userToEdit.role === 'CUSTOMER') {
        const userFacs = userToEdit.factories.split(', ');
        userFacs.forEach(fac => {
            const cb = document.querySelector(`input[name="editFactories"][value="${fac}"]`);
            if (cb) cb.checked = true;
        });
    }

    document.getElementById('editCustomerModal').classList.remove('hidden');
};

document.addEventListener('DOMContentLoaded', () => {
    loadCustomers();

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
        openAddBtn.addEventListener('click', () => {
            // Ekle butonuna tıklandığında Müşteri seçiliyse blok görünür kalsın
            if(custRoleDropdown) {
                addFactorySection.style.display = custRoleDropdown.value === 'CUSTOMER' ? 'block' : 'none';
            }
            addModal.classList.remove('hidden');
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
                const response = await fetch('https://outnumber-acquire-headscarf.ngrok-free.dev/api/customers', {
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
                const response = await fetch(`https://outnumber-acquire-headscarf.ngrok-free.dev/api/customers/${userId}`, {
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