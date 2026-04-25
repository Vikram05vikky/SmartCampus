# Smart Campus Assistant

An AI-powered study tool built with React + Vite + **Groq AI (Free)**.

## Features
- 📄 Upload study documents (TXT, PDF, Word, PowerPoint)
- 📝 Generate AI summaries of your documents
- 🧠 Auto-generate quizzes with explanations
- 💬 Multi-turn chat across all your uploaded documents

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Get a FREE Groq API key
- Visit https://console.groq.com
- Sign up (completely free, no credit card needed)
- Go to **API Keys** → Create a new key (starts with `gsk_`)

### 3. Start the dev server
```bash
npm run dev
```

### 4. Enter your API key
When the app opens at `http://localhost:5173`, paste your Groq key in the yellow banner.

## File Format Tips
- **TXT files work best** — plain text is read perfectly
- For PDFs: copy-paste the text into a .txt file for best results

## Build for production
```bash
npm run build
```

## Tech Stack
- React 18 + Vite
- Tailwind CSS
- Lucide React icons
- **Groq API** (free) running **LLaMA 3 70B**
