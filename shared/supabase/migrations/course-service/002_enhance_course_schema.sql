-- =====================================================
-- COURSE SERVICE ENHANCED SCHEMA MIGRATION
-- =====================================================
-- This migration enhances the course service schema with proper
-- naming conventions, improved RLS policies, and additional functionality

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- 1. COURSE CATEGORIES TABLE (Enhanced)
-- =====================================================
-- Drop existing table if it exists and recreate with proper structure
DROP TABLE IF EXISTS course_categories CASCADE;

CREATE TABLE course_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon_url TEXT,
    color VARCHAR(7) DEFAULT '#3B82F6',
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 2. COURSES TABLE (Enhanced)
-- =====================================================
-- Drop existing table if it exists and recreate with proper structure
DROP TABLE IF EXISTS courses CASCADE;

CREATE TABLE courses (
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

-- =====================================================
-- 3. LESSONS TABLE (Enhanced)
-- =====================================================
-- Drop existing table if it exists and recreate with proper structure
DROP TABLE IF EXISTS lessons CASCADE;

CREATE TABLE lessons (
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

-- =====================================================
-- 4. ENROLLMENTS TABLE (Enhanced)
-- =====================================================
-- Drop existing table if it exists and recreate with proper structure
DROP TABLE IF EXISTS enrollments CASCADE;

CREATE TABLE enrollments (
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

-- =====================================================
-- 5. COURSE REVIEWS TABLE (Enhanced)
-- =====================================================
-- Drop existing table if it exists and recreate with proper structure
DROP TABLE IF EXISTS course_reviews CASCADE;

CREATE TABLE course_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    is_verified BOOLEAN DEFAULT false, -- Verified purchase
    is_approved BOOLEAN DEFAULT true, -- Admin approval
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, course_id)
);

-- =====================================================
-- 6. COURSE PROGRESS TABLE (Enhanced)
-- =====================================================
-- Drop existing table if it exists and recreate with proper structure
DROP TABLE IF EXISTS course_progress CASCADE;

CREATE TABLE course_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    time_spent INTEGER DEFAULT 0, -- in seconds
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    UNIQUE(user_id, lesson_id)
);

-- =====================================================
-- 7. COURSE WISHLIST TABLE (Enhanced)
-- =====================================================
-- Drop existing table if it exists and recreate with proper structure
DROP TABLE IF EXISTS course_wishlist CASCADE;

CREATE TABLE course_wishlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, course_id)
);

-- =====================================================
-- 8. COURSE ANALYTICS TABLE (New)
-- =====================================================
CREATE TABLE course_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    views INTEGER DEFAULT 0,
    enrollments INTEGER DEFAULT 0,
    completions INTEGER DEFAULT 0,
    revenue DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(course_id, date)
);

-- =====================================================
-- 9. COURSE NOTIFICATIONS TABLE (New)
-- =====================================================
CREATE TABLE course_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'enrollment', 'completion', 'reminder', etc.
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- PERFORMANCE INDEXES
-- =====================================================

-- Course Categories indexes
CREATE INDEX IF NOT EXISTS idx_course_categories_active ON course_categories(is_active);
CREATE INDEX IF NOT EXISTS idx_course_categories_sort ON course_categories(sort_order);

-- Courses indexes
CREATE INDEX IF NOT EXISTS idx_courses_instructor ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category_id);
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(is_published);
CREATE INDEX IF NOT EXISTS idx_courses_created ON courses(created_at);
CREATE INDEX IF NOT EXISTS idx_courses_level ON courses(level);
CREATE INDEX IF NOT EXISTS idx_courses_price ON courses(price);

-- Lessons indexes
CREATE INDEX IF NOT EXISTS idx_lessons_course ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_order ON lessons(course_id, order_index);
CREATE INDEX IF NOT EXISTS idx_lessons_published ON lessons(is_published);
CREATE INDEX IF NOT EXISTS idx_lessons_type ON lessons(lesson_type);

-- Enrollments indexes
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON enrollments(status);
CREATE INDEX IF NOT EXISTS idx_enrollments_enrolled_at ON enrollments(enrolled_at);

