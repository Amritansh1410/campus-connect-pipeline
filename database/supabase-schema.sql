-- College Attendance System Database Schema
-- This file contains the SQL schema for the Supabase database

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'super-secret-jwt-token';

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'teacher', 'student');
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late');
CREATE TYPE record_status AS ENUM ('active', 'inactive');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.user_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Classes table
CREATE TABLE public.classes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    class_code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    instructor TEXT NOT NULL,
    schedule TEXT NOT NULL,
    room TEXT,
    max_students INTEGER DEFAULT 50,
    status record_status DEFAULT 'active',
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Students table
CREATE TABLE public.students (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    student_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    class_id UUID REFERENCES public.classes(id),
    enrollment_date DATE DEFAULT CURRENT_DATE,
    status record_status DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Attendance records table
CREATE TABLE public.attendance_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status attendance_status NOT NULL,
    marked_by UUID REFERENCES auth.users(id),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure unique attendance record per student per class per date
    UNIQUE(student_id, class_id, date)
);

-- Class enrollments junction table
CREATE TABLE public.class_enrollments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    status record_status DEFAULT 'active',
    
    -- Prevent duplicate enrollments
    UNIQUE(student_id, class_id)
);

-- Attendance sessions table (for tracking when attendance was taken)
CREATE TABLE public.attendance_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    taken_by UUID REFERENCES auth.users(id),
    total_students INTEGER,
    present_count INTEGER,
    absent_count INTEGER,
    late_count INTEGER,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- One session per class per date
    UNIQUE(class_id, date)
);

-- Create indexes for better performance
CREATE INDEX idx_attendance_records_student_id ON public.attendance_records(student_id);
CREATE INDEX idx_attendance_records_class_id ON public.attendance_records(class_id);
CREATE INDEX idx_attendance_records_date ON public.attendance_records(date);
CREATE INDEX idx_attendance_records_status ON public.attendance_records(status);
CREATE INDEX idx_students_class_id ON public.students(class_id);
CREATE INDEX idx_students_status ON public.students(status);
CREATE INDEX idx_classes_status ON public.classes(status);
CREATE INDEX idx_class_enrollments_student_id ON public.class_enrollments(student_id);
CREATE INDEX idx_class_enrollments_class_id ON public.class_enrollments(class_id);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- User profiles: Users can view and update their own profile
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Classes: Everyone can view active classes, only admins/teachers can modify
CREATE POLICY "Anyone can view active classes" ON public.classes
    FOR SELECT USING (status = 'active');

CREATE POLICY "Teachers and admins can insert classes" ON public.classes
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'teacher')
        )
    );

CREATE POLICY "Teachers and admins can update classes" ON public.classes
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'teacher')
        )
    );

-- Students: Everyone can view active students, admins can manage
CREATE POLICY "Anyone can view active students" ON public.students
    FOR SELECT USING (status = 'active');

CREATE POLICY "Admins can manage students" ON public.students
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Attendance records: Teachers can manage, students can view their own
CREATE POLICY "Students can view own attendance" ON public.attendance_records
    FOR SELECT USING (
        student_id IN (
            SELECT id FROM public.students WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Teachers and admins can view all attendance" ON public.attendance_records
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'teacher')
        )
    );

CREATE POLICY "Teachers and admins can manage attendance" ON public.attendance_records
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'teacher')
        )
    );

-- Class enrollments: Students can view their enrollments, admins can manage
CREATE POLICY "Students can view own enrollments" ON public.class_enrollments
    FOR SELECT USING (
        student_id IN (
            SELECT id FROM public.students WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage enrollments" ON public.class_enrollments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Attendance sessions: Teachers and admins can manage
CREATE POLICY "Teachers and admins can manage attendance sessions" ON public.attendance_sessions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'teacher')
        )
    );

-- Functions and triggers for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON public.classes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate attendance statistics
CREATE OR REPLACE FUNCTION get_student_attendance_stats(
    student_uuid UUID,
    start_date DATE DEFAULT NULL,
    end_date DATE DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_classes', COUNT(*),
        'present', COUNT(*) FILTER (WHERE status = 'present'),
        'absent', COUNT(*) FILTER (WHERE status = 'absent'),
        'late', COUNT(*) FILTER (WHERE status = 'late'),
        'attendance_rate', ROUND(
            (COUNT(*) FILTER (WHERE status = 'present')::DECIMAL / NULLIF(COUNT(*), 0)) * 100, 2
        )
    ) INTO result
    FROM public.attendance_records
    WHERE student_id = student_uuid
    AND (start_date IS NULL OR date >= start_date)
    AND (end_date IS NULL OR date <= end_date);
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get class attendance summary
CREATE OR REPLACE FUNCTION get_class_attendance_summary(
    class_uuid UUID,
    attendance_date DATE
)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'date', attendance_date,
        'class_id', class_uuid,
        'total_enrolled', (
            SELECT COUNT(*) FROM public.class_enrollments 
            WHERE class_id = class_uuid AND status = 'active'
        ),
        'total_marked', COUNT(*),
        'present', COUNT(*) FILTER (WHERE status = 'present'),
        'absent', COUNT(*) FILTER (WHERE status = 'absent'),
        'late', COUNT(*) FILTER (WHERE status = 'late'),
        'attendance_rate', ROUND(
            (COUNT(*) FILTER (WHERE status = 'present')::DECIMAL / NULLIF(COUNT(*), 0)) * 100, 2
        )
    ) INTO result
    FROM public.attendance_records
    WHERE class_id = class_uuid
    AND date = attendance_date;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert sample data (for development/testing)
INSERT INTO public.classes (class_code, name, description, instructor, schedule, room) VALUES
    ('CS101', 'Computer Science 101', 'Introduction to Computer Science', 'Dr. Smith', 'Mon/Wed/Fri 09:00-10:00', 'Lab-A1'),
    ('CS201', 'Data Structures', 'Data Structures and Algorithms', 'Prof. Johnson', 'Tue/Thu 11:00-12:30', 'Room-201'),
    ('CS301', 'Advanced Algorithms', 'Advanced Algorithm Design', 'Dr. Davis', 'Mon/Wed 14:00-15:30', 'Lab-B2'),
    ('MATH201', 'Discrete Mathematics', 'Mathematical Foundations', 'Prof. Wilson', 'Tue/Thu/Fri 10:00-11:00', 'Room-102');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;