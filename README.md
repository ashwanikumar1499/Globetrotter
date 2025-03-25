# Globetrotter Challenge

A geography quiz game that tests your knowledge of world destinations through cryptic clues and challenges.

## 🌍 Overview

Globetrotter Challenge is an interactive web game where players guess world destinations based on cryptic clues. Features include real-time scoring, friend challenges, and user registration.

## ✨ Key Features

### Game Features

- 2-minute timer for each question
- Progressive clue reveal system
- Score tracking and persistence
- Streak bonuses for consecutive correct answers
- Challenge creation and sharing

### User Features

- Quick username registration
- Score persistence across sessions
- Challenge friends via shareable links
- Real-time score tracking

## 🚀 Technology Stack

### Frontend

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **State Management**: Zustand
- **Styling**:
  - Tailwind CSS
  - Framer Motion for animations
- **UI Components**:
  - Custom Timer Component
  - Animated Feedback Display
  - Progressive Clue Reveal
  - Challenge Cards

### Backend

- **Database**: MongoDB with Mongoose
- **API**: Next.js API Routes
- **Authentication**: Custom user system
- **Data Persistence**: Zustand with localStorage

## 🎮 How to Play

1. **Start Game**

   - Visit the homepage
   - Timer starts automatically (2 minutes per question)
   - Read the clues and select your answer

2. **Scoring System**

   - Base points for correct answers
   - Streak bonuses for consecutive correct answers
   - Time-based scoring
   - Penalty for using hints

3. **Challenge Friends**
   - Click "Create Challenge" button
   - Enter your username (min 3 characters)
   - Share the generated link
   - Friends must beat your score to win

## 🛠️ Setup

1. Clone and install:

```bash
git clone [repository-url]
cd globetrotter
npm install
```

2. Configure environment:

```bash
# .env.local
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

3. Run development server:

```bash
npm run dev
```

## 🔧 Requirements

- Node.js 18.17 or later
- MongoDB database
- Modern web browser

## 📝 License

MIT License
