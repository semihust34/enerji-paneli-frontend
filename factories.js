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

        try {
            const res = await fetch('https://web-production-388bad.up.railway.app/api/factories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(factoryData)
            });

            if (res.ok) {
                document.getElementById('newFactoryForm').reset();
                addModal.classList.add('hidden');
                loadFactories();
            } else {
                alert("Kayıt başarısız.");
            }
        } catch (err) {
            console.error("Kayıt hatası:", err);
            alert("Sunucu bağlantı hatası!");
        }
    });
});

async function loadFactories() {
    try {
        console.log("Fabrikalar çekiliyor...");
        const res = await fetch('https://web-production-388bad.up.railway.app/api/factories', {
            headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        
        // Yanıtın başarılı olup olmadığını kontrol et
        if (!res.ok) throw new Error("Sunucu yanıt vermedi!");

        const result = await res.json();
        console.log("Gelen veriler:", result); // F12 Konsolundan bunu kontrol et!

        const factories = result.factories || [];
        const container = document.getElementById('factoryAccordion');
        container.innerHTML = '';
        
        if (factories.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666; margin-top: 20px;">Henüz tanımlı fabrika bulunmuyor.</p>';
            return;
        }

        factories.forEach(f => {
            const item = document.createElement('div');
            item.style.backgroundColor = '#1e1e1e';
            item.style.border = '1px solid #333';
            item.style.borderRadius = '8px';
            item.style.marginBottom = '10px';
            
            item.innerHTML = `
                <div onclick="toggleFactory(this)" style="padding: 20px; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
                    <h3>${f.name}</h3>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="factory-content" style="display: none; padding: 0 20px 20px 20px; border-top: 1px solid #333;">
                    <p style="margin-top: 15px; font-weight: bold; color: var(--accent-color);">Ana Sayaç</p>
                    <div style="background: #2c2c2c; padding: 10px; border-radius: 4px; margin: 5px 0;">Ana Enerji Giriş Sayacı (Aktif)</div>
                    <p style="margin-top: 15px; font-weight: bold; color: var(--text-secondary);">Alt Sayaçlar (${f.meterCount || 0} Adet)</p>
                    <div id="meters-${f.id}"></div>
                </div>
            `;
            container.appendChild(item);

            const meterContainer = document.getElementById(`meters-${f.id}`);
            for(let i = 1; i <= (f.meterCount || 0); i++) {
                meterContainer.innerHTML += `
                    <div style="background: #252525; padding: 8px; margin: 5px 0; border-radius: 4px;">
                        Alt Sayaç #${i}
                    </div>
                `;
            }
        });
    } catch (error) {
        console.error("Hata:", error);
        document.getElementById('factoryAccordion').innerHTML = '<p style="color: var(--error-color);">Fabrikalar yüklenemedi. Lütfen konsolu kontrol et.</p>';
    }
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