-- Course Reviews indexes
CREATE INDEX IF NOT EXISTS idx_reviews_course ON course_reviews(course_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON course_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON course_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON course_reviews(is_approved);

-- Course Progress indexes
CREATE INDEX IF NOT EXISTS idx_progress_user_course ON course_progress(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_progress_lesson ON course_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_progress_completed ON course_progress(completed_at);

-- Course Wishlist indexes
CREATE INDEX IF NOT EXISTS idx_wishlist_user ON course_wishlist(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_course ON course_wishlist(course_id);

-- Course Analytics indexes
CREATE INDEX IF NOT EXISTS idx_analytics_course ON course_analytics(course_id);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON course_analytics(date);

-- Course Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user ON course_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_course ON course_notifications(course_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON course_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON course_notifications(type);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE course_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_notifications ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- COURSE CATEGORIES POLICIES
-- =====================================================
-- Anyone can view active categories
CREATE POLICY "Anyone can view active categories" ON course_categories
    FOR SELECT USING (is_active = true);

-- Admins can manage categories
CREATE POLICY "Admins can manage categories" ON course_categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- =====================================================
-- COURSES POLICIES
-- =====================================================
-- Anyone can view published courses
CREATE POLICY "Anyone can view published courses" ON courses
    FOR SELECT USING (is_published = true);

-- Instructors can manage their own courses
CREATE POLICY "Instructors can manage their own courses" ON courses
    FOR ALL USING (auth.uid() = instructor_id);

-- Admins can manage all courses
CREATE POLICY "Admins can manage all courses" ON courses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- =====================================================
-- LESSONS POLICIES
-- =====================================================
-- Anyone can view published lessons of published courses
CREATE POLICY "Anyone can view published lessons" ON lessons
    FOR SELECT USING (
        is_published = true AND 
        EXISTS (SELECT 1 FROM courses WHERE id = course_id AND is_published = true)
    );

-- Enrolled users can view all lessons of their courses
CREATE POLICY "Enrolled users can view all lessons" ON lessons
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM enrollments 
            WHERE user_id = auth.uid() AND course_id = lessons.course_id
        )
    );

-- Instructors can manage lessons of their courses
CREATE POLICY "Instructors can manage lessons of their courses" ON lessons
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM courses 
            WHERE id = course_id AND instructor_id = auth.uid()
        )
    );

-- =====================================================
-- ENROLLMENTS POLICIES
-- =====================================================
-- Users can view their own enrollments
CREATE POLICY "Users can view their own enrollments" ON enrollments
    FOR SELECT USING (auth.uid() = user_id);

-- Instructors can view enrollments of their courses
CREATE POLICY "Instructors can view enrollments of their courses" ON enrollments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM courses 
            WHERE id = course_id AND instructor_id = auth.uid()
        )
    );

-- Users can enroll in courses
CREATE POLICY "Users can enroll in courses" ON enrollments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own enrollment progress
CREATE POLICY "Users can update their own enrollment progress" ON enrollments
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can unenroll from courses
CREATE POLICY "Users can unenroll from courses" ON enrollments
    FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- COURSE REVIEWS POLICIES
-- =====================================================
-- Anyone can view approved reviews
CREATE POLICY "Anyone can view approved reviews" ON course_reviews
    FOR SELECT USING (is_approved = true);

-- Users can create reviews for courses they're enrolled in
CREATE POLICY "Users can create reviews for enrolled courses" ON course_reviews
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM enrollments 
            WHERE user_id = auth.uid() AND course_id = course_reviews.course_id
        )
    );

-- Users can update their own reviews
CREATE POLICY "Users can update their own reviews" ON course_reviews
    FOR UPDATE USING (auth.uid() = user_id);

-- Admins can manage all reviews
CREATE POLICY "Admins can manage all reviews" ON course_reviews
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- =====================================================
-- COURSE PROGRESS POLICIES
-- =====================================================
-- Users can view their own progress
CREATE POLICY "Users can view their own progress" ON course_progress
    FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own progress
CREATE POLICY "Users can update their own progress" ON course_progress
    FOR ALL USING (auth.uid() = user_id);

-- Instructors can view progress of their students
CREATE POLICY "Instructors can view student progress" ON course_progress
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM courses 
            WHERE id = course_id AND instructor_id = auth.uid()
        )
    );

-- =====================================================
-- COURSE WISHLIST POLICIES
-- =====================================================
-- Users can manage their own wishlist
CREATE POLICY "Users can manage their own wishlist" ON course_wishlist
    FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- COURSE ANALYTICS POLICIES
-- =====================================================
-- Instructors can view analytics of their courses
CREATE POLICY "Instructors can view their course analytics" ON course_analytics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM courses 
            WHERE id = course_id AND instructor_id = auth.uid()
        )
    );

-- Admins can view all analytics
CREATE POLICY "Admins can view all analytics" ON course_analytics
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- =====================================================
-- COURSE NOTIFICATIONS POLICIES
-- =====================================================
-- Users can view their own notifications
CREATE POLICY "Users can view their own notifications" ON course_notifications
    FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own notifications
CREATE POLICY "Users can update their own notifications" ON course_notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- System can create notifications
CREATE POLICY "System can create notifications" ON course_notifications
    FOR INSERT WITH CHECK (true);

