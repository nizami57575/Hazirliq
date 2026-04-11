let userProfile = { name: "Şagird", topic: "" };
let currentQIndex = 0;
let activeQuestions = [];
let userResults = [];
let timerInterval;
let timeLeft = 30;

// Dinamik Salamlama
window.onload = () => {
    const hour = new Date().getHours();
    const msg = hour < 12 ? "Sabahınız xeyir!" : hour < 18 ? "Günortanız xeyir!" : "Axşamınız xeyir!";
    document.getElementById('greeting-msg').innerText = msg;
};

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
    document.getElementById('bot-choices').innerHTML = '';
    document.getElementById('bot-msg').innerText = "Adınızı bura yazın:";
}

function startConversing() {
    userProfile.name = document.getElementById('user-name-input').value || "Şagird";
    document.getElementById('user-name-input').style.display = 'none';
    document.querySelector('.send-btn').style.display = 'none';
    handleBotFlow();
}

function handleBotFlow() {
    let msg = `Salam ${userProfile.name}, sənə necə kömək edə bilərəm?`;
    let opts = ["Qeydiyyat", "Dərslər haqqında", "Mentorlar"];
    
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
    const text = `Salam Nizami müəllim! Mən ${userProfile.name}. Saytdan yazıram, mövzu: ${choice}`;
    window.open(`https://wa.me/${myNum}?text=${encodeURIComponent(text)}`, '_blank');
}

// SINAQ SİSTEMİ
function loadWeeklyQuiz() {
    const now = new Date();
    let data = quizDatabase.filter(w => new Date(w.startDate) <= now).pop();
    if (!data) return;
    document.getElementById('quiz-week-title').innerText = data.title;
    activeQuestions = data.questions;
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
        calculateFinal();
        return;
    }
    startTimer();
    const qData = activeQuestions[currentQIndex];
    document.getElementById('quiz-display').innerHTML = `
        <p><strong>Sual ${currentQIndex+1}:</strong> ${qData.q}</p>
        <div class="choice-list" id="opts"></div>
    `;
    qData.o.forEach(o => {
        const b = document.createElement('button');
        b.innerText = o;
        b.onclick = () => saveAnswer(o);
        document.getElementById('opts').appendChild(b);
    });
}

function saveAnswer(selected) {
    userResults.push({ q: activeQuestions[currentQIndex].q, s: selected, c: activeQuestions[currentQIndex].c });
    currentQIndex++;
    showQuestion();
}

function calculateFinal() {
    const correct = userResults.filter(r => r.s === r.c).length;
    const percent = Math.round((correct / activeQuestions.length) * 100);
    
    let html = `<h3>Nəticə: ${correct} / ${activeQuestions.length}</h3>`;
    if(percent >= 80) {
        html += `<div class="certificate">📜 <b>UĞUR SERTİFİKATI</b><br>Təbrik edirik, ${userProfile.name}!</div>`;
    }
    
    html += `<button class="btn btn-primary" onclick="sendToWhatsApp(${correct})">Nəticəni Müəllimə Göndər</button>`;
    document.getElementById('quiz-display').innerHTML = html;
}

function sendToWhatsApp(score) {
    const myNum = "994517728824";
    const text = `Sınaq Bitdi! Şagird: ${userProfile.name}. Bal: ${score}/${activeQuestions.length}`;
    window.open(`https://wa.me/${myNum}?text=${encodeURIComponent(text)}`, '_blank');
}

function shareSite() {
    if (navigator.share) {
        navigator.share({ title: 'Zirvə Portal', url: window.location.href });
    }
}
