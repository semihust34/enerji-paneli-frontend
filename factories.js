document.addEventListener('DOMContentLoaded', () => {
    console.log("Panel başlatılıyor...");
    loadFactories();

    // Modal işlemleri
    const addModal = document.getElementById('addFactoryModal');
    if (addModal) {
        document.getElementById('openFactoryModalBtn').addEventListener('click', () => addModal.classList.remove('hidden'));
        document.getElementById('closeModalBtn').addEventListener('click', () => addModal.classList.add('hidden'));
    }

    // Form gönderimi
    document.getElementById('newFactoryForm').addEventListener('submit', handleFormSubmit);
});

async function loadFactories() {
    const list = document.getElementById('factoryList');
    list.innerHTML = 'Yükleniyor...';

    try {
        const res = await fetch('https://web-production-388bad.up.railway.app/api/factories');
        const data = await res.json();
        
        // Veri yapısı kontrolü: Railway bazen "factories" bazen direkt liste dönebilir
        const factories = data.factories || data || [];
        
        list.innerHTML = '';
        factories.forEach(f => {
            const btn = document.createElement('div');
            btn.style.cssText = "padding: 15px; background: #1e1e1e; border: 1px solid #333; border-radius: 6px; cursor: pointer; margin-bottom: 10px;";
            btn.innerHTML = `<strong>${f.name}</strong><br><small style="color: var(--accent-color)">${f.meterCount || 0} Sayaç</small>`;
            
            // Fonksiyonu burada doğrudan çağırıyoruz
            btn.onclick = () => showDetails(f);
            list.appendChild(btn);
        });
    } catch (err) {
        console.error("Yükleme hatası:", err);
        list.innerHTML = 'Fabrikalar yüklenemedi.';
    }
}

// showDetails artık global olarak tanımlı, sorunsuz çalışmalı
window.showDetails = function(f) {
    document.getElementById('detailTitle').innerText = f.name;
    const container = document.getElementById('meterDisplay');
    
    container.innerHTML = `
        <h4 style="margin-bottom: 15px;"><i class="fas fa-server"></i> ANA GİRİŞ SAYACI</h4>
        <div onclick="showMeterData('ANA SAYAÇ', '${f.name}')" 
             style="background: #00adb522; padding: 15px; border-radius: 6px; border: 1px solid var(--accent-color); cursor: pointer; margin-bottom: 30px;">
            <div style="display: flex; justify-content: space-between;">
                <span><strong>${f.name} - Ana Giriş</strong></span>
                <span class="badge success">Aktif</span>
            </div>
        </div>
        
        <h4>Alt Sayaçlar (${f.meterCount || 0} Adet)</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px; margin-top: 15px;" id="subMetersGrid"></div>
        <div id="meterDataPanel" style="margin-top: 40px;"></div>
    `;

    const grid = document.getElementById('subMetersGrid');
    for(let i = 1; i <= (f.meterCount || 0); i++) {
        const div = document.createElement('div');
        div.style.cssText = "background: #2c2c2c; padding: 12px; border-radius: 4px; text-align: center; border: 1px solid #444; cursor: pointer;";
        div.innerHTML = `<i class="fas fa-microchip"></i><br><small>Sayaç #${i}</small>`;
        div.onclick = () => showMeterData(`Sayaç #${i}`, f.name);
        grid.appendChild(div);
    }
};

window.showMeterData = function(meterName, factoryName) {
    const panel = document.getElementById('meterDataPanel');
    const createRow = (label, value) => `
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #333; padding: 8px 0;">
            <span style="color: var(--text-secondary);">${label}</span>
            <span style="font-weight: 500;">${value}</span>
        </div>
    `;

    panel.innerHTML = `
        <h3 style="margin-bottom: 20px; border-bottom: 2px solid var(--accent-color); padding-bottom: 10px;">${factoryName} - ${meterName} Detay Paneli</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div style="background: #1e1e1e; padding: 15px; border-radius: 8px; border: 1px solid #333;">
                <h4>Abone Bilgileri</h4>
                ${createRow('Abone Ad', 'ESAN AKÜMÜLATÖR...')}
                ${createRow('Sözleşme Gücü', '240,00 kW')}
            </div>
            <div style="background: #1e1e1e; padding: 15px; border-radius: 8px; border: 1px solid #333;">
                <h4>Endeks Bilgileri</h4>
                ${createRow('Aktif Enerji', '828.776 - 931.602')}
                ${createRow('Puant', '161.864 - 181.16')}
            </div>
        </div>
    `;
    panel.scrollIntoView({ behavior: 'smooth' });
};

async function handleFormSubmit(e) {
    e.preventDefault();
    // ... (form gönderme mantığı öncekiyle aynı)
}
