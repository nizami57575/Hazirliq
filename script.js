let currentQIndex = 0;
let activeQuestions = [];
let userProfile = { name: "", topic: "" };

// Səhifə yüklənəndə işə düşür
window.onload = () => {
    console.log("Sayt hazırdır.");
};

// Əsas saytı açan funksiya
function openSite() {
    document.getElementById('entry-screen').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
    loadWeeklyQuiz();
}

// Bot pəncərəsini açan funksiya
function showBot(topic) {
    userProfile.topic = topic;
    document.getElementById('bot-modal').style.display = 'block';
    resetBot();
}

function closeModal() {
    document.getElementById('bot-modal').style.display = 'none';
}

function resetBot() {
    document.getElementById('user-name-input').value = "";
    document.getElementById('user-name-input').style.display = 'block';
    document.querySelector('.send-btn').style.display = 'block';
    document.getElementById('bot-choices').innerHTML = '';
    document.getElementById('bot-msg').innerText = "Salam! Davam etmək üçün adınızı yazın:";
}

function startConversing() {
    const nameVal = document.getElementById('user-name-input').value;
    if(!nameVal) { alert("Adınızı yazın!"); return; }
    userProfile.name = nameVal;
    
    document.getElementById('user-name-input').style.display = 'none';
    document.querySelector('.send-btn').style.display = 'none';
    
    handleBotFlow();
}

function handleBotFlow() {
    let msg = "";
    let opts = [];

    if(userProfile.topic === 'registration') {
        msg = `Salam ${userProfile.name}, hansı sinif hazırlığı maraqlıdır?`;
        opts = ["1-4-cü Sinif", "Məktəbəqədər"];
    } else if(userProfile.topic === 'fast_learning') {
        msg = "Dərslər həftədə 4 gün, 2 saat olur. Razısınız?";
        opts = ["Bəli", "Xeyr"];
    } else {
        msg = "Hansı mentorla danışmaq istərdiniz?";
        opts = ["Aysu", "Aidə", "Gültən", "Sədakət"];
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
    const myNum = "994XXXXXXXXX"; // ÖZ NÖMRƏNİ BURA YAZ
    const text = `Salam! Adım ${userProfile.name}. ${userProfile.topic} haqqında ${choice} seçdim.`;
    window.open(`https://wa.me/${myNum}?text=${encodeURIComponent(text)}`, '_blank');
    closeModal();
    openSite();
}

// SINAQ SİSTEMİ (Zaman tənzimləməli)
function loadWeeklyQuiz() {
    const now = new Date();
    // Cari vaxta uyğun həftəni tapır
    let currentWeekData = quizDatabase.filter(w => new Date(w.startDate) <= now).pop();

    if (!currentWeekData) {
        document.getElementById('quiz-week-title').innerText = "Sınaqlar tezliklə başlayacaq!";
        document.getElementById('quiz-display').innerText = "İlk sınaq 6 apreldə açılacaq.";
        return;
    }

    document.getElementById('quiz-week-title').innerText = currentWeekData.title;
    activeQuestions = currentWeekData.questions;
    showQuestion();
}

function showQuestion() {
    if (currentQIndex >= activeQuestions.length) {
        document.getElementById('quiz-display').innerHTML = "<h3>Bu həftəlik bu qədər! Afərin! 🏆</h3>";
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
        setTimeout(() => {
            currentQIndex++;
            showQuestion(); 
            res.innerText = "";
        }, 1200);
    } else {
        res.innerText = "Səhvdir, yenidən yoxla! ❌"; res.style.color = "#ef4444";
    }
}
