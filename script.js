function openSite() {
    document.getElementById('entry-screen').style.display = 'none';
    document.getElementById('site-content').style.display = 'block';
}

function showModal() {
    document.getElementById('reg-modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('reg-modal').style.display = 'none';
}

function submitToWhatsApp() {
    let name = document.getElementById('student-name').value;
    let phone = document.getElementById('student-phone').value;

    if(name == "" || phone == "") {
        alert("Zəhmət olmasa xanaları doldurun!");
        return;
    }

    // BURADAKI NÖMRƏNİ ÖZ NÖMRƏNLƏ DƏYİŞ (məs: 994501234567)
    let myNumber = "9940518687053"; 
    let message = `Salam! Mən ${name}. Saytınızdan qeydiyyatdan keçdim. Nömrəm: ${phone}`;
    
    window.open(`https://wa.me/${myNumber}?text=${encodeURIComponent(message)}`, '_blank');
    
    closeModal();
    openSite();
}
