let userProfile = { name: "Şagird", topic: "" };
let currentQIndex = 0;
let activeQuestions = [];
let userResults = [];
let timerInterval;
let timeLeft = 30;

// Sayt açılan kimi salamlama və aylıq sualları yüklə
window.onload = () => {
    const hour = new Date().getHours();
    document.getElementById('greeting-msg').innerText = hour < 12 ? "Sabahınız xeyir!" : hour < 18 ? "Günortanız xeyir!" : "Axşamınız xeyir!";
};

function openSite() {
    document.getElementById('entry-screen').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
    loadMonthlyQuiz();
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
    document.getElementById('bot-msg').innerText = "Zirvə Portalına xoş gəldiniz! Adınızı yazın:";
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
    let msg = `Salam ${userProfile.name}, hansı mövzuda kömək lazımdır?`;
    let opts = ["Qeydiyyat", "Dərslər", "Mentorlar"];
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
    const text = `Salam! Mən ${userProfile.name}. Mövzu: ${choice}`;
    window.open(`https://wa.me/${myNum}?text=${encodeURIComponent(text)}`, '_blank');
}

// SINAQ SİSTEMİ
function loadMonthlyQuiz() {
    const currentMonth = new Date().getMonth() + 1; // 1-12 arası
    let data = quizDatabase.find(q => q.month === currentMonth);
    
    // Əgər cari ay üçün sual yoxdursa, ən sonuncu ayı götür
    if (!data) data = quizDatabase[quizDatabase.length - 1];
    
    document.getElementById('quiz-month-title').innerText = data.title;
    activeQuestions = data.questions;
    currentQIndex = 0;
    userResults = [];
    showQuestion();
}

function startTimer() {
    timeLeft = 30;
    document.getElementById('timer').innerText = timeLeft;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = timeLeft;
        if(timeLeft <= 0) {
            clearInterval(timerInterval);
            saveAnswer("Vaxt bitdi");
        }
    }, 1000);
}

function showQuestion() {
    if (currentQIndex >= activeQuestions.length) {
        clearInterval(timerInterval);
        showResults();
        return;
    }
    startTimer();
    const qData = activeQuestions[currentQIndex];
    const total = activeQuestions.length;
    const progress = (currentQIndex / total) * 100;

    document.getElementById('quiz-display').innerHTML = `
        <div class="progress-container"><div class="progress-bar" style="width:${progress}%"></div></div>
        <p><strong>${currentQIndex + 1}. ${qData.q}</strong></p>
        <div class="choice-list" id="opts"></div>
    `;
    
    qData.o.forEach(opt => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.onclick = () => saveAnswer(opt);
        document.getElementById('opts').appendChild(btn);
    });
}

function saveAnswer(selected) {
    userResults.push({
        q: activeQuestions[currentQIndex].q,
        selected: selected,
        correct: activeQuestions[currentQIndex].c
    });
    currentQIndex++;
    showQuestion();
}

function showResults() {
    const total = activeQuestions.length;
    const correctCount = userResults.filter(r => r.selected === r.correct).length;
    const percent = Math.round((correctCount / total) * 100);
    
    let html = `<h3>Sınaq Bitdi! 🏁</h3>`;
    html += `<h2>${correctCount} / ${total} düzgün</h2>`;
    html += `<p>Nəticə: ${percent}%</p>`;
    
    if(percent >= 80) html += `<div style="border: 2px solid gold; padding: 10px; margin: 10px 0;">📜 UĞUR SERTİFİKATI QAZANDINIZ!</div>`;
    
    html += `<div style="text-align:left; max-height: 200px; overflow-y: auto; margin: 15px 0;">`;
    userResults.forEach((res, i) => {
        const color = res.selected === res.correct ? "#22c55e" : "#ef4444";
        html += `
            <div class="ans-item" style="border-left: 4px solid ${color}">
                ${i+1}. ${res.q}<br>
                Sənin cavabın: ${res.selected} ${res.selected !== res.correct ? `| Doğru: ${res.correct}` : ""}
            </div>`;
    });
    html += `</div>`;
    
    html += `<button class="btn btn-primary" onclick="window.open('https://wa.me/994517728824?text=${encodeURIComponent('Sınaq nəticəm: ' + correctCount + '/' + total)}', '_blank')">WhatsApp ilə göndər</button>`;
    html += `<button class="btn btn-outline" onclick="loadMonthlyQuiz()">Yenidən Başla</button>`;
    
    document.getElementById('quiz-display').innerHTML = html;
}

function shareSite() {
    if (navigator.share) navigator.share({ title: 'Zirvə Portal', url: window.location.href });
}
