// customers.js

// 1. Müşterileri veritabanından çekip tabloyu dolduran fonksiyon
async function loadCustomers() {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/customers');
        const result = await response.json();
        
        if (result.success) {
            const tbody = document.getElementById('customerTableBody');
            tbody.innerHTML = ''; // Mevcut tabloyu temizle
            
            result.customers.forEach(cust => {
                tbody.innerHTML += `
                    <tr>
                        <td>${cust.company_name}</td>
                        <td>${cust.username}</td>
                        <td>---</td>
                        <td>Müşteri</td>
                        <td><button class="action-btn">Detay</button></td>
                    </tr>
                `;
            });
        }
    } catch (error) {
        console.error('Müşteriler çekilemedi:', error);
    }
}

// 2. Sayfa yüklendiğinde çalışacak tüm mantık
document.addEventListener('DOMContentLoaded', () => {
    // Modal ve butonları seç
    const modal = document.getElementById('customerModal');
    const openBtn = document.getElementById('openCustomerModalBtn');
    const closeBtn = document.getElementById('closeCustomerModalBtn');
    const customerForm = document.getElementById('newCustomerForm');

    // Müşterileri ilk yükleme
    loadCustomers();

    // Modal açma işlemleri
    if (openBtn) {
        openBtn.addEventListener('click', () => {
            modal.classList.remove('hidden');
        });
    }

    // Modal kapatma işlemleri
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });
    }

    // Modal dışına tıklayınca kapatma
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });

    // Form gönderim ve kayıt işlemi
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
                    loadCustomers(); // Kayıt sonrası tabloyu anında güncelle
                } else {
                    alert('Hata: ' + (result.message || 'Bir hata oluştu.'));
                }
            } catch (error) {
                console.error('Bağlantı Hatası:', error);
                alert('Sunucuya ulaşılamadı. Python sunucusunun çalıştığından emin ol!');
            }
        });
    }
});