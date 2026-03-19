// Firebase Configuration for Quizox
// SECURITY: For production, use Firebase App Check and restrict API keys
// See: https://firebase.google.com/docs/app-check

// Initialize Firebase
let db = null;

function initFirebase() {
    if (typeof firebase === 'undefined') {
        console.log('Firebase SDK not loaded');
        return false;
    }
    
    const firebaseConfig = {
        // Note: For production, use environment variables or Firebase App Check
        // This is the public config (not the API key)
        apiKey: "AIzaSyBZi9B_y-Va5ADKVic_5kRc4OZEL2O7EUc",
        authDomain: "quizox-f2b39.firebaseapp.com",
        projectId: "quizox-f2b39",
        storageBucket: "quizox-f2b39.firebasestorage.app",
        messagingSenderId: "117459133919",
        appId: "1:117459133919:web:ca28b089ec2d8afe73d06a"
    };
    
    try {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        db = firebase.firestore();
        
        // Enable offline persistence
        db.enablePersistence({ synchronizeTabs: true }).catch((err) => {
            if (err.code === 'failed-precondition') {
                console.log('Multiple tabs open, persistence can only be enabled in one tab at a time.');
            } else if (err.code === 'unimplemented') {
                console.log('The current browser does not support offline persistence.');
            }
        });
        
        console.log('Firebase initialized successfully!');
        return true;
    } catch (error) {
        console.error('Firebase init error:', error);
        return false;
    }
}

function isFirebaseConfigured() {
    return db !== null;
}

async function saveScoreToFirebase(scoreData) {
    if (!db) {
        saveScoreLocally(scoreData);
        return false;
    }
    
    try {
        await db.collection("leaderboard").add({
            playerName: scoreData.playerName,
            userId: scoreData.userId || null,
            score: scoreData.score,
            total: scoreData.total,
            percentage: scoreData.percentage,
            category: scoreData.category,
            difficulty: scoreData.difficulty,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        saveScoreLocally(scoreData);
        return true;
    } catch (error) {
        console.error('Error saving to Firebase:', error);
        saveScoreLocally(scoreData);
        return false;
    }
}

function saveScoreLocally(scoreData) {
    const scores = JSON.parse(localStorage.getItem('quizoxScores') || '[]');
    scores.push(scoreData);
    localStorage.setItem('quizoxScores', JSON.stringify(scores));
}

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
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return null;
    }
}

initFirebase();

window.QuizoxFirebase = {
    initFirebase,
    isFirebaseConfigured,
    saveScoreToFirebase,
    getLeaderboardFromFirebase,
    saveScoreLocally
};
