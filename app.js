// app.js

// 1. Sayfa yüklendiğinde "Beni Hatırla" kontrolü yap
document.addEventListener("DOMContentLoaded", function() {
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const rememberMeCheckbox = document.getElementById("rememberMe");

    // Kayıtlı kullanıcı adı VE şifre varsa kutulara doldur
    if (localStorage.getItem("rememberedUsername") && localStorage.getItem("rememberedPassword")) {
        usernameInput.value = localStorage.getItem("rememberedUsername");
        passwordInput.value = localStorage.getItem("rememberedPassword");
        rememberMeCheckbox.checked = true;
    }
});

// 2. GİRİŞ İŞLEMİ
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Sayfanın yenilenmesini durdur

    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;
    const rememberMeCheckbox = document.getElementById('rememberMe');
    const errorDiv = document.getElementById('errorMessage');
    
    errorDiv.classList.add('hidden'); // Her denemede hatayı gizle

    try {
        const response = await fetch('https://web-production-388bad.up.railway.app/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true'
            },
            body: JSON.stringify({ username: usernameInput, password: passwordInput })
        });
        
        const responseData = await response.json();
        
        if (response.ok && responseData.success) {
            // BENİ HATIRLA: İşaretliyse bilgileri kaydet, değilse sil
            if (rememberMeCheckbox.checked) {
                localStorage.setItem("rememberedUsername", usernameInput);
                localStorage.setItem("rememberedPassword", passwordInput);
            } else {
                localStorage.removeItem("rememberedUsername");
                localStorage.removeItem("rememberedPassword");
            }

            // Başarılı giriş verilerini kaydet
            localStorage.setItem('userToken', responseData.token);
            localStorage.setItem('userRole', responseData.role);
            localStorage.setItem('userCompany', responseData.companyName || '');
            localStorage.setItem('userFactories', responseData.factories || '');
            
            // YÖNLENDİRME
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
