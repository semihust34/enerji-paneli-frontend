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

// ---------------------------------------------------------------------
// Sayaç detay verileri
// Not: Şu an tüm sayaçlar için sabit örnek veri gösteriliyor.
// Gerçek API bağlandığında burası meterName/factoryName'e göre
// fetch edilen veriyle değiştirilebilir.
// ---------------------------------------------------------------------
function getMeterData(meterName, factoryName) {
    return {
        abone: {
            "Abone Ad": "ESAN AKÜMÜLATÖR MALZEME SAN.VE.TİC.AŞ",
            "Abone No": "10000400158",
            "Sayaç Seri No": "50672742",
            "Sayaç Tanım": "50672742",
            "Abone Tip": "-",
            "Sözleşme Gücü": "240,00 kW",
            "Çarpan": "1000",
            "Etso Kod": "-",
            "Ölçüm Noktası Id": "-",
            "Eposta": "esan.duyuru@esanaku.com",
            "Abo. Bas. Tarih": "23.09.2020",
            "San.Sic.Bel.Tarih": "17.08.2020",
            "San.Sic.Bel.Bitiş": "17.08.2022",
            "Kalan Süre": "0 gün"
        },
        endeks: {
            header: ["", "İlk Endeks", "Son Endeks"],
            rows: [
                ["Okuma Zamanı", "01.07.2026 00:00:00", "19.07.2026 03:06:36"],
                ["Aktif Enerji (kW) (1.8.0)", "828.776", "931.602"],
                ["Gündüz (kW) (1.8.1)", "404.792", "456.589"],
                ["Puant (kW) (1.8.2)", "161.864", "181.16"],
                ["Gece (kW) (1.8.3)", "262.12", "293.853"],
                ["End. Reak. En. (kVARh) (5.8.0)", "32.931", "34.957"],
                ["Kap. Reak. En. (kVARh) (8.8.0)", "84.987", "88.941"],
                ["Maks. Demand (kW) (1.6.0)", "0.425", "0.42"]
            ],
            note: "* Burada görüntülenen değerler sayaç üzerinde görülen çarpansız değerlerdir."
        },
        ceza: {
            alinanEnerji: {
                "Aktif Enerji": "102,83",
                "End. Reak. Enerji": "2,03",
                "Kap. Reak. Enerji": "3,95"
            },
            reaktifCeza: {
                "Endüktif Oran (% 20)": "1,97",
                "Kapasitif Oran (% 15)": "3,85",
                "Kapasitif (Üretim) (% 20)": "0,00"
            },
            sozlesmeGucu: {
                "Aşıldı mı?": "Evet",
                "Aşım miktarı": "180,00"
            }
        },
        tuketim: {
            "Son Okuma Zamanı": "19.07.2026 03:06:36",
            "Aktif Enerji (1.8.0)": "102.826,00",
            "Gündüz (1.8.1)": "51.797,00",
            "Puant (1.8.2)": "19.296,00",
            "Gece (1.8.3)": "31.733,00",
            "End. Reak. En. (5.8.0)": "2.026,00",
            "Kap. Reak. En. (8.8.0)": "3.954,00",
            "Maks. Demand (1.6.0)": "420,00",
            note: "* Burada görüntülenen değerler sayaç çarpanı ile çarpılmış değerlerdir."
        }
    };
}

function buildKVTable(dataObj) {
    let rows = '';
    for (const [label, value] of Object.entries(dataObj)) {
        if (label === 'note') continue;
        rows += `
            <tr>
                <td class="mv-label">${label}</td>
                <td class="mv-value">${value}</td>
            </tr>`;
    }
    return `<table class="mv-table"><tbody>${rows}</tbody></table>`;
}

