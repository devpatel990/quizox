# Quizox 🧠

> **Test Your Mind, Anytime**

A modern, feature-rich quiz web application powered by the Open Trivia Database API. Challenge yourself with thousands of trivia questions across multiple categories!

![Quizox Banner](https://img.shields.io/badge/Quizox-Trivia%20App-667eea?style=for-the-badge&logo=quiz&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-green?style=for-the-badge)

---

## ✨ Features

### 🎮 Core Features
- **Unlimited Questions** - Access thousands of trivia questions from Open Trivia Database
- **14 Categories** - General Knowledge, Science, Sports, History, Film, Music, Computers, Animals, Geography, Television, Video Games, Art & more
- **3 Difficulty Levels** - Easy, Medium, Hard
- **5-50 Questions** - Choose how many questions per quiz
- **15-Second Timer** - Race against the clock!
- **Shuffled Answers** - Options are randomized every time

### 🏆 Gamification
- **Global Leaderboard** - Compete with players worldwide
- **Personal Score History** - Track your progress over time
- **Share Your Score** - Show off your results to friends
- **Performance Messages** - Get motivated based on your score

### 🎨 Design
- **Dark/Light Mode** - Toggle between themes
- **Glassmorphism UI** - Modern, premium design
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Smooth Animations** - Beautiful transitions throughout

### 🔐 User System
- **Email Authentication** - Create your account
- **Google Sign-In** - Quick access with Google
- **Persistent Scores** - Your scores are saved locally

### 📄 Legal
- Privacy Policy
- Terms & Conditions
- Cookie Policy
- Cookie Consent Popup

---

## 🚀 Quick Start

### Option 1: Visit Live Site
Simply open in your browser:
```
https://devpatel990.github.io/quizox/
```

### Option 2: Run Locally
1. Clone the repository
```bash
git clone https://github.com/devpatel990/quizox.git
```

2. Open `index.html` in your browser

That's it! No build process required.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | HTML5, CSS3, JavaScript |
| **Styling** | Custom CSS (Glassmorphism) |
| **API** | Open Trivia Database |
| **Fonts** | Google Fonts (Poppins) |
| **Icons** | Font Awesome 6 |
| **Storage** | LocalStorage (Client-side) |
| **Deployment** | GitHub Pages |

---

## 📁 Project Structure

```
quizox/
├── index.html              # Homepage
├── css/
│   └── style.css           # Main stylesheet
├── js/
│   ├── main.js             # Core app functionality
│   └── quiz.js             # Quiz game logic
├── pages/
│   ├── quiz.html           # Quiz page
│   ├── leaderboard.html     # Leaderboard page
│   ├── auth.html           # Login/Signup page
│   ├── contact.html        # Contact & Support page
│   ├── privacy-policy.html # Privacy Policy
│   ├── terms.html          # Terms & Conditions
│   └── cookie-policy.html  # Cookie Policy
└── .github/
    └── workflows/
        └── deploy.yml      # GitHub Actions deployment
```

---

## 🎯 How to Play

1. **Select Category** - Choose from 14 different categories
2. **Pick Difficulty** - Easy, Medium, or Hard
3. **Set Questions** - Choose 5 to 50 questions
4. **Start Quiz** - Click "Start Quiz" to begin
5. **Answer** - Click on your answer before time runs out
6. **See Results** - Get your score and share it!

---

## 🔧 API Reference

Quizox uses the **Open Trivia Database** API:

```
https://opentdb.com/api.php?amount=10&type=multiple&encode=base64
```

### Parameters
| Parameter | Description | Values |
|-----------|-------------|--------|
| `amount` | Number of questions | 1-50 |
| `category` | Category ID | 9, 17, 21, etc. |
| `difficulty` | Question difficulty | easy, medium, hard |
| `type` | Question type | multiple, boolean |
| `encode` | Encoding format | base64, url3986, etc. |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📧 Contact & Support

- **Email:** devmpatel43@gmail.com
- **GitHub:** [devpatel990](https://github.com/devpatel990)
- **Live Site:** https://devpatel990.github.io/quizox/

---

## 📜 License

This project is licensed under the MIT License - see the [Terms & Conditions](pages/terms.html) for details.

---

## 🙏 Acknowledgments

- [Open Trivia Database](https://opentdb.com/) - For providing free trivia questions
- [Font Awesome](https://fontawesome.com/) - For beautiful icons
- [Google Fonts](https://fonts.google.com/) - For the Poppins font

---

<p align="center">
  <strong>Made with ❤️ by <a href="https://github.com/devpatel990">devpatel990</a></strong>
  <br>
  <sub>Test Your Mind, Anytime</sub>
</p>
