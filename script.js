let currentQIndex = 0;
let activeQuestions = [];

function loadWeeklyQuiz() {
    const now = new Date();
    // Cari vaxta uyğun olan ən son həftəni tapırıq
    let currentWeekData = quizDatabase.filter(w => new Date(w.startDate) <= now).pop();

    if (!currentWeekData) {
        document.getElementById('quiz-week-title').innerText = "Sınaqlar tezliklə başlayacaq!";
        document.getElementById('quiz-display').innerHTML = "İlk sınaq 6 aprel tarixində açılacaq.";
        return;
    }

    document.getElementById('quiz-week-title').innerText = currentWeekData.title;
    activeQuestions = currentWeekData.questions;
    showQuestion();
}

function showQuestion() {
    if (currentQIndex >= activeQuestions.length) {
        document.getElementById('quiz-display').innerHTML = "<h3>Həftəlik sınağı bitirdiniz! 🏆</h3>";
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
        }, 1500);
    } else {
        res.innerText = "Səhvdir, yenidən yoxla! ❌"; res.style.color = "#ef4444";
    }
}

// Digər bot funksiyaları və openSite funksiyası olduğu kimi qalır...
