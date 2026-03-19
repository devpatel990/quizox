// Main.js - Quizox Main Application

// Theme Management
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
}

themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

initTheme();

// Cookie Consent
const cookiePopup = document.getElementById('cookie-consent');
const acceptBtn = document.getElementById('accept-cookies');
const rejectBtn = document.getElementById('reject-cookies');

function checkCookieConsent() {
    if (!cookiePopup) return;
    const consent = localStorage.getItem('cookieConsent');
    if (consent === null) {
        cookiePopup.classList.remove('hidden');
    }
}

if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        cookiePopup.classList.add('hidden');
    });
}

if (rejectBtn) {
    rejectBtn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'rejected');
        cookiePopup.classList.add('hidden');
    });
}

checkCookieConsent();

// Sound Effects
const soundToggle = document.querySelector('.sound-toggle') || createSoundToggle();
let soundEnabled = localStorage.getItem('soundEnabled') !== 'false';

function createSoundToggle() {
    const btn = document.createElement('button');
    btn.className = 'sound-toggle';
    btn.innerHTML = '<i class="fas fa-volume-up"></i>';
    btn.onclick = toggleSound;
    document.body.appendChild(btn);
    return btn;
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    localStorage.setItem('soundEnabled', soundEnabled);
    updateSoundIcon();
}

function updateSoundIcon() {
    if (!soundToggle) return;
    soundToggle.innerHTML = soundEnabled ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
    soundToggle.classList.toggle('muted', !soundEnabled);
}

updateSoundIcon();

// Audio Context for Sound Effects
let audioContext;

function getAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
}

function playSound(type) {
    if (!soundEnabled) return;
    
    try {
        const ctx = getAudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        if (type === 'correct') {
            oscillator.frequency.value = 523.25;
            gainNode.gain.value = 0.3;
            oscillator.start();
            oscillator.stop(ctx.currentTime + 0.1);
            setTimeout(() => {
                const osc2 = ctx.createOscillator();
                const gain2 = ctx.createGain();
                osc2.connect(gain2);
                gain2.connect(ctx.destination);
                osc2.frequency.value = 659.25;
                gain2.gain.value = 0.3;
                osc2.start();
                osc2.stop(ctx.currentTime + 0.1);
            }, 100);
        } else if (type === 'wrong') {
            oscillator.frequency.value = 200;
            oscillator.type = 'square';
            gainNode.gain.value = 0.2;
            oscillator.start();
            oscillator.stop(ctx.currentTime + 0.3);
        } else if (type === 'tick') {
            oscillator.frequency.value = 800;
            gainNode.gain.value = 0.1;
            oscillator.start();
            oscillator.stop(ctx.currentTime + 0.05);
        } else if (type === 'complete') {
            const notes = [523.25, 659.25, 783.99, 1046.50];
            notes.forEach((freq, i) => {
                setTimeout(() => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.frequency.value = freq;
                    gain.gain.value = 0.2;
                    osc.start();
                    osc.stop(ctx.currentTime + 0.15);
                }, i * 100);
            });
        }
    } catch (e) {
        console.log('Audio not supported');
    }
}

// Auth State
function updateAuthUI() {
    const authLink = document.getElementById('auth-link');
    const mobileAuthLink = document.getElementById('mobile-auth-link');
    const mobileLogout = document.getElementById('mobile-logout');
    
    const user = JSON.parse(localStorage.getItem('quizoxUser') || 'null');
    
    if (user) {
        const displayName = user.name ? user.name.split(' ')[0] : 'Account';
        
        if (authLink) {
            authLink.innerHTML = `<i class="fas fa-user-circle"></i> ${displayName}`;
            authLink.href = '#';
            authLink.onclick = () => {
                if (confirm('Logout?')) {
                    localStorage.removeItem('quizoxUser');
                    updateAuthUI();
                }
            };
        }
        
        if (mobileAuthLink) {
            mobileAuthLink.innerHTML = `<i class="fas fa-user-circle"></i> ${displayName}`;
            mobileAuthLink.href = '#';
            mobileAuthLink.onclick = (e) => {
                e.preventDefault();
                if (confirm('Logout?')) {
                    localStorage.removeItem('quizoxUser');
                    updateAuthUI();
                    location.reload();
                }
            };
        }
        
        if (mobileLogout) {
            mobileLogout.style.display = 'none';
        }
    } else {
        if (authLink) {
            authLink.innerHTML = '<i class="fas fa-user"></i> Login';
            authLink.href = 'pages/auth.html';
            authLink.onclick = null;
        }
        
        if (mobileAuthLink) {
            mobileAuthLink.innerHTML = '<i class="fas fa-user"></i> Login';
            mobileAuthLink.href = 'pages/auth.html';
            mobileAuthLink.onclick = null;
        }
    }
}

updateAuthUI();

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });
}

// Mobile Theme Toggle
const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
if (mobileThemeToggle) {
    mobileThemeToggle.addEventListener('click', () => {
        themeToggle.click();
        const isDark = body.getAttribute('data-theme') === 'dark';
        mobileThemeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i> Light Mode' : '<i class="fas fa-moon"></i> Dark Mode';
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .category-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Share functionality
function shareScore(score, total, percentage) {
    const text = `🧠 I scored ${score}/${total} (${percentage}%) on Quizox! Can you beat me? Test your mind: ${window.location.origin}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Quizox Score',
            text: text,
            url: window.location.origin
        }).catch(() => {});
    } else {
        navigator.clipboard.writeText(text).then(() => {
            alert('Score copied to clipboard!');
        }).catch(() => {});
    }
}

// Export functions for other scripts
window.QuizoxApp = {
    playSound,
    shareScore,
    soundEnabled: () => soundEnabled,
    getUser: () => JSON.parse(localStorage.getItem('quizoxUser') || 'null')
};
