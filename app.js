// app.js
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Sayfanın yenilenmesini durdur

    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;
    const errorDiv = document.getElementById('errorMessage');
    
    errorDiv.classList.add('hidden'); // Her denemede hatayı gizle

    try {
        // Gerçek Flask backend'e POST isteği atıyoruz
        const response = await fetch('https://outnumber-acquire-headscarf.ngrok-free.app/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: usernameInput, password: passwordInput })
        });
        
        const responseData = await response.json();
        
        if (response.ok && responseData.success) {
            // Başarılı giriş: Token ve rolü LocalStorage'a kaydet
            localStorage.setItem('userToken', responseData.token);
            localStorage.setItem('userRole', responseData.role);
            
            // ROLE KONTROLÜ VE YÖNLENDİRME (SUPERADMIN VE ADMIN AYNI PANELE GİDER)
            if(responseData.role === 'ADMIN' || responseData.role === 'SUPERADMIN') {
                window.location.href = 'admin-dashboard.html';
            } else if (responseData.role === 'CUSTOMER') {
                window.location.href = 'customer-dashboard.html';
            }
        } else {
            errorDiv.textContent = responseData.message || "Kullanıcı adı veya şifre hatalı!";
            errorDiv.classList.remove('hidden');
        }
    } catch (error) {
        errorDiv.textContent = "Sunucuya bağlanılamadı. Python sunucusunun çalıştığından emin ol!";
        errorDiv.classList.remove('hidden');
    }
});