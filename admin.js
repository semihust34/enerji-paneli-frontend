// admin.js
document.addEventListener('DOMContentLoaded', () => {
    // 1. Güvenlik Kontrolü (Sadece Adminler girebilir)
    const userRole = localStorage.getItem('userRole');
    
    if (userRole !== 'ADMIN') {
        alert("Bu sayfayı görüntüleme yetkiniz yok!");
        window.location.href = 'index.html'; // Giriş sayfasına geri şutla
        return;
    }

    // 2. Çıkış Yapma İşlemi
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userRole');
        window.location.href = 'index.html';
    });
});