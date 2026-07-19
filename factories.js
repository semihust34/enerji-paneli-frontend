document.addEventListener('DOMContentLoaded', () => {
    loadFactories();

    const addModal = document.getElementById('addFactoryModal');
    document.getElementById('openFactoryModalBtn').addEventListener('click', () => addModal.classList.remove('hidden'));
    document.getElementById('closeModalBtn').addEventListener('click', () => addModal.classList.add('hidden'));

    document.getElementById('logoutBtn').addEventListener('click', () => window.location.href = 'index.html');

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
    
    const container = document.getElementById('factoryAccordion');
    container.innerHTML = '';
    
    factories.forEach(f => {
        const item = document.createElement('div');
        item.style.backgroundColor = '#1e1e1e';
        item.style.border = '1px solid #333';
        item.style.borderRadius = '8px';
        
        item.innerHTML = `
            <div onclick="toggleFactory(this)" style="padding: 20px; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
                <h3>${f.name}</h3>
                <i class="fas fa-chevron-down"></i>
            </div>
            <div class="factory-content" style="display: none; padding: 0 20px 20px 20px; border-top: 1px solid #333;">
                <p style="margin-top: 15px; font-weight: bold; color: var(--accent-color);">Ana Sayaç</p>
                <div style="background: #2c2c2c; padding: 10px; border-radius: 4px; margin: 5px 0;">Ana Enerji Giriş Sayacı (Aktif)</div>
                <p style="margin-top: 15px; font-weight: bold; color: var(--text-secondary);">Alt Sayaçlar (${f.meterCount} Adet)</p>
                <div id="meters-${f.id}"></div>
            </div>
        `;
        container.appendChild(item);

        const meterContainer = document.getElementById(`meters-${f.id}`);
        for(let i = 1; i <= f.meterCount; i++) {
            meterContainer.innerHTML += `
                <div style="background: #252525; padding: 8px; margin: 5px 0; border-radius: 4px;">
                    Alt Sayaç #${i}
                </div>
            `;
        }
    });
}

window.toggleFactory = function(element) {
    const content = element.nextElementSibling;
    const icon = element.querySelector('i');
    
    if (content.style.display === "none" || content.style.display === "") {
        content.style.display = "block";
        icon.className = "fas fa-chevron-up";
    } else {
        content.style.display = "none";
        icon.className = "fas fa-chevron-down";
    }
};
