// Firebase Configuration for Quizox
// Using Firebase Compat SDK for browser use

// Initialize Firebase
let db = null;

function initFirebase() {
    if (typeof firebase === 'undefined') {
        console.log('Firebase SDK not loaded');
        return false;
    }
    
    const firebaseConfig = {
        apiKey: "AIzaSyBZi9B_y-Va5ADKVic_5kRc4OZEL2O7EUc",
        authDomain: "quizox-f2b39.firebaseapp.com",
        projectId: "quizox-f2b39",
        storageBucket: "quizox-f2b39.firebasestorage.app",
        messagingSenderId: "117459133919",
        appId: "1:117459133919:web:ca28b089ec2d8afe73d06a",
        measurementId: "G-3S3FS2PPZP"
    };
    
    try {
        // Initialize Firebase app
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        
        // Initialize Firestore
        db = firebase.firestore();
        console.log('Firebase initialized successfully!');
        return true;
    } catch (error) {
        console.error('Firebase init error:', error);
        return false;
    }
}

// Check if Firebase is configured
function isFirebaseConfigured() {
    return db !== null;
}

// Save score to Firebase
async function saveScoreToFirebase(scoreData) {
    if (!db) {
        console.log('Firebase not initialized, saving to localStorage only');
        saveScoreLocally(scoreData);
        return false;
    }
    
    try {
        await db.collection("leaderboard").add({
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
        console.log('Score saved to Firebase!');
        return true;
    } catch (error) {
        console.error('Error saving to Firebase:', error);
        // Fallback to localStorage
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
    if (!db) {
        return null;
    }
    
    try {
        const snapshot = await db.collection("leaderboard")
            .orderBy("percentage", "desc")
            .limit(limitCount)
            .get();
        
        if (snapshot.empty) {
            return [];
        }
        
        return snapshot.docs.map((doc, index) => ({
            id: doc.id,
            rank: index + 1,
            playerName: doc.data().playerName,
            score: doc.data().score,
            total: doc.data().total,
            percentage: doc.data().percentage,
            category: doc.data().category,
            difficulty: doc.data().difficulty,
            timestamp: doc.data().timestamp
        }));
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return null;
    }
}

// Auto-initialize on load
initFirebase();

// Export functions
window.QuizoxFirebase = {
    initFirebase,
    isFirebaseConfigured,
    saveScoreToFirebase,
    getLeaderboardFromFirebase,
    saveScoreLocally
};
