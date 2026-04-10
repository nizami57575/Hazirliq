// 1. Səhifəni aşağı sürüşdürəndə menyunun rəngini dəyiş
window.onscroll = function() {
    let nav = document.querySelector('nav');
    if (window.scrollY > 100) {
        nav.style.background = "#0f172a";
        nav.style.padding = "10px 5%";
    } else {
        nav.style.background = "rgba(15, 23, 42, 0.8)";
        nav.style.padding = "20px 5%";
    }
};

// 2. Elementlərin baxış sahəsinə girdikdə görünməsi (Scroll Reveal)
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
});

document.querySelectorAll('.feature-card').forEach((el) => observer.observe(el));

// 3. WhatsApp Mesajını Avtomatlaşdır
function contactWhatsApp() {
    let text = "Salam! Hazırlıq kursu barədə məlumat almaq istəyirəm.";
    let phone = "994XXXXXXXXX"; // Bura nömrəni yaz
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
}

// 4. Dark Mode Switcher (Əlavə funksiya)
function toggleDarkMode() {
    document.body.classList.toggle('light-theme');
}
