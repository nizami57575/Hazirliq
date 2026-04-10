let botStep = 0;
let currentTopic = '';
let userName = '';

function openSite() {
    document.getElementById('entry-screen').style.display = 'none';
    document.getElementById('site-content').style.display = 'block';
}

function showModal(topic) {
    currentTopic = topic;
    botStep = 0;
    document.getElementById('bot-modal').style.display = 'block';
    resetBot();
}

function closeModal() {
    document.getElementById('bot-modal').style.display = 'none';
}

function resetBot() {
    botStep = 0;
    document.getElementById('bot-input-area').style.display = 'flex';
    document.getElementById('bot-options').innerHTML = '';
    document.getElementById('bot-text').innerText = "Salam! Davam etmək üçün adınızı yazın:";
}

function processBot() {
    let input = document.getElementById('user-input').value;
    if(!input && botStep === 0) return;

    if(botStep === 0) {
        userName = input;
        document.getElementById('user-input').value = '';
        botStep = 1;
        handleTopicLogic();
    }
}

function handleTopicLogic() {
    document.getElementById('bot-input-area').style.display = 'none';
    let text = '';
    let opts = [];

    if(currentTopic === 'learning') {
        text = `Salam ${userName}! Bizim dərslər həftədə 4 gün, hər dərs 2 saatdır. Hansı fənni maraqlanırsan?`;
        opts = ["Riyaziyyat", "English", "Rus dili"];
    } else if(currentTopic === 'exams') {
        text = `Salam! Sınaqlar hər bazar günü keçirilir. Nəticələri haradan görmək istəyirsən?`;
        opts = ["WhatsApp Qrupu", "Sayt"];
    } else {
        text = `Hörmətli ${userName}, 10-cu sinif mentorlarımıza qoşulmaq istəyirsən?`;
        opts = ["Bəli, qoşul", "Məlumat al"];
    }

    document.getElementById('bot-text').innerText = text;
    renderOptions(opts);
}

function renderOptions(opts) {
    const area = document.getElementById('bot-options');
    area.innerHTML = '';
    opts.forEach(opt => {
        let btn = document.createElement('button');
        btn.innerText = opt;
        btn.className = 'btn-reg';
        btn.style.fontSize = '12px';
        btn.onclick = () => finishBot(opt);
        area.appendChild(btn);
    });
}

function finishBot(choice) {
    document.getElementById('bot-text').innerText = "Əla! Sizi məsul şəxsə yönləndirirəm...";
    setTimeout(() => {
        let myNum = "994XXXXXXXXX"; // ÖZ NÖMRƏNİ BURA YAZ
        let msg = `Salam! Mən ${userName}. ${currentTopic} haqqında ${choice} seçdim. Qoşulmaq istəyirəm.`;
        window.open(`https://wa.me/${myNum}?text=${encodeURIComponent(msg)}`, '_blank');
        closeModal();
        openSite();
    }, 1500);
}
