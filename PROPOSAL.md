# AI Wellness MVP - Project Proposal

## Executive Summary

AI Wellness MVP is a web-based platform that provides personalized wellness assessments powered by OpenAI GPT-4. Users complete a comprehensive questionnaire covering mental, physical, and emotional wellness dimensions. The AI generates actionable insights and recommendations, with an optional premium tier offering deeper analysis via Stripe payments.

## Problem Statement

Modern wellness guidance is often generic and one-size-fits-all. People struggle to get personalized health recommendations that consider their unique circumstances, lifestyle, and goals. Traditional assessment methods are time-consuming and lack the intelligence to provide meaningful, adaptive feedback.

## Solution

An intelligent wellness platform that:
1. Collects comprehensive user wellness data through an intuitive assessment
2. Leverages AI to generate hyper-personalized insights
3. Provides tiered access to insights (free basic + premium deep-dive)
4. Collects feedback to continuously improve recommendations

## Target Market

- Health-conscious individuals aged 25-55
- Corporate wellness programs
- Health coaches and practitioners
- Fitness enthusiasts seeking data-driven guidance

## Features & Functionality

### Landing Page
- Hero section with value proposition
- Features overview with benefits
- Social proof/testimonials section
- CTA to start assessment
- Pricing preview

### Assessment Page
- Multi-step questionnaire (10-15 questions)
- Categories: Sleep, Nutrition, Exercise, Stress, Mental Health, Lifestyle
- Progress indicator
- Save/resume capability
- Mobile-responsive design

### AI Insights Page
- Personalized wellness score by category
- AI-generated analysis of responses
- Actionable recommendations
- Visual charts/graphs of wellness dimensions
- Export insights as PDF (premium)

### Stripe Payment Integration
- Secure checkout for premium insights
- Multiple pricing tiers ($9.99 basic, $19.99 comprehensive)
- Stripe Elements for card processing
- Webhook handling for subscription management
- Invoice generation

### Feedback System
- Post-insight satisfaction survey
- Star rating for recommendations
- Open-text feedback field
- Thumbs up/down on specific insights
- Data stored in Supabase for analysis

## Technical Architecture

### Frontend (React + Vite)
- React 18 with functional components and hooks
- React Router v6 for navigation
- TailwindCSS for styling
- Axios for API calls
- React Query for server state
- Stripe.js for payments

### Backend (Node.js + Express)
- RESTful API design
- Rate limiting and security middleware
- OpenAI API integration service
- Stripe webhook handlers
- Supabase client for database

### Database Schema (Supabase)

**users**
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| email | VARCHAR | User email |
| created_at | TIMESTAMP | Account creation |
| stripe_customer_id | VARCHAR | Stripe reference |

**assessments**
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to users |
| responses | JSONB | Assessment answers |
| scores | JSONB | Calculated wellness scores |
| created_at | TIMESTAMP | Completion time |

**insights**
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| assessment_id | UUID | Foreign key |
| ai_content | TEXT | Generated insights |
| tier | VARCHAR | free/premium |
| created_at | TIMESTAMP | Generation time |

**feedback**
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| insight_id | UUID | Foreign key |
| rating | INTEGER | 1-5 stars |
| feedback_text | TEXT | User comments |
| created_at | TIMESTAMP | Submission time |

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | User registration |
| POST | /api/auth/login | User login |
| GET | /api/assessment/questions | Get assessment questions |
| POST | /api/assessment/submit | Submit assessment |
| GET | /api/insights/:id | Get insights |
| POST | /api/payment/create-intent | Create Stripe payment |
| POST | /api/payment/webhook | Handle Stripe webhooks |
| POST | /api/feedback | Submit feedback |

## OpenAI Integration

- Model: GPT-4 (fallback to GPT-3.5-turbo for cost)
- Prompt engineering for consistent wellness analysis
- Structured JSON output for parsing
- Rate limiting to control API costs
- Response caching for identical queries

## Stripe Configuration

- Payment Intent flow for one-time purchases
- Customer portal for subscription management
- Webhook events: payment_intent.succeeded, payment_intent.failed
- Idempotent operations for reliability

## Security Considerations

- HTTPS everywhere
- JWT authentication
- Input validation and sanitization
- Rate limiting (100 req/min general, 10 req/min for AI)
- CORS configuration
- Environment variables for secrets
- No sensitive data in logs

## Milestones

1. **Week 1**: Core infrastructure, Supabase setup, authentication
2. **Week 2**: Assessment page with state management
3. **Week 3**: OpenAI integration and insights generation
4. **Week 4**: Stripe payment flow
5. **Week 5**: Feedback system and polishing
6. **Week 6**: Testing, bug fixes, deployment

## Budget Estimate

- Supabase Pro: $25/month
- OpenAI API: $20-50/month (based on usage)
- Stripe: 2.9% + 30¢ per transaction
- Hosting (Vercel/Railway): $0-20/month

## Success Metrics

- Assessment completion rate > 60%
- Payment conversion rate > 10%
- Average session duration > 5 minutes
- Feedback rating > 4.0 stars
- AI insight relevance score > 85%
