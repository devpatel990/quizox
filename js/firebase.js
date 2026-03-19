// Firebase Configuration for Quizox
// To set up Firebase for your own project:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project
// 3. Add a Web App to get your config
// 4. Enable Firestore Database
// 5. Set rules to allow read/write (for demo purposes)
// 6. Replace the config below with your own

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
let app, db, auth;

function initFirebase() {
    // Check if already initialized
    if (typeof firebase !== 'undefined' && app) {
        return true;
    }
    
    // Check if Firebase SDK is loaded
    if (typeof firebase === 'undefined') {
        console.log('Firebase SDK not loaded');
        return false;
    }
    
    try {
        // Initialize Firebase
        app = firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        auth = firebase.auth();
        return true;
    } catch (error) {
        console.error('Firebase init error:', error);
        return false;
    }
}

// Check if Firebase is configured
function isFirebaseConfigured() {
    return firebaseConfig.apiKey !== "YOUR_API_KEY";
}

// Save score to Firebase
async function saveScoreToFirebase(scoreData) {
    if (!initFirebase() || !isFirebaseConfigured()) {
        console.log('Firebase not configured, saving to localStorage only');
        saveScoreLocally(scoreData);
        return false;
    }
    
    try {
        await db.collection('leaderboard').add({
            playerName: scoreData.playerName,
            score: scoreData.score,
            total: scoreData.total,
            percentage: scoreData.percentage,
            category: scoreData.category,
            difficulty: scoreData.difficulty,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Also save locally
        saveScoreLocally(scoreData);
        return true;
    } catch (error) {
        console.error('Error saving score:', error);
        saveScoreLocally(scoreData);
        return false;
    }
}

// Save to localStorage as backup
function saveScoreLocally(scoreData) {
    const scores = JSON.parse(localStorage.getItem('quizoxScores') || '[]');
    scores.push(scoreData);
    localStorage.setItem('quizoxScores', JSON.stringify(scores));
}

// Get top scores from Firebase
async function getLeaderboardFromFirebase(limitCount = 50) {
    if (!initFirebase() || !isFirebaseConfigured()) {
        return null;
    }
    
    try {
        const snapshot = await db.collection('leaderboard')
            .orderBy('percentage', 'desc')
            .orderBy('timestamp', 'desc')
            .limit(limitCount)
            .get();
        
        return snapshot.docs.map((doc, index) => ({
            id: doc.id,
            rank: index + 1,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return null;
    }
}

// Export functions
window.QuizoxFirebase = {
    initFirebase,
    isFirebaseConfigured,
    saveScoreToFirebase,
    getLeaderboardFromFirebase,
    saveScoreLocally
};
