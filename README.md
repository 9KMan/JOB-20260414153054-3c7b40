# AI Wellness MVP

A comprehensive wellness assessment platform that uses AI to provide personalized health insights.

## Tech Stack

- **Frontend**: React 18 + Vite, React Router, TailwindCSS
- **Backend**: Node.js + Express
- **AI**: OpenAI GPT-4
- **Payments**: Stripe
- **Database**: Supabase (PostgreSQL)

## Features

- Landing page with service overview
- Interactive wellness assessment questionnaire
- AI-powered personalized insights generation
- Stripe payment integration for premium insights
- Feedback collection system

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- OpenAI API key
- Stripe account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   cd client && npm install
   cd server && npm install
   ```

3. Configure environment variables (see .env.example)

4. Start development servers:
   ```bash
   # Terminal 1
   cd client && npm run dev
   
   # Terminal 2
   cd server && npm run dev
   ```

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── utils/         # Utility functions
├── server/                # Express backend
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   └── models/           # Data models
├── supabase/             # Database schema & migrations
└── PROPOSAL.md           # Project proposal
