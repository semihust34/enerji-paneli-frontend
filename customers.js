// customers.js
document.addEventListener('DOMContentLoaded', () => {
    // Modal ve Butonları DOM yüklendikten sonra seçiyoruz
    const modal = document.getElementById('customerModal');
    const openBtn = document.getElementById('openCustomerModalBtn');
    const closeBtn = document.getElementById('closeCustomerModalBtn');
    const customerForm = document.getElementById('newCustomerForm');

    // 1. Modal Açma/Kapama İşlemleri
    if (openBtn) {
        openBtn.addEventListener('click', () => {
            modal.classList.remove('hidden'); // Modal'ı görünür yap
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.add('hidden'); // Modal'ı gizle
        });
    }

    // Modal dışına tıklayınca kapatma
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });

    // 2. Form Gönderme İşlemi
    if (customerForm) {
        customerForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Sayfanın yenilenmesini engelle

            // Formdan verileri çek
            const customerData = {
                company_name: document.getElementById('custName').value,
                username: document.getElementById('custUsername').value,
                password: document.getElementById('custPassword').value
            };

            try {
                // Backend'e POST isteği gönder
                const response = await fetch('http://127.0.0.1:5000/api/customers', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(customerData)
                });

                const result = await response.json();

                if (response.ok && result.success) { // Başarı kontrolü
                    alert('Başarılı: ' + result.message);
                    customerForm.reset(); // Formu temizle
                    modal.classList.add('hidden'); // Form başarılıysa modalı kapat
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