document.addEventListener('DOMContentLoaded', () => {
    console.log("Panel başlatılıyor...");
    loadFactories();
});

async function loadFactories() {
    const list = document.getElementById('factoryList');
    list.innerHTML = '<p>Yükleniyor...</p>';

    try {
        const res = await fetch('https://web-production-388bad.up.railway.app/api/factories');
        
        if (!res.ok) {
            throw new Error(`HTTP hatası! Durum: ${res.status}`);
        }

        const data = await res.json();
        console.log("Backend'den gelen ham veri:", data); // KONSOLDAN BURAYA BAK!

        // Veri yapısını kontrol et: "factories" anahtarı var mı?
        const factories = data.factories || [];
        
        list.innerHTML = ''; 
        
        if (factories.length === 0) {
            list.innerHTML = '<p>Henüz tanımlı fabrika bulunamadı.</p>';
            return;
        }
        
        factories.forEach(f => {
            const btn = document.createElement('div');
            btn.style.cssText = "padding: 15px; background: #1e1e1e; border: 1px solid #333; border-radius: 6px; cursor: pointer; margin-bottom: 10px;";
            btn.innerHTML = `<strong>${f.name}</strong><br><small style="color: var(--accent-color)">${f.meterCount || 0} Sayaç</small>`;
            btn.onclick = () => showDetails(f);
            list.appendChild(btn);
        });
    } catch (err) {
        console.error("Yükleme sırasında hata oluştu:", err);
        list.innerHTML = '<p style="color: red;">Fabrikalar yüklenemedi. Konsolu kontrol et.</p>';
    }
}
