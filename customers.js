// Modal açma/kapama işlemleri
const modal = document.getElementById('customerModal');
const openBtn = document.getElementById('openCustomerModalBtn');
const closeBtn = document.getElementById('closeCustomerModalBtn');

openBtn.addEventListener('click', () => {
    modal.classList.remove('hidden'); // hidden sınıfını kaldırarak görünür yap
});

closeBtn.addEventListener('click', () => {
    modal.classList.add('hidden'); // hidden sınıfını ekleyerek gizle
});

// Modal dışına tıklayınca kapatma
window.addEventListener('click', (e) => {
    if (e.target == modal) modal.classList.add('hidden');
});

document.addEventListener('DOMContentLoaded', () => {
    const customerForm = document.getElementById('newCustomerForm');

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

            if (result.success) {
                alert('Başarılı: ' + result.message);
                customerForm.reset(); // Formu temizle
                // Burada istersen müşteri listesini yenileyen bir fonksiyon çağırabilirsin
            } else {
                alert('Hata: ' + result.message);
            }
        } catch (error) {
            console.error('Bağlantı Hatası:', error);
            alert('Sunucuya ulaşılamadı. Python sunucusunun çalıştığından emin ol!');
        }
    });
});