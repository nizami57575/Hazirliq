let userProfile = { name: "", topic: "" };
let currentQIndex = 0;
let activeQuestions = [];

function openSite() {
    document.getElementById('entry-screen').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
    loadWeeklyQuiz();
}

function showBot(topic) {
    userProfile.topic = topic;
    document.getElementById('bot-modal').style.display = 'block';
    resetBot();
}

function closeModal() { document.getElementById('bot-modal').style.display = 'none'; }

function resetBot() {
    document.getElementById('user-name-input').style.display = 'block';
    document.querySelector('.send-btn').style.display = 'block';
    document.getElementById('bot-choices').innerHTML = '';
    document.getElementById('bot-msg').innerText = "Zirvə Portalına xoş gəldiniz! Adınızı qeyd edin:";
}

function startConversing() {
    const name = document.getElementById('user-name-input').value;
    if(!name) return;
    userProfile.name = name;
    document.getElementById('user-name-input').style.display = 'none';
    document.querySelector('.send-btn').style.display = 'none';
    handleBotFlow();
}

function handleBotFlow() {
    let msg = ""; let opts = [];
    if(userProfile.topic === 'registration') {
        msg = `Salam ${userProfile.name}, hansı sinif üzrə qeydiyyatdan keçmək istəyirsiniz?`;
        opts = ["1-4-cü sinif", "Məktəbəqədər"];
    } else if(userProfile.topic === 'fast_learning') {
        msg = "Dərslərimiz Gəncədə keçirilir. Aylıq ödəniş 10 AZN-dir. Razısınız?";
        opts = ["Bəli, razıyam", "Daha ətraflı məlumat"];
    } else {
        msg = "Sizə hansı mentor kömək etsin?";
        opts = ["Aysu (Riyaziyyat)", "Aidə (Azərbaycan dili)", "Gültən (Rus dili)", "Sədakət (İngilis dili)"];
    }
    document.getElementById('bot-msg').innerText = msg;
    const choiceDiv = document.getElementById('bot-choices');
    opts.forEach(opt => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.onclick = () => finalizeBot(opt);
        choiceDiv.appendChild(btn);
    });
}

function finalizeBot(choice) {
    const myNum = "994517728824";
    const text = `Salam! Mən ${userProfile.name}. Saytdan yazıram. Mövzu: ${userProfile.topic}. Seçimim: ${choice}`;
    window.open(`https://wa.me/${myNum}?text=${encodeURIComponent(text)}`, '_blank');
    closeModal();
    openSite();
}

function loadWeeklyQuiz() {
    const now = new Date();
    let currentWeekData = quizDatabase.filter(w => new Date(w.startDate) <= now).pop();
    if (!currentWeekData) {
        document.getElementById('quiz-week-title').innerText = "Sınaqlar tezliklə başlayacaq!";
        return;
    }
    document.getElementById('quiz-week-title').innerText = currentWeekData.title;
    activeQuestions = currentWeekData.questions;
    showQuestion();
}

function showQuestion() {
    if (currentQIndex >= activeQuestions.length) {
        document.getElementById('quiz-display').innerHTML = "<h3>Həftəlik sınağı uğurla bitirdiniz! 🏆</h3>";
        return;
    }
    const qData = activeQuestions[currentQIndex];
    document.getElementById('current-question').innerText = `${currentQIndex + 1}. ${qData.q}`;
    const optsDiv = document.getElementById('quiz-options');
    optsDiv.innerHTML = '';
    qData.o.forEach(opt => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.className = 'btn-outline';
        btn.onclick = () => checkAns(opt, qData.c);
        optsDiv.appendChild(btn);
    });
}

function checkAns(selected, correct) {
    const res = document.getElementById('quiz-result');
    if(selected === correct) {
        res.innerText = "Doğrudur! 🎉"; res.style.color = "#22c55e";
        setTimeout(() => { currentQIndex++; showQuestion(); res.innerText = ""; }, 1200);
    } else {
        res.innerText = "Səhvdir, bir daha yoxla! ❌"; res.style.color = "#ef4444";
    }
}
