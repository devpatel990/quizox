// Quiz.js - Quizox Quiz Logic

const API_URL = 'https://opentdb.com/api.php';

// DOM Elements
const quizSetup = document.getElementById('quiz-setup');
const quizGame = document.getElementById('quiz-game');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');
const startBtn = document.getElementById('start-btn');
const questionRange = document.getElementById('question-range');
const questionCountDisplay = document.getElementById('question-count-display');
const categoryGrid = document.getElementById('category-grid');
const gameQuestion = document.getElementById('game-question');
const gameOptions = document.getElementById('game-options');
const timer = document.getElementById('timer');
const timerDisplay = document.getElementById('timer-display');
const progressFill = document.getElementById('progress-fill');
const currentQuestionEl = document.getElementById('current-question');
const totalQuestionsEl = document.getElementById('total-questions');
const currentCategoryEl = document.getElementById('current-category');
const currentDifficultyEl = document.getElementById('current-difficulty');

// Quiz State
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedCategory = 'any';
let selectedDifficulty = 'any';
let questionCount = 10;
let timerInterval = null;
let timeLeft = 15;
let isAnswered = false;

// Sound Toggle
const soundToggle = document.getElementById('sound-toggle');
let soundEnabled = localStorage.getItem('soundEnabled') !== 'false';

soundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    localStorage.setItem('soundEnabled', soundEnabled);
    soundToggle.innerHTML = soundEnabled ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
    soundToggle.classList.toggle('muted', !soundEnabled);
});

// Question Count Slider
questionRange.addEventListener('input', () => {
    questionCountDisplay.textContent = `${questionRange.value} Questions`;
    questionCount = parseInt(questionRange.value);
});

// Category Selection
categoryGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('.category-btn');
    if (btn) {
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedCategory = btn.dataset.category;
    }
});

// Difficulty Selection
document.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedDifficulty = btn.dataset.difficulty;
    });
});

// Check URL params
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('category')) {
    const cat = urlParams.get('category');
    document.querySelectorAll('.category-btn').forEach(b => {
        b.classList.remove('active');
        if (b.dataset.category === cat) {
            b.classList.add('active');
            selectedCategory = cat;
        }
    });
}

// Start Quiz
startBtn.addEventListener('click', async () => {
    await startQuiz();
});

async function startQuiz() {
    showLoading();
    hideError();
    
    try {
        questions = await fetchQuestions();
        if (questions.length === 0) {
            showError('No questions available for this category. Please try another.');
            return;
        }
        
        currentQuestionIndex = 0;
        score = 0;
        totalQuestionsEl.textContent = questions.length;
        
        quizSetup.style.display = 'none';
        quizGame.style.display = 'block';
        
        displayQuestion();
    } catch (error) {
        showError('Failed to load questions. Please check your connection and try again.');
        console.error(error);
    } finally {
        hideLoading();
    }
}

async function fetchQuestions() {
    const amount = questionCount;
    let url = `${API_URL}?amount=${amount}`;
    
    if (selectedCategory !== 'any') {
        url += `&category=${selectedCategory}`;
    }
    
    if (selectedDifficulty !== 'any') {
        url += `&difficulty=${selectedDifficulty}`;
    }
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.response_code !== 0) {
        // Try without category if it fails
        if (selectedCategory !== 'any') {
            url = `${API_URL}?amount=${amount}&difficulty=${selectedDifficulty !== 'any' ? selectedDifficulty : ''}`;
            const res = await fetch(url);
            const dt = await res.json();
            if (dt.response_code === 0) {
                return dt.results.map(q => ({
                    ...q,
                    question: decodeHTML(q.question),
                    correct_answer: decodeHTML(q.correct_answer),
                    incorrect_answers: q.incorrect_answers.map(a => decodeHTML(a))
                }));
            }
        }
        return [];
    }
    
    return data.results.map(q => ({
        ...q,
        question: decodeHTML(q.question),
        correct_answer: decodeHTML(q.correct_answer),
        incorrect_answers: q.incorrect_answers.map(a => decodeHTML(a))
    }));
}

function decodeHTML(html) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
}

function displayQuestion() {
    const question = questions[currentQuestionIndex];
    
    // Update category and difficulty display
    const categoryNames = {
        '9': 'General Knowledge',
        '17': 'Science & Nature',
        '21': 'Sports',
        '23': 'History',
        '11': 'Film',
        '20': 'Music',
        '18': 'Computers',
        '27': 'Animals',
        '22': 'Geography',
        '14': 'Television',
        '15': 'Video Games',
        '25': 'Art'
    };
    
    currentCategoryEl.textContent = categoryNames[selectedCategory] || 'Mixed';
    currentDifficultyEl.textContent = question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1);
    
    // Update progress
    const progress = ((currentQuestionIndex) / questions.length) * 100;
    progressFill.style.width = `${progress}%`;
    currentQuestionEl.textContent = currentQuestionIndex + 1;
    
    // Display question
    gameQuestion.textContent = question.question;
    
    // Shuffle and display options
    const options = [...question.incorrect_answers, question.correct_answer];
    shuffleArray(options);
    
    gameOptions.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];
    
    options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'game-option';
        btn.innerHTML = `
            <span class="option-letter">${letters[index]}</span>
            <span class="option-text">${option}</span>
        `;
        btn.dataset.answer = option;
        btn.addEventListener('click', () => selectAnswer(btn, option, question.correct_answer));
        gameOptions.appendChild(btn);
    });
    
    // Start timer
    startTimer();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startTimer() {
    clearInterval(timerInterval);
    timeLeft = 15;
    timerDisplay.textContent = timeLeft;
    timer.className = 'timer';
    isAnswered = false;
    
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        
        if (timeLeft <= 5) {
            timer.classList.add('danger');
        } else if (timeLeft <= 10) {
            timer.classList.add('warning');
        }
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            if (!isAnswered) {
                timeUp();
            }
        }
    }, 1000);
}