-- =====================================================
-- UTILITY FUNCTIONS
-- =====================================================

-- Function to update course enrollment count
CREATE OR REPLACE FUNCTION increment_course_enrollments(course_id UUID, increment_value INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE courses 
    SET total_enrollments = total_enrollments + increment_value,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = course_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update course lesson count
CREATE OR REPLACE FUNCTION increment_course_lessons(course_id UUID, increment_value INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE courses 
    SET total_lessons = total_lessons + increment_value,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = course_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update course rating
CREATE OR REPLACE FUNCTION update_course_rating(course_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE courses 
    SET average_rating = (
        SELECT COALESCE(AVG(rating), 0) 
        FROM course_reviews 
        WHERE course_id = courses.id AND is_approved = true
    ),
    total_ratings = (
        SELECT COUNT(*) 
        FROM course_reviews 
        WHERE course_id = courses.id AND is_approved = true
    ),
    updated_at = CURRENT_TIMESTAMP
    WHERE id = course_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate course progress
CREATE OR REPLACE FUNCTION calculate_course_progress(user_id UUID, course_id UUID)
RETURNS DECIMAL AS $$
DECLARE
    total_lessons INTEGER;
    completed_lessons INTEGER;
    progress_percentage DECIMAL;
BEGIN
    -- Get total lessons in course
    SELECT COUNT(*) INTO total_lessons
    FROM lessons 
    WHERE course_id = calculate_course_progress.course_id AND is_published = true;
    
    -- Get completed lessons for user
    SELECT COUNT(*) INTO completed_lessons
    FROM course_progress 
    WHERE user_id = calculate_course_progress.user_id 
    AND course_id = calculate_course_progress.course_id 
    AND progress_percentage = 100;
    
    -- Calculate percentage
    IF total_lessons > 0 THEN
        progress_percentage := (completed_lessons::DECIMAL / total_lessons::DECIMAL) * 100;
    ELSE
        progress_percentage := 0;
    END IF;
    
    RETURN progress_percentage;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger to update course enrollment count
CREATE OR REPLACE FUNCTION trigger_update_course_enrollments()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        PERFORM increment_course_enrollments(NEW.course_id, 1);
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        PERFORM increment_course_enrollments(OLD.course_id, -1);
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_enrollments_count
    AFTER INSERT OR DELETE ON enrollments
    FOR EACH ROW EXECUTE FUNCTION trigger_update_course_enrollments();

-- Trigger to update course lesson count
CREATE OR REPLACE FUNCTION trigger_update_course_lessons()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        PERFORM increment_course_lessons(NEW.course_id, 1);
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        PERFORM increment_course_lessons(OLD.course_id, -1);
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_lessons_count
    AFTER INSERT OR DELETE ON lessons
    FOR EACH ROW EXECUTE FUNCTION trigger_update_course_lessons();

-- Trigger to update course rating
CREATE OR REPLACE FUNCTION trigger_update_course_rating()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        PERFORM update_course_rating(NEW.course_id);
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        PERFORM update_course_rating(OLD.course_id);
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_course_rating
    AFTER INSERT OR UPDATE OR DELETE ON course_reviews
    FOR EACH ROW EXECUTE FUNCTION trigger_update_course_rating();

-- Trigger to update enrollment progress
CREATE OR REPLACE FUNCTION trigger_update_enrollment_progress()
RETURNS TRIGGER AS $$
DECLARE
    new_progress DECIMAL;
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        SELECT calculate_course_progress(NEW.user_id, NEW.course_id) INTO new_progress;
        
        UPDATE enrollments 
        SET progress = new_progress,
            last_accessed_at = CURRENT_TIMESTAMP
        WHERE user_id = NEW.user_id AND course_id = NEW.course_id;
        
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_enrollment_progress
    AFTER INSERT OR UPDATE ON course_progress
    FOR EACH ROW EXECUTE FUNCTION trigger_update_enrollment_progress();

-- =====================================================
-- SAMPLE DATA
-- =====================================================

-- Insert default categories
INSERT INTO course_categories (name, description, color, sort_order) VALUES
('Programming', 'Software development and coding courses', '#3B82F6', 1),
('Design', 'UI/UX, graphic design, and creative courses', '#EF4444', 2),
('Business', 'Entrepreneurship, marketing, and management', '#10B981', 3),
('Data Science', 'Analytics, machine learning, and AI', '#8B5CF6', 4),
('Language', 'Language learning and communication', '#F59E0B', 5),
('Photography', 'Photography and videography courses', '#EC4899', 6),
('Music', 'Music production and theory', '#06B6D4', 7),
('Health', 'Fitness, nutrition, and wellness', '#84CC16', 8)
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Grant permissions to service role
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO service_role;
