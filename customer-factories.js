// customer-factories.js

document.addEventListener('DOMContentLoaded', () => {
    // Sadece Müşteri rolü erişebilir
    if (!requireRole(['CUSTOMER'])) return;

    loadMyFactoriesList();

    // Çıkış Yap Butonu
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = 'index.html';
        });
    }
});

// CSS stillerini sayfaya enjekte et (factories.js ile aynı tasarım)
function ensureMeterStyles() {
    if (document.getElementById('meterPanelStyles')) return;
    
    // factories.js içindeki ensureMeterStyles içeriğinin aynısını buraya ekleyebilirsin.
    // CSS değişkenleri ve yapıları tamamen aynı kalacak.
    const style = document.createElement('style');
    style.id = 'meterPanelStyles';
    style.textContent = `
        :root {
            --mv-accent: var(--accent-color, #189a5c);
            --mv-accent-bg: color-mix(in srgb, var(--accent-color) 12%, transparent);
            --mv-accent-border: color-mix(in srgb, var(--accent-color) 35%, transparent);
            --mv-bg: var(--surface-color, #17191c);
            --mv-bg-alt: var(--surface-alt-color, #1e2124);
            --mv-border: var(--border-color, #2b2f34);
            --mv-text: var(--text-primary, #edf0f2);
            --mv-text-dim: var(--text-secondary, #90979e);
            --mv-warn: var(--error-color, #ff6b5e);
            --mv-warn-bg: color-mix(in srgb, var(--error-color) 12%, transparent);
            --mv-warn-border: color-mix(in srgb, var(--error-color) 35%, transparent);
            --mv-good: var(--success-color, #35d48a);
            --mv-good-bg: color-mix(in srgb, var(--success-color) 12%, transparent);
            --mv-good-border: color-mix(in srgb, var(--success-color) 35%, transparent);
            --mv-mono: var(--font-mono, 'JetBrains Mono'), ui-monospace, 'SF Mono', 'Cascadia Mono', 'Roboto Mono', Consolas, monospace;
        }
        
        #factoryList, #factoryList *, .meter-panel, .meter-panel *, .meter-panel *::before, .meter-panel *::after { box-sizing: border-box; }
        .fl-loading, .fl-error { color: var(--mv-text-dim); font-size: 0.85rem; padding: 10px 2px; }
        .fl-error { color: var(--mv-warn); }
        .fl-item { display: flex; align-items: center; gap: 12px; padding: 13px 14px; background: var(--mv-bg-alt); border: 1px solid var(--mv-border); border-radius: 10px; cursor: pointer; margin-bottom: 10px; transition: all .15s ease; }
        .fl-item:hover { border-color: var(--mv-accent); background: var(--mv-bg); transform: translateX(2px); }
        .fl-icon { flex-shrink: 0; width: 34px; height: 34px; border-radius: 9px; display: flex; align-items: center; justify-content: center; background: var(--mv-accent-bg); color: var(--mv-accent); font-size: 13px; }
        .fl-body { min-width: 0; flex: 1 1 auto; display: flex; flex-direction: column; }
        .fl-body strong { font-size: 0.92rem; color: var(--mv-text); overflow-wrap: anywhere; }
        .fl-meta { font-size: 0.74rem; color: var(--mv-accent); margin-top: 2px; }
        .fl-chevron { color: var(--mv-text-dim); font-size: 0.8rem; flex-shrink: 0; }
        /* DİKKAT: .fl-delete sınıfı bu dosyadan tamamen çıkarıldı */
        
        /* ... MP ve MV sınıfları (sayaç detayları tasarımları) factories.js'den buraya aynen kopyalanabilir ... */
    `;
    document.head.appendChild(style);
}

// Müşteriye Özel Fabrika Listesini Çek
async function loadMyFactoriesList() {
    const list = document.getElementById('factoryList');
    ensureMeterStyles();
    list.innerHTML = '<p class="fl-loading">Tesisleriniz yükleniyor...</p>';

    try {
        // Backend'deki endpoint zaten token'a göre filtreleme yapıyor
        const res = await fetch(`${API_BASE}/factories`, { headers: authHeaders() });
        if (handleAuthFailure(res)) return;
        const data = await res.json();
        const facilities = data.factories || data || [];

        list.innerHTML = '';

        if (!facilities.length) {
            list.innerHTML = '<p class="fl-loading">Size tanımlı bir tesis bulunamadı. Lütfen yöneticinizle görüşün.</p>';
            return;
        }

        facilities.forEach(f => {
            const btn = document.createElement('div');
            btn.className = 'fl-item';
            btn.setAttribute('tabindex', '0');
            btn.setAttribute('role', 'button');
            
            // Silme butonu (fl-delete) HTML'den kaldırıldı
            btn.innerHTML = `
                <span class="fl-icon"><i class="fas fa-industry"></i></span>
                <div class="fl-body">
                    <strong>${f.name}</strong>
                    <span class="fl-meta">${f.meterCount || 0} Bağlı Sayaç</span>
                </div>
                <i class="fas fa-chevron-right fl-chevron"></i>
            `;

            btn.onclick = () => showFacilityDetails(f);
            btn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); }
            });
            
            list.appendChild(btn);
        });
    } catch (err) {
        console.error("Yükleme hatası:", err);
        list.innerHTML = '<p class="fl-error">Tesis bilgileri yüklenemedi.</p>';
    }
}

// Detayları Gösterme Fonksiyonu (factories.js'deki showDetails'in bir kopyası)
window.showFacilityDetails = function(f) {
    ensureMeterStyles();
    document.getElementById('detailTitle').innerText = f.name;
    const container = document.getElementById('meterDisplay');

    // Bu kısım factories.js içindeki showDetails fonksiyonu ile tamamen aynı kalabilir.
    // Sadece "showMeterData" fonksiyonunu çağıracak. 
    container.innerHTML = `
        <div class="meter-panel">
            <h4 class="mp-section-title"><i class="fas fa-server"></i> ANA GİRİŞ SAYACI</h4>
            <!-- ... geri kalan HTML iskeleti ... -->
        </div>
    `;
};

// showMeterData, getMeterData ve küçük yardımcı fonksiyonları (kpiCard, kvGrid vb.) 
// factories.js dosyasından alıp bu dosyanın sonuna eklemelisin.
