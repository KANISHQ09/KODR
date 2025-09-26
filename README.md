# Kodr – AI-Powered Coding & Tech Learning Platform

**Kodr** is an AI-driven learning platform designed to help learners understand programming concepts step-by-step, practice coding, track their progress, and contribute to open-source projects. The platform integrates an AI tutor (via Lyzr AI agent) for interactive coding guidance, multi-language quizzes, gamification, and project collaboration.

---

## **Features**

### **1. Coding Playground**

* Interactive in-browser IDE for coding practice.
* AI-powered tutor explains code **line-by-line**, provides **context**, and asks **interactive questions**.
* Generates **custom practice problems** and gives **hints/corrections**.
* Adaptive learning levels: **Beginner, Intermediate, Advanced**.

### **2. Quizzes & Gamification**

* Multi-language quizzes (Python, JavaScript, C++, etc.).
* 5 questions per language per session.
* Swipe-based answer system for mobile.
* Points, badges, and streak tracking for gamification.

### **3. Performance Analytics**

* Tracks coding playground activity and quiz results.
* Visualizes progress, weak topics, and improvement metrics.
* Personalized dashboard for learners.

### **4. Projects Section**

* Curated open-source projects for contribution.
* Displays tasks, required skills, and repo links.
* Users can mark tasks as completed to track contributions.

### **5. User Authentication & Profile**

* Register/Login via Email, Google, or GitHub.
* Email verification during registration.
* Profile management: edit name, bio, skills, profile picture.
* GitHub username links directly to user’s GitHub profile
* Logout functionality.

### **6. Dashboard**

* Central hub for progress, quizzes, coding playground, and projects.
* Shows user stats, ongoing projects, and achievements.

---

## **Technologies Used**

* **Frontend**: React / Next.js, Tailwind CSS
* **Backend**: Node.js, Express
* **Database**: MongoDB
* **AI Integration**: Lyzr AI agent JSON API
* **Authentication**: OAuth (Google/GitHub) + Email/Password
* **Other**: Charts for analytics, gamification logic, responsive design

---

## **AI Agent Integration**

Kodr integrates the **AI agent** for coding guidance:

```json
{
  "_id": "68d668c7cd09ec05ae9f5213",
  "api_key": "sk-default-vaeODYHab23xkcK86nfzePj729EUooSp",
  "template_type": "single_task",
  "name": "Kodr",
  "description": "AI-powered coding mentor for step-by-step explanations and practice questions",
  "agent_role": "You are an expert coding tutor.",
  "agent_instructions": "Explain code line-by-line, provide context, ask questions, generate practice problems, give hints, adapt to skill level.",
  "agent_goal": "Teach programming concepts clearly, generate practice questions, and adapt explanations to learner's level.",
  "response_format": "JSON"
}
```

---

## **Installation & Setup**

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/kodr.git
cd kodr
```

2. **Install dependencies**

```bash
npm install
```

3. **Setup environment variables**

* `MONGO_URI` – MongoDB connection string
* `LYZR_API_KEY` – Your Lyzr AI agent API key
* `JWT_SECRET` – Secret key for authentication

4. **Run the application**

```bash
npm run dev
```

5. **Open in browser**

```
http://localhost:3000
```

---

## **Project Structure**

```
/frontend       # React/Next.js frontend
/backend        # Node.js/Express backend
/models         # MongoDB schemas
/routes         # API routes (auth, projects, quizzes, playground)
/components     # Reusable UI components
/utils          # Helper functions and AI integration
```

---

## **Usage**

1. Register/login via email or OAuth.
2. Explore the **Dashboard**.
3. Use the **Coding Playground** to learn new programming concepts.
4. Take **Quizzes** to test knowledge and earn badges.
5. Contribute to **Open-Source Projects**.
6. Track your progress with **Performance Analytics**.

---

## **Contributing**

* Fork the repository.
* Create a feature branch (`git checkout -b feature-name`).
* Commit your changes (`git commit -m "Feature: Description"`).
* Push to the branch (`git push origin feature-name`).
* Open a Pull Request.

---

## **License**

MIT License – See `LICENSE` file for details.

---
