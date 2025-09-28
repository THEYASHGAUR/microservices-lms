-- Course Service Database Schema for Supabase
-- Enhanced schema for comprehensive course management

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Course Categories table
CREATE TABLE IF NOT EXISTS course_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon_url TEXT,
    color VARCHAR(7) DEFAULT '#3B82F6',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enhanced Courses table
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    instructor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES course_categories(id) ON DELETE SET NULL,
    thumbnail_url TEXT,
    price DECIMAL(10,2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'USD',
    level VARCHAR(20) DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    is_published BOOLEAN DEFAULT false,
    estimated_duration INTEGER DEFAULT 0, -- in hours
    language VARCHAR(10) DEFAULT 'en',
    tags TEXT[] DEFAULT '{}',
    requirements TEXT[] DEFAULT '{}',
    learning_outcomes TEXT[] DEFAULT '{}',
    total_lessons INTEGER DEFAULT 0,
    total_enrollments INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    total_ratings INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enhanced Lessons table
CREATE TABLE IF NOT EXISTS lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT, -- Rich text content
    video_url TEXT,
    video_duration INTEGER DEFAULT 0, -- in seconds
    video_size BIGINT DEFAULT 0, -- in bytes
    thumbnail_url TEXT,
    order_index INTEGER NOT NULL,
    lesson_type VARCHAR(20) DEFAULT 'video' CHECK (lesson_type IN ('video', 'text', 'quiz', 'assignment')),
    is_published BOOLEAN DEFAULT false,
    is_preview BOOLEAN DEFAULT false, -- Free preview lesson
    resources JSONB DEFAULT '[]', -- Additional resources
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enhanced Enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    progress DECIMAL(5,2) DEFAULT 0.00, -- percentage
    completed_lessons UUID[] DEFAULT '{}',
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completion_date TIMESTAMP WITH TIME ZONE,
    certificate_issued BOOLEAN DEFAULT false,
    certificate_url TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped', 'suspended')),
    UNIQUE(user_id, course_id)
);

-- Course Reviews table
CREATE TABLE IF NOT EXISTS course_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    is_verified BOOLEAN DEFAULT false, -- Verified purchase
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, course_id)
);

-- Course Progress table (detailed tracking)
CREATE TABLE IF NOT EXISTS course_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    time_spent INTEGER DEFAULT 0, -- in seconds
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    UNIQUE(user_id, lesson_id)
);

-- Course Wishlist table
CREATE TABLE IF NOT EXISTS course_wishlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, course_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_courses_instructor ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category_id);
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(is_published);
CREATE INDEX IF NOT EXISTS idx_courses_created ON courses(created_at);

CREATE INDEX IF NOT EXISTS idx_lessons_course ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_order ON lessons(course_id, order_index);
CREATE INDEX IF NOT EXISTS idx_lessons_published ON lessons(is_published);

CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON enrollments(status);

CREATE INDEX IF NOT EXISTS idx_reviews_course ON course_reviews(course_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON course_reviews(user_id);

CREATE INDEX IF NOT EXISTS idx_progress_user_course ON course_progress(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_progress_lesson ON course_progress(lesson_id);

CREATE INDEX IF NOT EXISTS idx_wishlist_user ON course_wishlist(user_id);

-- Row Level Security (RLS) Policies
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_wishlist ENABLE ROW LEVEL SECURITY;

-- Courses policies
CREATE POLICY "Anyone can view published courses" ON courses
    FOR SELECT USING (is_published = true);

CREATE POLICY "Instructors can manage their own courses" ON courses
    FOR ALL USING (auth.uid() = instructor_id);

CREATE POLICY "Admins can manage all courses" ON courses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() 
            AND raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Lessons policies
CREATE POLICY "Anyone can view published lessons of published courses" ON lessons
    FOR SELECT USING (
        is_published = true AND 
        EXISTS (SELECT 1 FROM courses WHERE id = course_id AND is_published = true)
    );

CREATE POLICY "Enrolled users can view all lessons" ON lessons
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM enrollments 
            WHERE user_id = auth.uid() AND course_id = lessons.course_id
        )
    );

CREATE POLICY "Instructors can manage lessons of their courses" ON lessons
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM courses 
            WHERE id = course_id AND instructor_id = auth.uid()
        )
    );

-- Enrollments policies
CREATE POLICY "Users can view their own enrollments" ON enrollments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Instructors can view enrollments of their courses" ON enrollments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM courses 
            WHERE id = course_id AND instructor_id = auth.uid()
        )
    );

CREATE POLICY "Users can enroll in courses" ON enrollments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own enrollment progress" ON enrollments
    FOR UPDATE USING (auth.uid() = user_id);

-- Course reviews policies
CREATE POLICY "Anyone can view published reviews" ON course_reviews
    FOR SELECT USING (true);

CREATE POLICY "Users can create reviews for courses they're enrolled in" ON course_reviews
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM enrollments 
            WHERE user_id = auth.uid() AND course_id = course_reviews.course_id
        )
    );

CREATE POLICY "Users can update their own reviews" ON course_reviews
    FOR UPDATE USING (auth.uid() = user_id);

-- Course progress policies
CREATE POLICY "Users can view their own progress" ON course_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON course_progress
    FOR ALL USING (auth.uid() = user_id);

-- Wishlist policies
CREATE POLICY "Users can manage their own wishlist" ON course_wishlist
    FOR ALL USING (auth.uid() = user_id);

-- Insert default categories
INSERT INTO course_categories (name, description, color) VALUES
('Programming', 'Software development and coding courses', '#3B82F6'),
('Design', 'UI/UX, graphic design, and creative courses', '#EF4444'),
('Business', 'Entrepreneurship, marketing, and management', '#10B981'),
('Data Science', 'Analytics, machine learning, and AI', '#8B5CF6'),
('Language', 'Language learning and communication', '#F59E0B'),
('Photography', 'Photography and videography courses', '#EC4899'),
('Music', 'Music production and theory', '#06B6D4'),
('Health', 'Fitness, nutrition, and wellness', '#84CC16')
ON CONFLICT (name) DO NOTHING;