function timeUp() {
    isAnswered = true;
    const question = questions[currentQuestionIndex];
    
    document.querySelectorAll('.game-option').forEach(btn => {
        btn.classList.add('disabled');
        if (btn.dataset.answer === question.correct_answer) {
            btn.classList.add('correct');
        }
    });
    
    QuizoxApp.playSound('wrong');
    
    setTimeout(() => {
        nextQuestion();
    }, 1500);
}

function selectAnswer(btn, selected, correct) {
    if (isAnswered) return;
    
    isAnswered = true;
    clearInterval(timerInterval);
    
    const isCorrect = selected === correct;
    
    document.querySelectorAll('.game-option').forEach(b => {
        b.classList.add('disabled');
        if (b.dataset.answer === correct) {
            b.classList.add('correct');
        }
    });
    
    if (isCorrect) {
        btn.classList.add('correct');
        score++;
        QuizoxApp.playSound('correct');
    } else {
        btn.classList.add('wrong');
        QuizoxApp.playSound('wrong');
    }
    
    setTimeout(() => {
        nextQuestion();
    }, 1500);
}

function nextQuestion() {
    currentQuestionIndex++;
    
    if (currentQuestionIndex < questions.length) {
        displayQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    const percentage = Math.round((score / questions.length) * 100);
    
    // Save score to localStorage for leaderboard
    const user = JSON.parse(localStorage.getItem('quizoxUser') || 'null');
    const scores = JSON.parse(localStorage.getItem('quizoxScores') || '[]');
    
    scores.push({
        score,
        total: questions.length,
        percentage,
        category: selectedCategory,
        difficulty: selectedDifficulty,
        date: new Date().toISOString(),
        playerName: user ? user.name : 'Guest'
    });
    
    localStorage.setItem('quizoxScores', JSON.stringify(scores));
    
    // Build results page
    quizGame.innerHTML = `
        <div class="results-card">
            <div class="results-icon">
                ${percentage >= 80 ? '<i class="fas fa-trophy"></i>' : percentage >= 50 ? '<i class="fas fa-star"></i>' : '<i class="fas fa-brain"></i>'}
            </div>
            <h1>${getResultTitle(percentage)}</h1>
            <p class="message">${getResultMessage(percentage)}</p>
            
            <div class="percentage-circle" style="background: conic-gradient(var(--primary) ${percentage}%, var(--glass) 0%);">
                <span>${percentage}%</span>
            </div>
            
            <div class="results-stats">
                <div class="result-stat">
                    <div class="number">${score}</div>
                    <div class="label">Correct</div>
                </div>
                <div class="result-stat">
                    <div class="number">${questions.length - score}</div>
                    <div class="label">Wrong</div>
                </div>
                <div class="result-stat">
                    <div class="number">${questions.length}</div>
                    <div class="label">Total</div>
                </div>
            </div>
            
            <div class="results-actions">
                <button class="btn btn-primary btn-lg" onclick="location.reload()">
                    <i class="fas fa-redo"></i> Play Again
                </button>
                <a href="leaderboard.html" class="btn btn-outline btn-lg">
                    <i class="fas fa-trophy"></i> View Leaderboard
                </a>
                <button class="btn btn-secondary share-btn" onclick="QuizoxApp.shareScore(${score}, ${questions.length}, ${percentage})">
                    <i class="fas fa-share"></i> Share Score
                </button>
            </div>
        </div>
    `;
    
    QuizoxApp.playSound('complete');
}

function getResultTitle(percentage) {
    if (percentage >= 90) return 'Outstanding!';
    if (percentage >= 80) return 'Excellent!';
    if (percentage >= 70) return 'Great Job!';
    if (percentage >= 50) return 'Good Effort!';
    if (percentage >= 30) return 'Keep Trying!';
    return 'Better Luck Next Time!';
}

function getResultMessage(percentage) {
    if (percentage >= 90) return 'You are a true quiz master! Amazing performance!';
    if (percentage >= 80) return 'Impressive knowledge! You really know your stuff!';
    if (percentage >= 70) return 'Well done! You have solid knowledge in this area.';
    if (percentage >= 50) return 'Not bad! A bit more practice and you\'ll be a pro!';
    if (percentage >= 30) return 'Room for improvement! Keep learning and try again!';
    return 'Don\'t give up! Every quiz is a chance to learn something new.';
}

function showLoading() {
    loading.classList.add('active');
    quizSetup.style.display = 'none';
}

function hideLoading() {
    loading.classList.remove('active');
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    quizSetup.style.display = 'block';
}

function hideError() {
    errorMessage.style.display = 'none';
}
