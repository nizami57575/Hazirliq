let currentStep = 0;
let userProfile = { name: "", topic: "" };

function openSite() {
    document.getElementById('entry-screen').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
}

function showBot(topic) {
    userProfile.topic = topic;
    document.getElementById('bot-modal').style.display = 'block';
    resetBot();
}

function closeModal() {
    document.getElementById('bot-modal').style.display = 'none';
}

function resetBot() {
    currentStep = 0;
    document.getElementById('user-name-input').style.display = 'block';
    document.querySelector('.send-btn').style.display = 'block';
    document.getElementById('bot-choices').innerHTML = '';
    document.getElementById('bot-msg').innerText = "Zirvə Portalına xoş gəldiniz! Davam etmək üçün adınızı yazın:";
}

function startConversing() {
    const nameInput = document.getElementById('user-name-input');
    if(nameInput.value.trim() === "") return;
    
    userProfile.name = nameInput.value;
    nameInput.style.display = 'none';
    document.querySelector('.send-btn').style.display = 'none';
    
    handleBotLogic();
}

function handleBotLogic() {
    let msg = "";
    let options = [];

    switch(userProfile.topic) {
        case 'registration':
            msg = `Salam ${userProfile.name}! Qeydiyyat üçün hansı sinif üzrə maraqlanırsınız?`;
            options = ["1-ci Sinif", "2-ci Sinif", "3-cü Sinif", "4-cü Sinif"];
            break;
        case 'fast_learning':
            msg = `${userProfile.name}, dərslərimiz həftədə 4 gün, hər dərs 2 saatdır. Hansı fənn sizin üçün öncəlikdir?`;
            options = ["Riyaziyyat", "İngilis dili", "Rus dili"];
            break;
        case 'exams':
            msg = "Sınaq imtahanlarımız hər həftə sonu keçirilir. Nəticələri haradan izləmək istərdiniz?";
            options = ["WhatsApp-dan", "E-mail vasitəsilə"];
            break;
        case 'mentors':
            msg = "Mentorlarımız 9-cu sinif buraxılış imtahanlarında yüksək nəticə göstərmiş şagirdlərdir. Kiminlə əlaqə saxlamaq istərdiniz?";
            options = ["Aysu (Riyaziyyat)", "Sədakət (İngilis)", "Aidə (Azərbaycan dili)", "Gültən (Rus dili)"];
            break;
    }

    document.getElementById('bot-msg').innerText = msg;
    renderChoices(options);
}

function renderChoices(options) {
    const list = document.getElementById('bot-choices');
    list.innerHTML = '';
    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.onclick = () => finalize(opt);
        list.appendChild(btn);
    });
}

function finalize(choice) {
    document.getElementById('bot-msg').innerText = "Məlumatlar qeydə alındı! Sizi WhatsApp-a yönləndirirəm...";
    document.getElementById('bot-choices').innerHTML = "";
    
    setTimeout(() => {
        const myNum = "994XXXXXXXXX"; // ÖZ NÖMRƏNİ BURA YAZ
        const finalMsg = `Yeni Müraciət! 🚀\nAd: ${userProfile.name}\nMövzu: ${userProfile.topic}\nSeçim: ${choice}`;
        window.open(`https://wa.me/${myNum}?text=${encodeURIComponent(finalMsg)}`, '_blank');
        closeModal();
        openSite();
    }, 1500);
}
