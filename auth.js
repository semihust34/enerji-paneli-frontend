// auth.js
// Tüm korumalı sayfalarda (admin-dashboard, factories, customer-management,
// system-logs, customer-dashboard) diğer script'lerden ÖNCE yüklenmelidir.
//
// Sağladıkları:
//  - API_BASE            : backend adresi (tek yerden yönetiliyor)
//  - getToken()           : kayıtlı JWT'yi döndürür
//  - authHeaders(extra)   : Authorization header'ını ekleyerek fetch header nesnesi üretir
//  - requireRole(roles)   : token yoksa veya rol uygun değilse index.html'e atar

const API_BASE = 'https://web-production-388bad.up.railway.app/api';

function getToken() {
    return localStorage.getItem('userToken');
}

function authHeaders(extra = {}) {
    const token = getToken();
    return {
        ...extra,
        'Authorization': token ? `Bearer ${token}` : '',
        'ngrok-skip-browser-warning': 'true'
    };
}

// Sayfa açılır açılmaz çağrılmalı. Token yoksa ya da rol izinli değilse
// kullanıcıyı giriş sayfasına yönlendirir ve false döner (çağıran taraf
// bu durumda kendi mantığını çalıştırmayı durdurmalı).
function requireRole(allowedRoles) {
    const token = getToken();
    const role = localStorage.getItem('userRole');
    if (!token || !role || !allowedRoles.includes(role)) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// Ortak "yetkisiz / oturum süresi doldu" kontrolü: backend 401 dönerse
// oturumu temizleyip login'e atar. Fetch sonrası kontrol için kullanılabilir.
function handleAuthFailure(response) {
    if (response.status === 401) {
        logout();
        return true;
    }
    return false;
}

// Sadece oturuma ait anahtarları temizler. localStorage.clear() KULLANMIYORUZ
// çünkü o, "Beni Hatırla" ile kaydedilmiş kullanıcı adı/şifreyi
// (rememberedUsername / rememberedPassword) ve tema tercihini de silip
// kullanıcıyı her çıkışta bu bilgileri kaybetmeye zorluyordu.
function logout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userCompany');
    localStorage.removeItem('userFactories');
    window.location.href = 'index.html';
}
