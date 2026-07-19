// ui.js
// Tüm sayfalarda ortak: (1) karanlık/aydınlık tema tercihini localStorage'da
// hatırlar ve düğmeye tıklanınca değiştirir, (2) mobilde hamburger menü ile
// kenar çubuğunu (sidebar) açıp kapatır. Sayfada ilgili elemanlar yoksa
// (ör. tema düğmesi olmayan bir sayfa) fonksiyonlar sessizce hiçbir şey
// yapmaz, hata vermez.
//
// NOT: Tema tercihinin sayfa yüklenirken (ekran beyaz/siyah "çakmadan")
// hemen uygulanabilmesi için <head> içine ayrıca küçük, senkron bir
// script eklenmiştir (bkz. her .html dosyasının en üstü). Bu dosya sadece
// düğmenin tıklanma davranışını ve ikonunu yönetir.

(function () {
    function applyThemeIcon(theme) {
        document.querySelectorAll('.theme-toggle-btn i, .theme-toggle-standalone i').forEach((icon) => {
            icon.className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
        });
        document.querySelectorAll('.theme-toggle-label').forEach((label) => {
            label.textContent = theme === 'light' ? 'Aydınlık Mod' : 'Karanlık Mod';
        });
    }

    function initThemeToggle() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        applyThemeIcon(currentTheme);

        document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const now = document.documentElement.getAttribute('data-theme') || 'dark';
                const next = now === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', next);
                try { localStorage.setItem('theme', next); } catch (e) { /* depolama kapalıysa sessizce geç */ }
                applyThemeIcon(next);
            });
        });
    }

    function initSidebarToggle() {
        const sidebar = document.querySelector('.sidebar');
        const openBtn = document.getElementById('sidebarToggleBtn');
        const overlay = document.getElementById('sidebarOverlay');
        if (!sidebar || !openBtn) return;

        const closeSidebar = () => {
            sidebar.classList.remove('open');
            if (overlay) overlay.classList.remove('visible');
        };
        const openSidebar = () => {
            sidebar.classList.add('open');
            if (overlay) overlay.classList.add('visible');
        };

        openBtn.addEventListener('click', () => {
            sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
        });
        if (overlay) overlay.addEventListener('click', closeSidebar);

        // Bir menü linkine tıklanınca (sayfa değişmese bile) menüyü kapat
        sidebar.querySelectorAll('.nav-links a').forEach((link) => {
            link.addEventListener('click', closeSidebar);
        });

        // Ekran mobil genişlikten masaüstüne büyürse açık kalan menüyü/örtüyü temizle
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) closeSidebar();
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        initThemeToggle();
        initSidebarToggle();
    });
})();
