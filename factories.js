document.addEventListener('DOMContentLoaded', () => {
    if (!requireRole(['ADMIN', 'SUPERADMIN'])) return;

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

// ---------------------------------------------------------------------
// Ortak stil enjeksiyonu — sayfaya sadece bir kez eklenir (tekrar tekrar
// render edildiğinde <style> birikmesin diye id kontrolü yapılıyor).
// ---------------------------------------------------------------------
function ensureMeterStyles() {
    if (document.getElementById('meterPanelStyles')) return;

    const style = document.createElement('style');
    style.id = 'meterPanelStyles';
    style.textContent = `
        :root {
            --mv-accent: var(--accent-color, #00adb5);
            --mv-accent-bg: rgba(0, 173, 181, 0.12);
            --mv-accent-border: rgba(0, 173, 181, 0.35);
            --mv-bg: #17191c;
            --mv-bg-alt: #1e2124;
            --mv-border: #2b2f34;
            --mv-text: #edf0f2;
            --mv-text-dim: var(--text-secondary, #90979e);
            --mv-warn: #ff6b5e;
            --mv-warn-bg: rgba(255, 107, 94, 0.12);
            --mv-warn-border: rgba(255, 107, 94, 0.35);
            --mv-good: #35d48a;
            --mv-good-bg: rgba(53, 212, 138, 0.12);
            --mv-good-border: rgba(53, 212, 138, 0.35);
            --mv-mono: ui-monospace, 'SF Mono', 'Cascadia Mono', 'Roboto Mono', Consolas, monospace;
        }

        /* Taşmaları önlemek için: tüm kutular kendi padding'ini genişlik içine alsın */
        #factoryList, #factoryList *,
        .meter-panel, .meter-panel *, .meter-panel *::before, .meter-panel *::after {
            box-sizing: border-box;
        }

        /* ---------- Fabrika listesi ---------- */
        .fl-loading, .fl-error { color: var(--mv-text-dim); font-size: 0.85rem; padding: 10px 2px; }
        .fl-error { color: var(--mv-warn); }
        .fl-item {
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 0;
            padding: 13px 14px;
            background: var(--mv-bg-alt);
            border: 1px solid var(--mv-border);
            border-radius: 10px;
            cursor: pointer;
            margin-bottom: 10px;
            transition: border-color .15s ease, transform .15s ease, background .15s ease;
        }
        .fl-item:hover { border-color: var(--mv-accent); background: var(--mv-bg); transform: translateX(2px); }
        .fl-item:focus-visible { outline: 2px solid var(--mv-accent); outline-offset: 2px; }
        .fl-icon {
            flex-shrink: 0;
            width: 34px; height: 34px;
            border-radius: 9px;
            display: flex; align-items: center; justify-content: center;
            background: var(--mv-accent-bg);
            color: var(--mv-accent);
            font-size: 13px;
        }
        .fl-body { min-width: 0; flex: 1 1 auto; display: flex; flex-direction: column; }
        .fl-body strong { font-size: 0.92rem; color: var(--mv-text); overflow-wrap: anywhere; }
        .fl-meta { font-size: 0.74rem; color: var(--mv-accent); margin-top: 2px; }
        .fl-chevron { color: var(--mv-text-dim); font-size: 0.8rem; flex-shrink: 0; }
        .fl-delete {
            flex-shrink: 0;
            width: 30px; height: 30px;
            border-radius: 8px;
            border: 1px solid transparent;
            background: transparent;
            color: var(--mv-text-dim);
            display: flex; align-items: center; justify-content: center;
            cursor: pointer;
            transition: background .15s ease, color .15s ease, border-color .15s ease;
        }
        .fl-delete:hover { background: var(--mv-warn-bg); border-color: var(--mv-warn-border); color: var(--mv-warn); }
        .fl-delete:focus-visible { outline: 2px solid var(--mv-warn); outline-offset: 2px; }

        /* ---------- Paylaşılan bileşenler (rozet, ikon rozeti) ---------- */
        .meter-panel .badge {
            display: inline-flex;
            align-items: center;
            padding: 3px 10px;
            border-radius: 20px;
            font-size: 0.72rem;
            font-weight: 700;
            letter-spacing: 0.3px;
            white-space: nowrap;
        }
        .meter-panel .badge.warning { background: var(--mv-warn-bg); color: var(--mv-warn); border: 1px solid var(--mv-warn-border); }
        .meter-panel .badge.good { background: var(--mv-good-bg); color: var(--mv-good); border: 1px solid var(--mv-good-border); }

        .meter-panel .icon-badge {
            flex-shrink: 0;
            width: 36px; height: 36px;
            border-radius: 10px;
            display: flex; align-items: center; justify-content: center;
            background: var(--mv-accent-bg);
            color: var(--mv-accent);
            font-size: 14px;
        }
        .meter-panel .icon-badge.lg { width: 44px; height: 44px; font-size: 17px; }
        .meter-panel .icon-badge.warn { background: var(--mv-warn-bg); color: var(--mv-warn); }

        /* ---------- Ana giriş sayacı & alt sayaç kutuları ---------- */
        .mp-section-title {
            display: flex; align-items: center; gap: 8px;
            font-size: 0.8rem; letter-spacing: 0.4px;
            color: var(--mv-text-dim); font-weight: 600;
            margin: 0 0 14px 0;
        }
        .mp-section-title i { color: var(--mv-accent); }

        .mp-ana {
            display: flex; align-items: center; justify-content: space-between; gap: 14px;
            min-width: 0;
            background: var(--mv-accent-bg);
            border: 1px solid var(--mv-accent-border);
            border-radius: 12px;
            padding: 16px 18px;
            cursor: pointer;
            margin-bottom: 28px;
            transition: background .15s ease, transform .15s ease;
        }
        .mp-ana:hover { background: rgba(0, 173, 181, 0.18); transform: translateY(-1px); }
        .mp-ana:focus-visible { outline: 2px solid var(--mv-accent); outline-offset: 2px; }
        .mp-ana-left { display: flex; align-items: center; gap: 12px; min-width: 0; }
        .mp-ana-left strong { font-size: 1rem; color: var(--mv-text); overflow-wrap: anywhere; }
        .mp-ana-tag { display: block; font-size: 0.75rem; color: var(--mv-text-dim); margin-top: 2px; }

        .mp-tiles {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: 10px;
            margin-top: 14px;
        }
        .mp-tile {
            min-width: 0;
            background: var(--mv-bg-alt);
            border: 1px solid var(--mv-border);
            border-radius: 10px;
            padding: 14px 10px;
            text-align: center;
            cursor: pointer;
            transition: border-color .15s ease, transform .15s ease, background .15s ease;
        }
        .mp-tile:hover { border-color: var(--mv-accent); background: var(--mv-bg); transform: translateY(-2px); }
        .mp-tile:focus-visible { outline: 2px solid var(--mv-accent); outline-offset: 2px; }
        .mp-tile i { color: var(--mv-accent); font-size: 1.1rem; }
        .mp-tile small { display: block; margin-top: 6px; color: var(--mv-text-dim); font-size: 0.75rem; overflow-wrap: anywhere; }

        /* ---------- Sayaç detay paneli ---------- */
        .mv-panel { animation: mvFadeIn .35s ease both; }
        @keyframes mvFadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: none; }
        }
        @media (prefers-reduced-motion: reduce) {
            .mv-panel { animation: none; }
        }

        .mv-datapanel { margin-top: 36px; }

        .mv-header {
            display: flex; align-items: flex-start; justify-content: space-between;
            flex-wrap: wrap; gap: 12px;
            padding-bottom: 16px; margin-bottom: 20px;
            border-bottom: 1px solid var(--mv-border);
        }
        .mv-header-left { display: flex; align-items: center; gap: 12px; min-width: 0; }
        .mv-header-left h3 { margin: 0; font-size: 1.15rem; color: var(--mv-text); overflow-wrap: anywhere; }
        .mv-header-sep { color: var(--mv-text-dim); margin: 0 2px; }
        .mv-header-sub { margin: 2px 0 0; font-size: 0.8rem; color: var(--mv-text-dim); }
        .mv-header-right { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; }
        .mv-header-updated { font-size: 0.75rem; color: var(--mv-text-dim); font-family: var(--mv-mono); white-space: nowrap; }

        .mv-kpis { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 24px; }
        .mv-kpi {
            flex: 1 1 190px; min-width: 0;
            display: flex; align-items: center; gap: 12px;
            background: var(--mv-bg-alt);
            border: 1px solid var(--mv-border);
            border-radius: 12px;
            padding: 14px 16px;
        }
        .mv-kpi.warn { background: var(--mv-warn-bg); border-color: var(--mv-warn-border); }
        .mv-kpi.good { background: var(--mv-good-bg); border-color: var(--mv-good-border); }
        .mv-kpi-icon {
            flex-shrink: 0; width: 38px; height: 38px; border-radius: 10px;
            display: flex; align-items: center; justify-content: center;
            background: rgba(255,255,255,0.06);
            color: var(--mv-accent); font-size: 15px;
        }
        .mv-kpi.warn .mv-kpi-icon { color: var(--mv-warn); }
        .mv-kpi.good .mv-kpi-icon { color: var(--mv-good); }
        .mv-kpi-body { min-width: 0; display: flex; flex-direction: column; }
        .mv-kpi-label { font-size: 0.72rem; color: var(--mv-text-dim); letter-spacing: 0.3px; }
        .mv-kpi-value {
            font-family: var(--mv-mono); font-variant-numeric: tabular-nums;
            font-size: 1.05rem; font-weight: 700; color: var(--mv-text);
            overflow-wrap: anywhere;
        }
        .mv-kpi.warn .mv-kpi-value { color: var(--mv-warn); }
        .mv-kpi.good .mv-kpi-value { color: var(--mv-good); }
        .mv-kpi-sub { font-size: 0.7rem; color: var(--mv-text-dim); margin-top: 1px; overflow-wrap: anywhere; }

        .mv-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 18px; }
        .mv-card {
            min-width: 0;
            background: var(--mv-bg-alt);
            border: 1px solid var(--mv-border);
            border-left: 3px solid var(--mv-accent);
            border-radius: 14px;
            padding: 18px 20px;
        }
        .mv-card.warn { border-left-color: var(--mv-warn); }
        .mv-card.full { grid-column: 1 / -1; }
        .mv-card-head { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; }
        .mv-card-head h4 {
            margin: 0; font-size: 0.85rem; letter-spacing: 0.3px;
            color: var(--mv-text); font-weight: 700; flex: 1 1 auto; min-width: 0;
        }

        .kv-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); column-gap: 22px; }
        .kv-grid-compare { grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); }
        .kv-row {
            display: flex; align-items: baseline; justify-content: space-between; gap: 12px;
            min-width: 0; padding: 8px 0; border-bottom: 1px solid var(--mv-border);
        }
        .kv-label { min-width: 0; color: var(--mv-text-dim); font-size: 0.85rem; overflow-wrap: anywhere; }
        .kv-value {
            min-width: 0; color: var(--mv-text); font-weight: 600;
            font-family: var(--mv-mono); font-variant-numeric: tabular-nums;
            text-align: right; overflow-wrap: anywhere;
        }
        .kv-compare .kv-value { display: flex; align-items: baseline; gap: 6px; flex-wrap: wrap; justify-content: flex-end; }
        .kv-old { color: var(--mv-text-dim); font-weight: 500; font-size: 0.85em; }
        .kv-arrow { color: var(--mv-text-dim); font-size: 0.7em; }
        .kv-new { color: var(--mv-text); font-weight: 700; }

        .mv-note { margin: 12px 0 0; font-size: 0.75rem; color: var(--mv-text-dim); font-style: italic; }

        .mv-subgrid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
        .mv-subblock {
            min-width: 0;
            background: var(--mv-bg);
            border: 1px solid var(--mv-border);
            border-radius: 10px;
            padding: 14px 16px;
        }
        .mv-subblock.warn { border-color: var(--mv-warn-border); background: var(--mv-warn-bg); }
        .mv-subblock h5 { margin: 0 0 8px; font-size: 0.75rem; letter-spacing: 0.3px; color: var(--mv-text-dim); font-weight: 700; }
        .mv-subblock .kv-grid { grid-template-columns: 1fr; }

        @media (max-width: 480px) {
            .mv-header-right { align-items: flex-start; }
        }
    `;
    document.head.appendChild(style);
}

async function loadFactories() {
    const list = document.getElementById('factoryList');
    ensureMeterStyles();
    list.innerHTML = '<p class="fl-loading">Yükleniyor...</p>';

    try {
        const res = await fetch(`${API_BASE}/factories`, { headers: authHeaders() });
        if (handleAuthFailure(res)) return;
        const data = await res.json();

        // Veri yapısı kontrolü: Railway bazen "factories" bazen direkt liste dönebilir
        const factories = data.factories || data || [];

        list.innerHTML = '';

        if (!factories.length) {
            list.innerHTML = '<p class="fl-loading">Henüz kayıtlı fabrika yok. "Yeni Fabrika" ile ekleyebilirsiniz.</p>';
            return;
        }

        factories.forEach(f => {
            const btn = document.createElement('div');
            btn.className = 'fl-item';
            btn.setAttribute('tabindex', '0');
            btn.setAttribute('role', 'button');
            btn.innerHTML = `
                <span class="fl-icon"><i class="fas fa-industry"></i></span>
                <div class="fl-body">
                    <strong>${f.name}</strong>
                    <span class="fl-meta">${f.meterCount || 0} Sayaç</span>
                </div>
                <button type="button" class="fl-delete" title="Fabrikayı Sil" aria-label="Fabrikayı Sil">
                    <i class="fas fa-trash"></i>
                </button>
                <i class="fas fa-chevron-right fl-chevron"></i>
            `;

            // Fonksiyonu burada doğrudan çağırıyoruz
            btn.onclick = () => showDetails(f);
            btn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); }
            });
            btn.querySelector('.fl-delete').addEventListener('click', (evt) => deleteFactory(f.id, f.name, evt));
            list.appendChild(btn);
        });
    } catch (err) {
        console.error("Yükleme hatası:", err);
        list.innerHTML = '<p class="fl-error">Fabrikalar yüklenemedi.</p>';
    }
}

