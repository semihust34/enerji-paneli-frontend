// app.js
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Sayfanın yenilenmesini durdur

    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;
    const errorDiv = document.getElementById('errorMessage');
    
    errorDiv.classList.add('hidden'); // Her denemede hatayı gizle

    try {
        // Backend API hazır olana kadar simüle edilmiş giriş fonksiyonu kullanıyoruz
        const responseData = await mockBackendLogin(usernameInput, passwordInput);
        
        if(responseData.success) {
            // Başarılı giriş: Token ve rolü LocalStorage'a kaydet
            localStorage.setItem('userToken', responseData.token);
            localStorage.setItem('userRole', responseData.role);
            
            // ROLE KONTROLÜ VE YÖNLENDİRME
            if(responseData.role === 'ADMIN') {
                window.location.href = 'admin-dashboard.html';
            } else if (responseData.role === 'CUSTOMER') {
                window.location.href = 'customer-dashboard.html';
            }
        } else {
            errorDiv.textContent = responseData.message;
            errorDiv.classList.remove('hidden');
        }
    } catch (error) {
        errorDiv.textContent = "Sunucuya bağlanılamadı.";
        errorDiv.classList.remove('hidden');
    }
});

// Geçici (Mock) Backend Fonksiyonu
function mockBackendLogin(username, password) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Admin Senaryosu
            if (username === "admin" && password === "1234") {
                resolve({
                    success: true,
                    role: "ADMIN",
                    token: "mock_jwt_token_for_admin_xyz"
                });
            } 
            // Müşteri Senaryosu
            else if (username === "musteri" && password === "1234") {
                resolve({
                    success: true,
                    role: "CUSTOMER",
                    token: "mock_jwt_token_for_customer_abc"
                });
            } 
            // Hatalı Giriş
            else {
                resolve({
                    success: false,
                    message: "Kullanıcı adı veya şifre hatalı!"
                });
            }
        }, 1000); // 1 saniyelik ağ gecikmesi simülasyonu
    });
}