-- AI Wellness MVP Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    stripe_customer_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assessments table
CREATE TABLE assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    responses JSONB NOT NULL,
    scores JSONB,
    status VARCHAR(50) DEFAULT 'in_progress',
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insights table
CREATE TABLE insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
    ai_content TEXT,
    premium_content TEXT,
    tier VARCHAR(50) DEFAULT 'free',
    scores JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Feedback table
CREATE TABLE feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    insight_id UUID REFERENCES insights(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback_text TEXT,
    helpful BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX idx_assessments_user_id ON assessments(user_id);
CREATE INDEX idx_assessments_created_at ON assessments(created_at DESC);
CREATE INDEX idx_insights_assessment_id ON insights(assessment_id);
CREATE INDEX idx_insights_tier ON insights(tier);
CREATE INDEX idx_feedback_insight_id ON feedback(insight_id);
CREATE INDEX idx_feedback_rating ON feedback(rating);

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Users: Users can only see their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Assessments: Users can only access their own assessments
CREATE POLICY "Users can view own assessments" ON assessments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assessments" ON assessments
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Insights: Public read, authenticated users can manage their own
CREATE POLICY "Anyone can view insights" ON insights
    FOR SELECT USING (true);

CREATE POLICY "Users can insert insights for own assessments" ON insights
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM assessments 
            WHERE assessments.id = insights.assessment_id 
            AND (assessments.user_id = auth.uid() OR assessments.user_id IS NULL)
        )
    );

-- Feedback: Anyone can submit, only view own
CREATE POLICY "Anyone can submit feedback" ON feedback
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own feedback" ON feedback
    FOR SELECT USING (auth.uid() = user_id);

-- Function to calculate wellness scores (called after assessment submission)
CREATE OR REPLACE FUNCTION calculate_wellness_scores(responses JSONB)
RETURNS JSONB AS $$
DECLARE
    scores JSONB := '{}';
BEGIN
    -- Sleep score (weighted 1.5)
    IF responses->>'sleep_hours' IS NOT NULL THEN
        scores := jsonb_set(scores, '{Sleep}', 
            to_jsonb(GREATEST(0, LEAST(100, 
                (responses->>'sleep_hours')::numeric * 12.5
            ))::int)
        );
    END IF;
    
    -- Add more category calculations as needed
    
    RETURN scores;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
