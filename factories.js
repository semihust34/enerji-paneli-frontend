document.addEventListener('DOMContentLoaded', () => {
    loadFactories();

    // Modallar
    const addModal = document.getElementById('addFactoryModal');
    const detailModal = document.getElementById('factoryDetailModal');
    
    document.getElementById('openFactoryModalBtn').addEventListener('click', () => addModal.classList.remove('hidden'));
    document.getElementById('closeModalBtn').addEventListener('click', () => addModal.classList.add('hidden'));
    document.getElementById('closeDetailBtn').addEventListener('click', () => detailModal.classList.add('hidden'));

    // Çıkış
    document.getElementById('logoutBtn').addEventListener('click', () => window.location.href = 'index.html');

    // Fabrika Ekleme
    document.getElementById('newFactoryForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const factoryData = {
            name: document.getElementById('newFacName').value,
            ip: document.getElementById('newFacIp').value,
            meterCount: parseInt(document.getElementById('newFacCount').value)
        };

        const res = await fetch('https://web-production-388bad.up.railway.app/api/factories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(factoryData)
        });

        if (res.ok) {
            document.getElementById('newFactoryForm').reset();
            addModal.classList.add('hidden');
            loadFactories();
        } else alert("Kayıt başarısız.");
    });
});

async function loadFactories() {
    const res = await fetch('https://web-production-388bad.up.railway.app/api/factories');
    const { factories } = await res.json();
    
    const list = document.getElementById('factoryList');
    list.innerHTML = '';
    
    factories.forEach(f => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.border = '1px solid #333';
        card.innerHTML = `
            <h3>${f.name}</h3>
            <p style="color: #a0a0a0; margin: 10px 0;">Bağlı Sayaç: ${f.meterCount} Adet</p>
            <button onclick="openFactoryDetails(${f.meterCount}, '${f.name}')">Detayları Gör</button>
        `;
        list.appendChild(card);
    });
}

window.openFactoryDetails = function(count, name) {
    document.getElementById('modalFactoryName').innerText = name;
    const container = document.getElementById('meterListContainer');
    container.innerHTML = `<p>Bu tesiste toplam <strong>${count}</strong> adet sayaç bulunmaktadır.</p><br>`;
    
    for(let i = 1; i <= count; i++) {
        container.innerHTML += `
            <div style="background: #2c2c2c; padding: 12px; margin-bottom: 8px; border-radius: 6px; display: flex; justify-content: space-between;">
                <span>Ana Sayaç / Sayaç #${i}</span>
                <span class="badge success">Aktif</span>
            </div>
        `;
    }
    document.getElementById('factoryDetailModal').classList.remove('hidden');
};
