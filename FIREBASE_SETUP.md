# Firebase Security Setup Guide

## Step 1: Regenerate Your API Key

1. Go to: https://console.cloud.google.com/apis/credentials
2. Find your API key (Web API key 1)
3. Click the **delete icon** 🗑️
4. Click **"Create Credentials"** → **"API key"**
5. Copy the new key

## Step 2: Add API Key Restrictions

1. In Google Cloud Console, click on your new API key
2. **Website restrictions**: 
   - Select "HTTP referrers"
   - Add: `devpatel990.github.io/*`
3. **API restrictions**:
   - Select "Restrict key"
   - Check: `Firebase Firestore API`
4. Click **Save**

## Step 3: Set Firestore Security Rules

**Option A - Using Firebase Console (Easiest):**

1. Go to: https://console.firebase.google.com/project/quizox-f2b39/firestore
2. Click **"Rules"** tab
3. Replace all content with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /leaderboard/{document} {
      allow read: if true;
      allow create: if request.resource.data.keys().hasAll([
        'playerName', 'score', 'total', 'percentage', 'category', 'difficulty'
      ])
      && request.resource.data.score is int
      && request.resource.data.total is int
      && request.resource.data.percentage is int
      && request.resource.data.percentage >= 0
      && request.resource.data.percentage <= 100;
      allow update, delete: if false;
    }
  }
}
```

4. Click **"Publish"**

**Option B - Using Firebase CLI:**

```bash
npm install -g firebase-tools
firebase login
firebase init firestore
# Select your project and follow prompts
firebase deploy
```

## Step 4: Update Your Code (Already Done!)

I've already updated `firebase.js` with:
- Removed measurementId (not needed)
- Added offline persistence support
- Improved error handling

## Step 5: Push to GitHub

```bash
git add .
git commit -m "Add Firebase security configuration"
git push
```

## Step 6: Verify Everything Works

1. Go to: https://devpatel990.github.io/quizox/
2. Play a quiz
3. Go to Leaderboard page
4. Your score should appear!

## Security Summary

| Setting | Value |
|---------|-------|
| API Key Restricted To | `devpatel990.github.io/*` |
| Allowed APIs | Firebase Firestore API only |
| Firestore Rules | Public read, validated writes |

---

**Need Help?**
- Firebase Docs: https://firebase.google.com/docs/firestore/security/get-started
- GitHub Issues: https://github.com/devpatel990/quizox/issues
