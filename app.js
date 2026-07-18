// app.js
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;
    const errorDiv = document.getElementById('errorMessage');
    
    errorDiv.classList.add('hidden');

    try {
        // Gerçek API'ye POST isteği atıyoruz
        const response = await fetch('http://127.0.0.1:5000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: usernameInput, password: passwordInput })
        });
        
        const responseData = await response.json();
        
        if (response.ok && responseData.success) {
            localStorage.setItem('userToken', responseData.token);
            localStorage.setItem('userRole', responseData.role);
            
            if (responseData.role === 'ADMIN') {
                window.location.href = 'admin-dashboard.html';
            } else {
                window.location.href = 'customer-dashboard.html';
            }
        } else {
            errorDiv.textContent = responseData.message || "Giriş başarısız.";
            errorDiv.classList.remove('hidden');
        }
    } catch (error) {
        errorDiv.textContent = "Sunucuya bağlanılamadı. Python sunucusunun çalıştığından emin ol!";
        errorDiv.classList.remove('hidden');
    }
});