// ---------------------------------------------------------------------
// Fabrika silme
// ---------------------------------------------------------------------
window.deleteFactory = async function (factoryId, factoryName, evt) {
    if (evt) evt.stopPropagation(); // fl-item'ın kendi tıklama olayını tetiklemesin

    if (!confirm(`"${factoryName}" fabrikasını kalıcı olarak silmek istediğinize emin misiniz?`)) return;

    try {
        const res = await fetch(`${API_BASE}/factories/${factoryId}`, {
            method: 'DELETE',
            headers: authHeaders()
        });
        if (handleAuthFailure(res)) return;
        const result = await res.json();

        if (res.ok && result.success) {
            // Silinen fabrika o an açık detay panelindeyse temizle
            const detailTitle = document.getElementById('detailTitle');
            if (detailTitle && detailTitle.innerText === factoryName) {
                detailTitle.innerText = 'Bir fabrika seçin';
                document.getElementById('meterDisplay').innerHTML = `
                    <div class="fp-empty-state">
                        <i class="fas fa-hand-pointer"></i>
                        <p>Detayları görüntülemek için soldaki listeden bir fabrika seçin.</p>
                    </div>`;
            }
            await loadFactories();
        } else {
            alert('Hata: ' + (result.message || 'Fabrika silinemedi.'));
        }
    } catch (err) {
        alert('Bağlantı hatası. Sunucuya ulaşılamadı.');
    }
};

