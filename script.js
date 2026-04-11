let userProfile = { name: "", topic: "" };
let currentQIndex = 0;
let activeQuestions = [];
let userResults = []; // Şagirdin cavablarını yadda saxlayır

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
    const text = `Salam! Mən ${userProfile.name}. Mövzu: ${userProfile.topic}. Seçimim: ${choice}`;
    window.open(`https://wa.me/${myNum}?text=${encodeURIComponent(text)}`, '_blank');
    closeModal();
    openSite();
}

// SINAQ SİSTEMİ
function loadWeeklyQuiz() {
    const now = new Date();
    let currentWeekData = quizDatabase.filter(w => new Date(w.startDate) <= now).pop();
    if (!currentWeekData) {
        document.getElementById('quiz-week-title').innerText = "Sınaqlar tezliklə başlayacaq!";
        return;
    }
    document.getElementById('quiz-week-title').innerText = currentWeekData.title;
    activeQuestions = currentWeekData.questions;
    currentQIndex = 0;
    userResults = [];
    showQuestion();
}

function showQuestion() {
    const quizDisplay = document.getElementById('quiz-display');
    
    if (currentQIndex >= activeQuestions.length) {
        calculateFinalScore();
        return;
    }

    const qData = activeQuestions[currentQIndex];
    quizDisplay.innerHTML = `
        <p id="current-question"><strong>${currentQIndex + 1}. ${qData.q}</strong></p>
        <div id="quiz-options" class="choice-list"></div>
    `;
    
    const optsDiv = document.getElementById('quiz-options');
    qData.o.forEach(opt => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.className = 'btn-outline';
        btn.onclick = () => saveAnswer(opt, qData.c);
        optsDiv.appendChild(btn);
    });
}

function saveAnswer(selected, correct) {
    // Cavabı yadda saxla və növbəti suala keç
    userResults.push({
        question: activeQuestions[currentQIndex].q,
        selected: selected,
        correct: correct,
        isCorrect: selected === correct
    });
    
    currentQIndex++;
    showQuestion();
}

function calculateFinalScore() {
    const total = activeQuestions.length;
    const correctCount = userResults.filter(r => r.isCorrect).length;
    const percent = Math.round((correctCount / total) * 100);
    
    let resultHTML = `<h3>Sınaq Bitdi! 🏆</h3>`;
    resultHTML += `<p>Nəticə: ${total} sualdan <strong>${correctCount} düz</strong> cavab.</p>`;
    resultHTML += `<div class="progress-bar"><div style="width:${percent}%; background:#22c55e; height:10px; border-radius:5px;"></div></div>`;
    resultHTML += `<p>Ümumi Qiymət: ${percent}%</p><hr>`;
    
    // Səhvləri və düzləri göstər
    userResults.forEach((res, index) => {
        const color = res.isCorrect ? "#22c55e" : "#ef4444";
        const icon = res.isCorrect ? "✅" : "❌";
        resultHTML += `
            <div style="text-align:left; margin-bottom:10px; font-size:14px;">
                <p><strong>${index + 1}. ${res.question}</strong></p>
                <p style="color:${color}">${icon} Sizin cavab: ${res.selected}</p>
                ${!res.isCorrect ? `<p style="color:#22c55e">✔️ Doğru cavab: ${res.correct}</p>` : ""}
            </div>
        `;
    });

    resultHTML += `<button class="btn btn-primary" onclick="loadWeeklyQuiz()">Yenidən Başla</button>`;
    document.getElementById('quiz-display').innerHTML = resultHTML;
    document.getElementById('quiz-result').innerText = "";
}
