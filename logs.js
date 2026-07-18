// logs.js

document.addEventListener('DOMContentLoaded', () => {
    const logOutput = document.getElementById('logOutput');
    const clearBtn = document.getElementById('clearLogsBtn');

    // Örnek sistem mesajları havuzu
    const mockLogMessages = [
        "[SİSTEM] TCP Soket sunucusu 9000 portunda dinleniyor...",
        "[BİLGİ] 195.175.22.10 (Plastik Enjeksiyon A.Ş.) bağlantı kurdu.",
        "[VERİ] Gelen paket (Hex): 01 03 04 01 2C 00 00 00 00",
        "[UYARI] Demir Döküm Fabrikası - Reaktif oran sınırda! (%18)",
        "[BAŞARILI] Müşteri hesabı yetkilendirildi.",
        "[BİLGİ] 212.15.10.8 cihazından sinyal alındı, ping: 24ms.",
        "[SİSTEM] Periyodik veritabanı yedeği başarıyla alındı.",
        "[HATA] 195.175.22.44 cihazından eksik paket ulaştı. Bağlantı tekrar deneniyor..."
    ];

    // Ekrana tek bir satır log ekleme fonksiyonu
    function appendLog() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('tr-TR', { hour12: false }) + '.' + now.getMilliseconds().toString().padStart(3, '0');
        
        // Rastgele bir mesaj seç
        const randomIndex = Math.floor(Math.random() * mockLogMessages.length);
        let message = mockLogMessages[randomIndex];
        
        // Cümle içindeki anahtar kelimeye göre renk belirle
        let color = "var(--accent-color)"; // Default Turkuaz
        if (message.includes("[HATA]")) color = "var(--error-color)"; // Kırmızı
        else if (message.includes("[UYARI]")) color = "#f6e58d"; // Sarı
        else if (message.includes("[SİSTEM]")) color = "var(--text-secondary)"; // Gri
        else if (message.includes("[BAŞARILI]")) color = "#4cd137"; // Yeşil

        const logLine = document.createElement('div');
        logLine.style.marginBottom = "5px";
        logLine.innerHTML = `<span style="color: #555;">[${timeString}]</span> <span style="color: ${color};">${message}</span>`;
        
        logOutput.appendChild(logLine);

        // Terminal ekranını otomatik olarak en aşağı kaydır (Auto-scroll)
        logOutput.parentElement.scrollTop = logOutput.parentElement.scrollHeight;
    }

    // İlk açılışta terminal boş durmasın diye birkaç log yazdır
    appendLog();
    setTimeout(appendLog, 500);
    setTimeout(appendLog, 1200);

    // Her 2 ila 4 saniye arasında rastgele bir zamanla yeni log düşür
    setInterval(() => {
        appendLog();
    }, Math.floor(Math.random() * 2000) + 2000);

    // Temizle Butonu
    clearBtn.addEventListener('click', () => {
        logOutput.innerHTML = '<div style="color: #555; margin-bottom: 10px;">--- Log Ekranı Temizlendi ---</div>';
    });

    // Çıkış Yap Butonu
    document.getElementById('logoutBtn').addEventListener('click', () => {
        window.location.href = 'index.html';
    });
});