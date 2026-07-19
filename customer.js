// customer.js

document.addEventListener('DOMContentLoaded', async () => {
    // Token yoksa veya rol CUSTOMER değilse login'e at
    if (!requireRole(['CUSTOMER'])) return;

    const nameEl = document.getElementById('customerName');
    if (nameEl) nameEl.textContent = localStorage.getItem('userCompany') || 'Sayın Müşterimiz';

    await loadMyFacilities();

    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'index.html';
    });
});

// ---------------------------------------------------------------------
// Gerçek veri: /api/factories, CUSTOMER rolü için backend tarafında
// zaten sadece bu kullanıcıya tanımlı fabrikaları döndürüyor (bkz.
// app.py -> get_factories, token içindeki accessible_factories'e göre
// filtreleniyor). Burada ayrıca bir filtre yapmaya gerek yok.
//
// Not: "Son Veri Güncelleme" ve "Durum" için henüz gerçek modem verisi
// yok, bu yüzden admin panelindeki tabloyla tutarlı şekilde dürüstçe
// "—" / "Bilinmiyor" gösteriyoruz — sahte sayı üretmiyoruz. Modem API'si
// bağlandığında bu iki hücreyi gerçek veriyle değiştirmek yeterli olacak.
// ---------------------------------------------------------------------
async function loadMyFacilities() {
    const tableBody = document.getElementById('customerTableBody');
    const statCountEl = document.getElementById('statMyFacilities');

    if (tableBody) {
        tableBody.innerHTML = '<tr><td colspan="4" class="table-loading">Yükleniyor...</td></tr>';
    }

    try {
        const res = await fetch(`${API_BASE}/factories`, { headers: authHeaders() });
        if (handleAuthFailure(res)) return;
        const data = await res.json();
        const facilities = data.factories || data || [];

        if (statCountEl) statCountEl.textContent = facilities.length;

        if (!tableBody) return;

        if (!facilities.length) {
            tableBody.innerHTML = '<tr><td colspan="4" class="table-loading">Size tanımlı bir tesis bulunmuyor. Lütfen yöneticinizle iletişime geçin.</td></tr>';
            return;
        }

        tableBody.innerHTML = facilities.map(f => `
            <tr>
                <td data-label="Tesis Adı">${f.name || '-'}</td>
                <td data-label="Bağlı Sayaç">${f.meterCount ?? '-'}</td>
                <td data-label="Son Veri Güncelleme">—</td>
                <td data-label="Durum"><span class="badge neutral">Bilinmiyor</span></td>
            </tr>
        `).join('');
    } catch (err) {
        console.error('Tesis verileri yüklenemedi:', err);
        if (statCountEl) statCountEl.textContent = '—';
        if (tableBody) {
            tableBody.innerHTML = '<tr><td colspan="4" class="table-error">Tesis verileri yüklenemedi.</td></tr>';
        }
    }
}
