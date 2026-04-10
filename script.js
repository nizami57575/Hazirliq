AOS.init();

function closeEntry() {
    document.getElementById('entry-screen').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
}

function showModal() { document.getElementById('reg-modal').style.display = 'block'; }
function closeModal() { document.getElementById('reg-modal').style.display = 'none'; }

function checkQuiz(val) {
    const feedback = document.getElementById('feedback');
    if(val === 30) {
        feedback.innerHTML = "🎉 Əla! Düzgün cavab! (Əvvəl vurma edilir)";
        feedback.style.color = "green";
    } else {
        feedback.innerHTML = "❌ Səhvdir. Bir daha yoxla!";
        feedback.style.color = "red";
    }
}

function sendWhatsApp() {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const grade = document.getElementById('grade').value;

    if(!name || !phone) {
        alert("Zəhmət olmasa məlumatları doldurun!");
        return;
    }

    const adminNum = "994XXXXXXXXX"; // ÖZ NÖMRƏNİ BURA YAZ (məs: 994501234567)
    const text = `Salam! Yeni qeydiyyat:\nAd: ${name}\nNömrə: ${phone}\nSinif: ${grade}\n\nBu müraciət 9-cu sinif yüksək ballı mentorların saytından gəldi.`;
    
    window.open(`https://wa.me/${adminNum}?text=${encodeURIComponent(text)}`, '_blank');
    closeModal();
    closeEntry();
}