// showDetails artık global olarak tanımlı, sorunsuz çalışmalı
window.showDetails = function(f) {
    ensureMeterStyles();
    document.getElementById('detailTitle').innerText = f.name;
    const container = document.getElementById('meterDisplay');

    container.innerHTML = `
        <div class="meter-panel">
            <h4 class="mp-section-title"><i class="fas fa-server"></i> ANA GİRİŞ SAYACI</h4>
            <div class="mp-ana" tabindex="0" role="button"
                 onclick="showMeterData('ANA SAYAÇ', '${f.name}')"
                 onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault(); showMeterData('ANA SAYAÇ','${f.name}')}">
                <div class="mp-ana-left">
                    <span class="icon-badge lg"><i class="fas fa-bolt"></i></span>
                    <div>
                        <strong>${f.name} - Ana Giriş</strong>
                        <span class="mp-ana-tag">Toplam tüketim ölçüm noktası</span>
                    </div>
                </div>
                <span class="badge success">Aktif</span>
            </div>

            <h4 class="mp-section-title"><i class="fas fa-microchip"></i> Alt Sayaçlar (${f.meterCount || 0} Adet)</h4>
            <div class="mp-tiles" id="subMetersGrid"></div>
            <div class="mv-datapanel" id="meterDataPanel"></div>
        </div>
    `;

    const grid = document.getElementById('subMetersGrid');
    for (let i = 1; i <= (f.meterCount || 0); i++) {
        const div = document.createElement('div');
        div.className = 'mp-tile';
        div.setAttribute('tabindex', '0');
        div.setAttribute('role', 'button');
        div.innerHTML = `<i class="fas fa-microchip"></i><br><small>Sayaç #${i}</small>`;
        div.onclick = () => showMeterData(`Sayaç #${i}`, f.name);
        div.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); div.click(); }
        });
        grid.appendChild(div);
    }
};

