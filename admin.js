document.addEventListener('DOMContentLoaded', () => {
    if (!requireRole(['ADMIN', 'SUPERADMIN'])) return;

    const adminNameEl = document.getElementById('adminName');
    if (adminNameEl) adminNameEl.textContent = localStorage.getItem('userCompany') || 'Yetkili';

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = 'index.html';
        });
    }

    loadDashboard();
});

// API_BASE artık auth.js içinde tanımlı (bu sayfaya auth.js dahil edilmeli)

async function loadDashboard() {
    await loadFactoriesAndFillDashboard();
    renderChartPlaceholder();
}

// ---------------------------------------------------------------------
// Fabrika verileri: /api/factories tek gerçek veri kaynağımız.
// Şu an sadece { id, name, ip, meterCount } dönüyor — reaktif alarm
// durumu ve son iletişim zamanı için henüz bir alan/endpoint yok.
// ---------------------------------------------------------------------
async function loadFactoriesAndFillDashboard() {
    const totalFactoriesEl = document.getElementById('statTotalFactories');
    const activeMetersEl = document.getElementById('statActiveMeters');
    const tableBody = document.getElementById('tableBody');

    if (tableBody) {
        tableBody.innerHTML = '<tr><td colspan="6" class="table-loading">Yükleniyor...</td></tr>';
    }

    try {
        const res = await fetch(`${API_BASE}/factories`, { headers: authHeaders() });
        if (handleAuthFailure(res)) return;
        const data = await res.json();
        const factories = data.factories || data || [];

        if (totalFactoriesEl) totalFactoriesEl.textContent = factories.length;

        if (activeMetersEl) {
            const totalMeters = factories.reduce((sum, f) => sum + (f.meterCount || 0), 0);
            activeMetersEl.textContent = totalMeters;
        }

        renderFactoryTable(factories);
    } catch (err) {
        console.error('Fabrika verileri yüklenemedi:', err);
        if (totalFactoriesEl) totalFactoriesEl.textContent = '—';
        if (activeMetersEl) activeMetersEl.textContent = '—';
        if (tableBody) {
            tableBody.innerHTML = '<tr><td colspan="6" class="table-error">Fabrika verileri yüklenemedi.</td></tr>';
        }
    }
}

function renderFactoryTable(factories) {
    const tableBody = document.getElementById('tableBody');
    if (!tableBody) return;

    if (!factories.length) {
        tableBody.innerHTML = '<tr><td colspan="6" class="table-loading">Henüz kayıtlı fabrika yok.</td></tr>';
        return;
    }

    tableBody.innerHTML = factories.map(f => `
        <tr>
            <td data-label="Fabrika Adı">${f.name || '-'}</td>
            <td data-label="Modem IP">${f.ip || '-'}</td>
            <td data-label="Bağlı Sayaç">${f.meterCount ?? '-'}</td>
            <td data-label="Son İletişim">—</td>
            <td data-label="Durum (Reaktif)"><span class="badge neutral">Bilinmiyor</span></td>
            <td data-label="İşlem"><a class="action-btn" href="factories.html">Görüntüle</a></td>
        </tr>
    `).join('');
}

// ---------------------------------------------------------------------
// Grafik: "Günlük Reaktif Tüketim Trendi" için elimizde gerçek bir
// geçmiş/zaman serisi verisi yok — sahte sayılarla dolu bir grafik
// çizmek yerine, veri bağlanana kadar durumu olduğu gibi söylüyoruz.
// Bir tarihsel veri endpoint'i eklendiğinde, bu fonksiyonu Chart.js
// çağrısıyla değiştirmek yeterli olacak.
// ---------------------------------------------------------------------
function renderChartPlaceholder() {
    const canvas = document.getElementById('energyChart');
    if (!canvas) return;

    const box = document.createElement('div');
    box.className = 'placeholder-box';
    box.innerHTML = `
        <i class="fas fa-chart-line" style="font-size: 1.6rem; margin-bottom: 10px; display: block;"></i>
        Günlük reaktif tüketim trendi için geçmiş veri API'si henüz bağlı değil.
    `;
    canvas.replaceWith(box);
}
