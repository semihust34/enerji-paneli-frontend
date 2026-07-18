// customers.js

async function loadCustomers() {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/customers');
        const result = await response.json();
        
        if (result.success) {
            const tbody = document.getElementById('customerTableBody');
            tbody.innerHTML = '';
            
            result.customers.forEach(user => {
                // Veritabanından gelen role göre etiket oluştur
                const roleBadge = user.role === 'ADMIN' 
                    ? '<span class="badge danger">Yönetici</span>' 
                    : '<span class="badge success">Müşteri</span>';

                tbody.innerHTML += `
                    <tr>
                        <td>${user.company_name}</td>
                        <td>${user.username}</td>
                        <td>Tüm Tesisler</td>
                        <td>${roleBadge}</td>
                        <td>
                            <button class="action-btn" onclick="deleteUser(${user.id})" style="border-color: var(--error-color); color: var(--error-color);">
                                <i class="fas fa-trash"></i> Sil
                            </button>
                        </td>
                    </tr>
                `;
            });
        }
    } catch (error) {
        console.error('Kullanıcılar çekilemedi:', error);
    }
}

// HTML içinden tetiklenebilmesi için window objesine bağlıyoruz
window.deleteUser = async function(userId) {
    if (!confirm("Bu kullanıcıyı sistemden kalıcı olarak silmek istediğinize emin misiniz?")) return;

    try {
        const response = await fetch(`http://127.0.0.1:5000/api/customers/${userId}`, {
            method: 'DELETE'
        });
        const result = await response.json();

        if (response.ok && result.success) {
            alert(result.message);
            loadCustomers(); // Silme sonrası tabloyu anında güncelle
        } else {
            alert("Hata: " + (result.message || 'Silinemedi.'));
        }
    } catch (error) {
        alert("Bağlantı hatası. Python sunucusu çalışıyor mu?");
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('customerModal');
    const openBtn = document.getElementById('openCustomerModalBtn');
    const closeBtn = document.getElementById('closeCustomerModalBtn');
    const customerForm = document.getElementById('newCustomerForm');

    loadCustomers();

    if (openBtn) openBtn.addEventListener('click', () => modal.classList.remove('hidden'));
    if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
    window.addEventListener('click', (e) => { if (e.target === modal) modal.classList.add('hidden'); });

    if (customerForm) {
        customerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const customerData = {
                company_name: document.getElementById('custName').value,
                username: document.getElementById('custUsername').value,
                password: document.getElementById('custPassword').value
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
                    loadCustomers();
                } else {
                    alert('Hata: ' + (result.message || 'Bir hata oluştu.'));
                }
            } catch (error) {
                alert('Sunucuya ulaşılamadı.');
            }
        });
    }
});