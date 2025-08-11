# HealthVitals-AI 🩺🤖

**HealthVitals-AI** is an intelligent, AI-powered medical assistant app that helps users monitor, understand, and improve their health.  
It combines conversational AI, smart symptom scanning, and daily health check-ins to provide actionable health insights, tailored recommendations, and downloadable health reports.

---

## 🚀 Features

### 🔹 User Authentication
- **Secure Login & Signup**
- Store and manage basic personal health data: height, weight, age, and more.

### 🔹 AI Health Chatbot
- Chat about any **health-related problems**.
- AI asks **follow-up questions** based on your inputs.
- Generates a **diagnostic summary** with:
  - Possible health condition
  - Recommended actions
  - Guidance for next steps

### 🔹 **SymptoScan™**
- A detailed health & mental well-being questionnaire.
- Covers multiple areas:
  - Physical health
  - Mental health
  - Lifestyle & habits
- Produces a **comprehensive, downloadable health report** with:
  - **Health Score** (1–10)
  - Key health insights
  - Personalized **meal recommendations**
  - **Medicine suggestions** (general, non-prescription)
  - Actionable steps for improvement

### 🔹 **Daily Health Check-In**
- Once every 24 hours, the app asks quick health questions.
- Tracks changes in health trends over time.

---

## 📊 How It Works

1. **Login / Signup**
   - Enter basic personal details (height, weight, etc.).

2. **Chat with AI**
   - Describe symptoms or ask health-related questions.
   - AI follows up with relevant queries to gather more context.
   - Receive a **summary or report** of the potential issue.

3. **SymptoScan™**
   - Complete a series of structured questions.
   - Get a **personalized health score** and tailored advice.

4. **Daily Questions**
   - Simple daily prompts to track your health trends.

---

## 🛠 Tech Stack

- **Frontend**: React Native (Mobile App)
- **Backend**: Node.js + Express
- **AI Engine**: Google Gemini API
- **Database**: (e.g., MongoDB / Firebase — specify your choice)
- **Auth**: JWT-based authentication
- **Report Generation**: PDF downloads with health insights

---

## 📥 Installation & Setup

```bash
# Clone the repo
git clone https://github.com/yourusername/healthvitals-ai.git
cd healthvitals-ai

# Install dependencies
npm install

# Create a .env file in the root and add:
GOOGLE_API_KEY=your_google_api_key
PORT=5000

# Start the backend server
npm run dev