window.showMeterData = function(meterName, factoryName) {
    const panel = document.getElementById('meterDataPanel');
    const d = getMeterData(meterName, factoryName);

    // Endeks tablosu (iki sütunlu: ilk / son)
    let endeksRows = '';
    d.endeks.rows.forEach(([label, ilk, son]) => {
        endeksRows += `
            <tr>
                <td class="mv-label">${label}</td>
                <td class="mv-value">${ilk}</td>
                <td class="mv-value">${son}</td>
            </tr>`;
    });
    const endeksTable = `
        <table class="mv-table">
            <thead>
                <tr>
                    <th></th>
                    <th>İlk Endeks</th>
                    <th>Son Endeks</th>
                </tr>
            </thead>
            <tbody>${endeksRows}</tbody>
        </table>`;

    panel.innerHTML = `
        <style>
            .mv-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 2px solid var(--accent-color);
                padding-bottom: 12px;
                margin-bottom: 25px;
            }
            .mv-header h3 { margin: 0; font-size: 1.25rem; }
            .mv-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin-bottom: 20px;
            }
            @media (max-width: 900px) {
                .mv-grid { grid-template-columns: 1fr; }
            }
            .mv-card {
                background: #1e1e1e;
                border: 1px solid #333;
                border-radius: 10px;
                padding: 18px 20px;
                overflow: hidden;
            }
            .mv-card.full { grid-column: 1 / -1; }
            .mv-card h4 {
                margin: 0 0 14px 0;
                font-size: 0.95rem;
                color: var(--accent-color);
                display: flex;
                align-items: center;
                gap: 8px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .mv-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 0.92rem;
            }
            .mv-table th {
                text-align: right;
                color: var(--text-secondary, #999);
                font-weight: 600;
                padding: 6px 8px;
                border-bottom: 1px solid #333;
                font-size: 0.85rem;
            }
            .mv-table th:first-child { text-align: left; }
            .mv-table td {
                padding: 8px 8px;
                border-bottom: 1px solid #2a2a2a;
            }
            .mv-table tr:last-child td { border-bottom: none; }
            .mv-label {
                color: var(--text-secondary, #999);
                white-space: nowrap;
            }
            .mv-value {
                font-weight: 600;
                text-align: right;
                color: #fff;
            }
            .mv-note {
                margin-top: 10px;
                font-size: 0.78rem;
                color: var(--text-secondary, #888);
                font-style: italic;
            }
            .mv-subgrid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 16px;
            }
            @media (max-width: 700px) {
                .mv-subgrid { grid-template-columns: 1fr; }
            }
            .mv-subblock h5 {
                margin: 0 0 8px 0;
                font-size: 0.82rem;
                color: var(--text-secondary, #999);
                font-weight: 600;
            }
            .mv-status-yes {
                color: #ff5252;
                font-weight: 700;
            }
        </style>

        <div class="mv-header">
            <h3><i class="fas fa-bolt"></i> ${factoryName} — ${meterName} Detay Paneli</h3>
            <span class="badge success">Aktif</span>
        </div>

        <div class="mv-grid">
            <div class="mv-card">
                <h4><i class="fas fa-id-card"></i> Abone Bilgileri</h4>
                ${buildKVTable(d.abone)}
            </div>

            <div class="mv-card">
                <h4><i class="fas fa-tachometer-alt"></i> Endeks Bilgileri</h4>
                ${endeksTable}
                <div class="mv-note">${d.endeks.note}</div>
            </div>

            <div class="mv-card full">
                <h4><i class="fas fa-exclamation-triangle"></i> Ceza Durumu</h4>
                <div class="mv-subgrid">
                    <div class="mv-subblock">
                        <h5>Alınan Enerji</h5>
                        ${buildKVTable(d.ceza.alinanEnerji)}
                    </div>
                    <div class="mv-subblock">
                        <h5>Reaktif Ceza</h5>
                        ${buildKVTable(d.ceza.reaktifCeza)}
                    </div>
                    <div class="mv-subblock">
                        <h5>Sözleşme Gücü Aşımı</h5>
                        <table class="mv-table"><tbody>
                            <tr><td class="mv-label">Aşıldı mı?</td><td class="mv-value mv-status-yes">${d.ceza.sozlesmeGucu["Aşıldı mı?"]}</td></tr>
                            <tr><td class="mv-label">Aşım miktarı</td><td class="mv-value">${d.ceza.sozlesmeGucu["Aşım miktarı"]}</td></tr>
                        </tbody></table>
                    </div>
                </div>
            </div>

            <div class="mv-card full">
                <h4><i class="fas fa-chart-line"></i> Tüketim Bilgileri</h4>
                ${buildKVTable(d.tuketim)}
                <div class="mv-note">${d.tuketim.note}</div>
            </div>
        </div>
    `;
    panel.scrollIntoView({ behavior: 'smooth' });
};

async function handleFormSubmit(e) {
    e.preventDefault();
    // ... (form gönderme mantığı öncekiyle aynı)
}