// ---------------------------------------------------------------------
// Sayaç detay verileri
// Not: Şu an tüm sayaçlar için sabit örnek veri gösteriliyor.
// Gerçek API bağlandığında burası meterName/factoryName'e göre
// fetch edilen veriyle değiştirilebilir; alt taraftaki render kodu
// aynı kalabilir.
// ---------------------------------------------------------------------
function getMeterData(meterName, factoryName) {
    return {
        abone: {
            "Abone Ad": "x",
            "Abone No": "10000400158",
            "Sayaç Seri No": "50672742",
            "Sayaç Tanım": "50672742",
            "Abone Tip": "-",
            "Sözleşme Gücü": "240,00 kW",
            "Çarpan": "1000",
            "Etso Kod": "-",
            "Ölçüm Noktası Id": "-",
            "Eposta": "x",
            "Abo. Bas. Tarih": "23.09.2020",
            "San.Sic.Bel.Tarih": "17.08.2020",
            "San.Sic.Bel.Bitiş": "17.08.2022",
            "Kalan Süre": "0 gün"
        },
        endeks: {
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
                "Endüktif Oran (%20)": "1,97",
                "Kapasitif Oran (%15)": "3,85",
                "Kapasitif Üretim (%20)": "0,00"
            },
            sozlesmeGucu: {
                asildiMi: "Evet",
                asimMiktari: "180,00"
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

// ---------------------------------------------------------------------
// Küçük render yardımcıları (hepsi flex tabanlı — dar kartlarda bile
// taşma yapmaz, tablo genişlik hesaplama tuhaflıklarına takılmaz)
// ---------------------------------------------------------------------
function kvRow(label, value) {
    return `
        <div class="kv-row">
            <span class="kv-label">${label}</span>
            <span class="kv-value">${value}</span>
        </div>`;
}

function kvGrid(dataObj, extraClass = '') {
    let rows = '';
    for (const [label, value] of Object.entries(dataObj)) {
        if (label === 'note') continue;
        rows += kvRow(label, value);
    }
    return `<div class="kv-grid ${extraClass}">${rows}</div>`;
}

function compareRow(label, ilk, son) {
    return `
        <div class="kv-row kv-compare">
            <span class="kv-label">${label}</span>
            <span class="kv-value">
                <span class="kv-old">${ilk}</span>
                <i class="fas fa-arrow-right kv-arrow"></i>
                <span class="kv-new">${son}</span>
            </span>
        </div>`;
}

function kpiCard(icon, label, value, state = '', sub = '') {
    return `
        <div class="mv-kpi ${state}">
            <div class="mv-kpi-icon"><i class="fas ${icon}"></i></div>
            <div class="mv-kpi-body">
                <span class="mv-kpi-label">${label}</span>
                <span class="mv-kpi-value">${value}</span>
                ${sub ? `<span class="mv-kpi-sub">${sub}</span>` : ''}
            </div>
        </div>`;
}

window.showMeterData = function(meterName, factoryName) {
    ensureMeterStyles();
    const panel = document.getElementById('meterDataPanel');
    const d = getMeterData(meterName, factoryName);

    // Türetilmiş durumlar — veri değiştiğinde renklendirme otomatik güncellenir
    const asimVar = d.ceza.sozlesmeGucu.asildiMi === 'Evet';
    const kalanGun = parseInt(d.abone["Kalan Süre"], 10) || 0;
    const sertifikaDoldu = kalanGun <= 0;
    const aktifRow = d.endeks.rows.find(r => r[0].startsWith('Aktif Enerji'));
    const aktifSon = aktifRow ? aktifRow[2] : '-';

    const endeksRows = d.endeks.rows.map(([label, ilk, son]) => compareRow(label, ilk, son)).join('');

    const kpis = [
        kpiCard('fa-plug', 'Sözleşme Gücü', d.abone["Sözleşme Gücü"]),
        kpiCard('fa-exclamation-triangle', 'Güç Aşımı',
            asimVar ? `${d.ceza.sozlesmeGucu.asimMiktari} kW` : 'Aşım yok',
            asimVar ? 'warn' : 'good'),
        kpiCard('fa-tachometer-alt', 'Aktif Enerji (Son Endeks)', `${aktifSon} kW`),
        kpiCard('fa-shield-alt', 'Kalibrasyon Belgesi',
            sertifikaDoldu ? 'Süresi doldu' : `${kalanGun} gün kaldı`,
            sertifikaDoldu ? 'warn' : 'good',
            sertifikaDoldu ? `${d.abone["San.Sic.Bel.Bitiş"]} tarihinde bitti` : '')
    ].join('');

    panel.innerHTML = `
        <div class="mv-panel">
            <div class="mv-header">
                <div class="mv-header-left">
                    <span class="icon-badge lg"><i class="fas fa-bolt"></i></span>
                    <div>
                        <h3>${factoryName} <span class="mv-header-sep">·</span> ${meterName}</h3>
                        <p class="mv-header-sub">Detaylı Ölçüm Raporu</p>
                    </div>
                </div>
                <div class="mv-header-right">
                    <span class="badge success">Aktif</span>
                    <span class="mv-header-updated">Son okuma: ${d.tuketim["Son Okuma Zamanı"]}</span>
                </div>
            </div>

            <div class="mv-kpis">${kpis}</div>

            <div class="mv-grid">
                <div class="mv-card">
                    <div class="mv-card-head">
                        <span class="icon-badge"><i class="fas fa-id-card"></i></span>
                        <h4>Abone Bilgileri</h4>
                    </div>
                    ${kvGrid(d.abone)}
                </div>

                <div class="mv-card">
                    <div class="mv-card-head">
                        <span class="icon-badge"><i class="fas fa-tachometer-alt"></i></span>
                        <h4>Endeks Bilgileri</h4>
                    </div>
                    <div class="kv-grid kv-grid-compare">${endeksRows}</div>
                    <p class="mv-note">${d.endeks.note}</p>
                </div>

                <div class="mv-card full ${asimVar ? 'warn' : ''}">
                    <div class="mv-card-head">
                        <span class="icon-badge ${asimVar ? 'warn' : ''}"><i class="fas fa-exclamation-triangle"></i></span>
                        <h4>Ceza Durumu</h4>
                        ${asimVar ? '<span class="badge warning">Aşım Var</span>' : '<span class="badge good">Aşım Yok</span>'}
                    </div>
                    <div class="mv-subgrid">
                        <div class="mv-subblock">
                            <h5>Alınan Enerji</h5>
                            ${kvGrid(d.ceza.alinanEnerji)}
                        </div>
                        <div class="mv-subblock">
                            <h5>Reaktif Ceza</h5>
                            ${kvGrid(d.ceza.reaktifCeza)}
                        </div>
                        <div class="mv-subblock ${asimVar ? 'warn' : ''}">
                            <h5>Sözleşme Gücü Aşımı</h5>
                            <div class="kv-grid">
                                <div class="kv-row">
                                    <span class="kv-label">Aşıldı mı?</span>
                                    <span class="kv-value">${asimVar ? '<span class="badge warning">Evet</span>' : '<span class="badge good">Hayır</span>'}</span>
                                </div>
                                ${kvRow('Aşım miktarı', d.ceza.sozlesmeGucu.asimMiktari + ' kW')}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mv-card full">
                    <div class="mv-card-head">
                        <span class="icon-badge"><i class="fas fa-chart-line"></i></span>
                        <h4>Tüketim Bilgileri</h4>
                    </div>
                    ${kvGrid(d.tuketim)}
                    <p class="mv-note">${d.tuketim.note}</p>
                </div>
            </div>
        </div>
    `;
    panel.scrollIntoView({ behavior: 'smooth' });
};

async function handleFormSubmit(e) {
    e.preventDefault();

    const nameInput = document.getElementById('newFacName');
    const ipInput = document.getElementById('newFacIp');
    const countInput = document.getElementById('newFacCount');
    const submitBtn = e.target.querySelector('button[type="submit"]');

    const payload = {
        name: nameInput.value.trim(),
        ip: ipInput.value.trim(),
        meterCount: parseInt(countInput.value, 10) || 0
    };

    const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Kaydediliyor...';
    }

    try {
        const res = await fetch(`${API_BASE}/factories`, {
            method: 'POST',
            headers: authHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(payload)
        });
        if (handleAuthFailure(res)) return;
        const result = await res.json();

        if (res.ok && result.success) {
            e.target.reset();
            document.getElementById('addFactoryModal').classList.add('hidden');
            await loadFactories();
        } else {
            alert('Hata: ' + (result.message || 'Fabrika eklenemedi.'));
        }
    } catch (err) {
        alert('Bağlantı hatası. Sunucuya ulaşılamadı.');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHtml;
        }
    }
}
