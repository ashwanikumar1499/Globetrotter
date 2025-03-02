# Globetrotter Challenge

![Globetrotter Challenge](public/globetrotter-preview.png)

A geography quiz game that tests your knowledge of world destinations through cryptic clues and challenges.

## 🌍 Overview

Globetrotter Challenge is an interactive web application that tests users' geography knowledge through engaging quizzes about famous destinations around the world. Players are presented with cryptic clues about a location and must guess the correct city from multiple options. The game features a scoring system, user registration, and a unique "Challenge a Friend" feature that allows players to compete with others.

## ✨ Features

### Core Game Features

- **Geography Quiz**: Test your knowledge with cryptic clues about famous destinations
- **Progressive Clue Reveal**: Clues are revealed one by one, with more points awarded for solving with fewer clues
- **Hint System**: Optional hints that provide additional information (with a scoring penalty)
- **Streak Bonuses**: Earn bonus points for consecutive correct answers
- **Fun Facts**: Learn interesting trivia about each destination after answering

### User Features

- **User Registration**: Create a username to track your progress and scores
- **Score Persistence**: Your highest score is saved to your profile
- **Leaderboard**: See how you rank against other players (coming soon)

### Challenge System

- **Create Challenges**: Generate a unique challenge link to send to friends
- **Share Options**: Easily share challenges via WhatsApp or by copying the link
- **Challenge Cards**: Visually appealing challenge cards with your score
- **Target Scores**: Friends must beat your score to win the challenge
- **Challenge Tracking**: Monitor your progress in challenge mode

## 🚀 Technologies Used

### Frontend

- **Next.js 15**: React framework with App Router for routing and API routes
- **TypeScript**: For type-safe code and better developer experience
- **Tailwind CSS**: For responsive and utility-first styling
- **Framer Motion**: For smooth animations and transitions
- **Zustand**: For global state management
- **React Icons**: For UI icons
- **html2canvas**: For generating shareable challenge cards

### Backend

- **MongoDB**: Database for storing user data, challenges, and game questions
- **Mongoose**: ODM for MongoDB interaction
- **Next.js API Routes**: For serverless API endpoints

## 🛠️ Project Structure

```
globetrotter/
├── app/                      # Next.js App Router structure
│   ├── (main)/               # Main application components
│   │   └── components/       # Reusable UI components
│   ├── api/                  # API routes
│   │   ├── challenges/       # Challenge-related endpoints
│   │   ├── game/             # Game-related endpoints
│   │   └── users/            # User-related endpoints
│   ├── challenge/            # Challenge page
│   │   └── [code]/           # Dynamic challenge route
│   ├── lib/                  # Utility functions and models
│   │   ├── models/           # MongoDB models
│   │   ├── store/            # Zustand stores
│   │   ├── types/            # TypeScript type definitions
│   │   └── utils/            # Utility functions
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout component
│   └── page.tsx              # Home page
├── data/                     # Data files
│   └── destinations.json     # Destination data
├── public/                   # Static assets
├── scripts/                  # Utility scripts
│   └── generate-data.js      # Script to generate game data
└── package.json              # Project dependencies
```

## 🔧 Setup and Installation

### Prerequisites

- Node.js 18.17 or later
- MongoDB database (local or Atlas)

### Installation Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/globetrotter.git
   cd globetrotter
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:

   ```
   MONGODB_URI=your_mongodb_connection_string
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   GOOGLE_API_KEY=your-google-api-key  # Optional, for future map features
   ```

   Note: For MongoDB Atlas, your connection string should look like:

   ```
   mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority&appName=YourAppName
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🚀 Deployment and Production Setup

### Preparing for Production

1. Build the application:

   ```bash
   npm run build
   ```

2. Test the production build locally:

   ```bash
   npm start
   ```

### Deployment Options

#### Vercel (Recommended)

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Configure the environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `NEXT_PUBLIC_BASE_URL`: Your production URL (e.g., https://your-app.vercel.app)
   - `GOOGLE_API_KEY`: Your Google API key (if using map features)
4. Deploy the application

#### Other Hosting Providers

For other hosting providers like Netlify, Railway, or a custom server:

1. Build the application: `npm run build`
2. Set up the environment variables
3. Deploy the `out` directory or follow the hosting provider's instructions

### Production Optimizations

1. **Database Indexing**: Ensure proper indexes are set up in MongoDB:

   ```bash
   node scripts/check-db-indexes.js
   ```

2. **Environment Variables**: Double-check all environment variables are correctly set in your production environment

3. **Error Monitoring**: Consider adding an error monitoring service like Sentry

4. **Performance Monitoring**: Set up performance monitoring with tools like Vercel Analytics or Google Analytics

5. **Security Headers**: Configure security headers in your `next.config.ts` file:
   ```typescript
   const nextConfig = {
     // ... other config
     headers: async () => [
       {
         source: "/(.*)",
         headers: [
           {
             key: "X-Content-Type-Options",
             value: "nosniff",
           },
           {
             key: "X-Frame-Options",
             value: "DENY",
           },
           {
             key: "X-XSS-Protection",
             value: "1; mode=block",
           },
         ],
       },
     ],
   };
   ```

## 🎮 How to Play

1. **Start the Game**: Visit the homepage to start playing immediately
2. **Answer Questions**: Read the clues and select the correct city from the options
3. **Earn Points**: Get more points by answering with fewer clues
4. **Create a Challenge**: Enter your username and click "Create Challenge" to generate a challenge link
5. **Share with Friends**: Send the challenge link to friends via WhatsApp or by copying the link
6. **Accept Challenges**: Click on a challenge link to accept and try to beat the challenger's score

## 🧠 Game Mechanics

- **Scoring System**:

  - 3 points for answering with 1 clue
  - 2 points for answering with 2 clues
  - 1 point for answering with 3 clues
  - -1 point penalty for using a hint
  - Streak bonuses: +1 point for every 3 consecutive correct answers

- **Challenge Mode**:
  - Target score is set to the challenger's score + 1
  - Players must achieve at least the target score to win the challenge
  - Current score is displayed alongside the target score

## 🔍 Troubleshooting

### Common Issues

1. **MongoDB Connection Issues**:

   - Verify your connection string in `.env.local`
   - Ensure your IP address is whitelisted in MongoDB Atlas
   - Check for proper username/password in the connection string

2. **API Errors**:

   - Check the browser console and server logs for error messages
   - Verify that all API routes are correctly implemented
   - Ensure MongoDB models match the expected schema

3. **Challenge Creation Issues**:
   - Make sure the username is at least 3 characters
   - Check that the MongoDB connection is working properly
   - Verify that the Challenge model is correctly defined

### Database Maintenance

If you encounter database schema issues, you can use the provided scripts:

```bash
# Check database indexes
node scripts/check-db-indexes.js

# Fix database schema issues
node scripts/clean-db.js
```

## 🔜 Upcoming Features

- **Global Leaderboard**: Compare your scores with players worldwide
- **Achievement System**: Earn badges for reaching milestones
- **Additional Game Modes**: Different types of geography challenges
- **Enhanced Social Sharing**: More options for sharing challenges
- **Mobile App**: Native mobile experience

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributors

- Your Name - Initial work and development

## 🙏 Acknowledgments

- Data sources for geographical information
- Open-source libraries and frameworks used in the project
