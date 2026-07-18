// customers.js

// 1. GÜVENLİK: Aktif kullanıcının rolünü al
const currentUserRole = localStorage.getItem('userRole');

// Eğer giren kişi CUSTOMER ise bu sayfadan zorla ana sayfaya at
if (currentUserRole === 'CUSTOMER') {
    window.location.href = 'customer-dashboard.html';
}

// 2. Kullanıcıları Listeleme Fonksiyonu
async function loadCustomers() {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/customers');
        const result = await response.json();
        
        if (result.success) {
            const tbody = document.getElementById('customerTableBody');
            tbody.innerHTML = ''; // Tabloyu temizle
            
            result.customers.forEach(user => {
                // --- A. ŞİFRE GÖSTERİM MANTIĞI ---
                let displayPassword = "*****";
                
                if (currentUserRole === 'SUPERADMIN') {
                    // Yönetici herkesin düz şifresini görür
                    displayPassword = user.password; 
                } else if (currentUserRole === 'ADMIN') {
                    // Personel, Yönetici'nin şifresini göremez, diğerlerini görür
                    if (user.role === 'SUPERADMIN') {
                        displayPassword = '<span style="color: var(--error-color);">GİZLİ</span>';
                    } else {
                        displayPassword = user.password;
                    }
                }

                // --- B. SİLME YETKİSİ MANTIĞI ---
                let actionHtml = '';
                if (currentUserRole === 'SUPERADMIN') {
                    // Sadece SUPERADMIN silebilir
                    actionHtml = `<button class="action-btn" onclick="deleteUser(${user.id})" style="border-color: var(--error-color); color: var(--error-color);"><i class="fas fa-trash"></i> Sil</button>`;
                } else {
                    // Personel silemez
                    actionHtml = `<span style="color: #555; font-size: 0.8rem;"><i class="fas fa-lock"></i> Yetki Yok</span>`;
                }

                // --- C. ROL ETİKETLERİ ---
                let roleBadge = '';
                if (user.role === 'SUPERADMIN') {
                    roleBadge = '<span class="badge" style="background: rgba(255, 215, 0, 0.2); color: #ffd700;">Yönetici</span>';
                } else if (user.role === 'ADMIN') {
                    roleBadge = '<span class="badge danger">Personel</span>';
                } else {
                    roleBadge = '<span class="badge success">Müşteri</span>';
                }

                // Tabloya HTML olarak ekle
                tbody.innerHTML += `
                    <tr>
                        <td>${user.company_name}</td>
                        <td>${user.username}</td>
                        <td style="font-family: monospace; letter-spacing: 1px; color: var(--accent-color);">${displayPassword}</td>
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

// 3. Kullanıcı Silme İşlemi (Global Fonksiyon)
window.deleteUser = async function(userId) {
    if (!confirm("Bu kullanıcıyı sistemden kalıcı olarak silmek istediğinize emin misiniz?")) return;

    try {
        const response = await fetch(`http://127.0.0.1:5000/api/customers/${userId}`, {
            method: 'DELETE'
        });
        const result = await response.json();

        if (response.ok && result.success) {
            alert(result.message);
            loadCustomers(); // Silme sonrası tabloyu yenile
        } else {
            alert("Hata: " + (result.message || 'Silinemedi.'));
        }
    } catch (error) {
        alert("Bağlantı hatası. Python sunucusu çalışıyor mu?");
    }
};

// 4. Sayfa Yüklendiğinde Çalışacak Olaylar
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('customerModal');
    const openBtn = document.getElementById('openCustomerModalBtn');
    const closeBtn = document.getElementById('closeCustomerModalBtn');
    const customerForm = document.getElementById('newCustomerForm');
    const logoutBtn = document.getElementById('logoutBtn');

    // Sayfa açılışında verileri yükle
    loadCustomers();

    // Çıkış Yapma Mantığı
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('userToken');
            localStorage.removeItem('userRole');
            window.location.href = 'index.html';
        });
    }

    // Modal Aç/Kapat Mantığı
    if (openBtn) openBtn.addEventListener('click', () => modal.classList.remove('hidden'));
    if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.add('hidden');
    });

    // Form Gönderimi (Yeni Kullanıcı Ekleme)
    if (customerForm) {
        customerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Formdaki tüm verileri al (Seçilen Rol Dahil)
            const customerData = {
                company_name: document.getElementById('custName').value,
                username: document.getElementById('custUsername').value,
                password: document.getElementById('custPassword').value,
                role: document.getElementById('custRole').value 
            };

            try {
                const response = await fetch('http://127.0.0.1:5000/api/customers', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(customerData)
                });
                
                const result = await response.json();

                if (response.ok && result.success) {
                    alert('Başarılı: ' + result.message);
                    customerForm.reset();
                    modal.classList.add('hidden');
                    loadCustomers(); // Kayıt sonrası tabloyu anında yenile
                } else {
                    alert('Hata: ' + (result.message || 'Bir hata oluştu.'));
                }
            } catch (error) {
                console.error('Bağlantı Hatası:', error);
                alert('Sunucuya ulaşılamadı. Python sunucusunun çalıştığını kontrol edin!');
            }
        });
    }
});