window.showMeterData = function(meterName, factoryName) {
    const panel = document.getElementById('meterDataPanel');
    
    // Yardımcı fonksiyon: Satır oluşturma
    const createRow = (label, value) => `
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #333; padding: 8px 0;">
            <span style="color: var(--text-secondary);">${label}</span>
            <span style="font-weight: 500;">${value}</span>
        </div>
    `;

    panel.innerHTML = `
        <h3 style="margin-bottom: 20px; border-bottom: 2px solid var(--accent-color); padding-bottom: 10px;">
            ${factoryName} - ${meterName} Detaylı Raporu
        </h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            
            <!-- 1. Abone Bilgileri -->
            <div style="background: #1e1e1e; padding: 15px; border-radius: 8px; border: 1px solid #333;">
                <h4 style="margin-bottom: 10px;"><i class="fas fa-user"></i> Abone Bilgileri</h4>
                ${createRow('Abone Ad', 'ESAN AKÜMÜLATÖR...')}
                ${createRow('Abone No', '10000400158')}
                ${createRow('Sayaç SeriNo', '50672742')}
                ${createRow('Sözleşme Gücü', '240,00 kW')}
                ${createRow('Kalan Süre', '0 gün')}
            </div>

            <!-- 2. Endeks Bilgileri -->
            <div style="background: #1e1e1e; padding: 15px; border-radius: 8px; border: 1px solid #333;">
                <h4 style="margin-bottom: 10px;"><i class="fas fa-list"></i> Endeks Bilgileri</h4>
                ${createRow('Aktif Enerji (1.8.0)', '828.776 - 931.602')}
                ${createRow('Gündüz (1.8.1)', '404.792 - 456.589')}
                ${createRow('Puant (1.8.2)', '161.864 - 181.16')}
                ${createRow('Gece (1.8.3)', '262.122 - 293.853')}
                ${createRow('End. Reak. En. (5.8.0)', '32.931 - 34.957')}
            </div>

            <!-- 3. Ceza Durumu -->
            <div style="background: #1e1e1e; padding: 15px; border-radius: 8px; border: 1px solid #333;">
                <h4 style="margin-bottom: 10px;"><i class="fas fa-exclamation-triangle"></i> Ceza Durumu</h4>
                ${createRow('Endüktif Oran (%20)', '1,97')}
                ${createRow('Kapasitif Oran (%15)', '3,85')}
                ${createRow('Aşıldı mı?', 'Evet')}
                ${createRow('Aşım Miktarı', '180,00')}
            </div>

            <!-- 4. Tüketim Bilgileri -->
            <div style="background: #1e1e1e; padding: 15px; border-radius: 8px; border: 1px solid #333;">
                <h4 style="margin-bottom: 10px;"><i class="fas fa-bolt"></i> Tüketim Bilgileri</h4>
                ${createRow('Aktif Enerji (1.8.0)', '102.826,00')}
                ${createRow('Gündüz (1.8.1)', '51.797,00')}
                ${createRow('Puant (1.8.2)', '19.296,00')}
                ${createRow('Gece (1.8.3)', '31.733,00')}
                ${createRow('Demand (1.6.0)', '420,00')}
            </div>
        </div>
    `;
    panel.scrollIntoView({ behavior: 'smooth' });
};
