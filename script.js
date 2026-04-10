let userProfile = { name: "", topic: "" };
let currentQIndex = 0;

// SAYTIN AÇILMASI
function openSite() {
    document.getElementById('entry-screen').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
    loadWeeklyQuiz();
}

// BOT SİSTEMİ
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
    document.getElementById('bot-msg').innerText = "Salam! Davam etmək üçün adınızı yazın:";
}

function startConversing() {
    const nameVal = document.getElementById('user-name-input').value;
    if(!nameVal) return;
    userProfile.name = nameVal;
    
    document.getElementById('user-name-input').style.display = 'none';
    document.querySelector('.send-btn').style.display = 'none';
    
    handleBotFlow();
}

function handleBotFlow() {
    let msg = "";
    let opts = [];

    if(userProfile.topic === 'registration') {
        msg = `Salam ${userProfile.name}, hansı sinif hazırlığı ilə maraqlanırsınız?`;
        opts = ["1-ci Sinif", "2-ci Sinif", "3-cü Sinif", "4-cü Sinif"];
    } else if(userProfile.topic === 'fast_learning') {
        msg = "Dərslər həftədə 4 gün olur. Aylıq ödəniş 10 AZN-dir. Razısınız?";
        opts = ["Bəli, razıyam", "Ətraflı məlumat al"];
    } else {
        msg = "Hansı mentorla əlaqə qurmaq istəyirsiniz?";
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
    const text = `Salam! Adım ${userProfile.name}. Mən ${userProfile.topic} haqqında ${choice} seçdim.`;
    window.open(`https://wa.me/${myNum}?text=${encodeURIComponent(text)}`, '_blank');
    closeModal();
    openSite();
}

// SINAQ SİSTEMİ
function loadWeeklyQuiz() {
    if(typeof weeklyQuiz === 'undefined') return;
    document.getElementById('quiz-week-title').innerText = weeklyQuiz.weekTitle;
    showQuestion();
}

function showQuestion() {
    const qData = weeklyQuiz.questions[currentQIndex];
    document.getElementById('current-question').innerText = `${currentQIndex + 1}. ${qData.question}`;
    
    const optsDiv = document.getElementById('quiz-options');
    optsDiv.innerHTML = '';
    
    qData.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.className = 'btn-outline';
        btn.onclick = () => checkAns(opt, qData.correct);
        optsDiv.appendChild(btn);
    });
}

function checkAns(selected, correct) {
    const res = document.getElementById('quiz-result');
    if(selected === correct) {
        res.innerText = "Doğrudur! 🎉"; res.style.color = "#22c55e";
        setTimeout(() => {
            currentQIndex++;
            if(currentQIndex < weeklyQuiz.questions.length) {
                showQuestion(); res.innerText = "";
            } else {
                document.getElementById('quiz-display').innerHTML = "<h3>Sınaq tamamlandı! 🏆</h3>";
                currentQIndex = 0;
            }
        }, 1500);
    } else {
        res.innerText = "Səhvdir, yenidən yoxla! ❌"; res.style.color = "#ef4444";
    }
}
