import type { Course, Lesson, Enrollment, CourseProgress } from '@/types/course-types'
import { supabase } from '@/lib/supabase'

export const courseService = {
  // Fetches all published courses with pagination using Supabase
  async getCourses(page: number = 1, limit: number = 10): Promise<{ courses: Course[]; pagination: any }> {
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await supabase
      .from('courses')
      .select('*', { count: 'exact' })
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) {
      throw new Error('Failed to fetch courses')
    }

    return {
      courses: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    }
  },

  // Fetches course details by ID using Supabase
  async getCourseById(courseId: string): Promise<Course> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .eq('is_published', true)
      .single()

    if (error || !data) {
      throw new Error('Course not found')
    }

    return data
  },

  // Fetches lessons for a specific course using Supabase
  async getCourseLessons(courseId: string): Promise<Lesson[]> {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', courseId)
      .eq('is_published', true)
      .order('order_index', { ascending: true })

    if (error) {
      throw new Error('Failed to fetch lessons')
    }

    return data || []
  },

  // Enrolls user in a course using Supabase
  async enrollInCourse(courseId: string): Promise<Enrollment> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    const { data, error } = await supabase
      .from('enrollments')
      .insert({
        user_id: user.id,
        course_id: courseId,
        enrolled_at: new Date().toISOString(),
        progress: 0,
        completed_lessons: [],
        last_accessed_at: new Date().toISOString(),
        status: 'active'
      })
      .select()
      .single()

    if (error) {
      throw new Error('Failed to enroll in course')
    }

    return data
  },

  // Gets user's enrolled courses using Supabase
  async getEnrolledCourses(): Promise<Course[]> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    const { data, error } = await supabase
      .from('enrollments')
      .select(`
        *,
        courses (*)
      `)
      .eq('user_id', user.id)
      .eq('status', 'active')

    if (error) {
      throw new Error('Failed to fetch enrolled courses')
    }

    return data?.map(enrollment => enrollment.courses).filter(Boolean) || []
  },

  // Gets user's course progress using Supabase
  async getCourseProgress(courseId: string): Promise<CourseProgress> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    const { data, error } = await supabase
      .from('enrollments')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .single()

    if (error || !data) {
      throw new Error('Enrollment not found')
    }

    // Get total lessons count
    const { count: totalLessons } = await supabase
      .from('lessons')
      .select('*', { count: 'exact', head: true })
      .eq('course_id', courseId)
      .eq('is_published', true)

    return {
      courseId,
      totalLessons: totalLessons || 0,
      completedLessons: data.completed_lessons?.length || 0,
      progressPercentage: data.progress || 0,
      lastAccessedAt: data.last_accessed_at
    }
  },

  // Updates lesson completion status using Supabase
  async markLessonComplete(courseId: string, lessonId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    // Get current enrollment
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('enrollments')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .single()

    if (enrollmentError || !enrollment) {
      throw new Error('Enrollment not found')
    }

    // Add lesson to completed lessons if not already completed
    const completedLessons = enrollment.completed_lessons || []
    if (!completedLessons.includes(lessonId)) {
      completedLessons.push(lessonId)
    }

    // Calculate new progress
    const { count: totalLessons } = await supabase
      .from('lessons')
      .select('*', { count: 'exact', head: true })
      .eq('course_id', courseId)
      .eq('is_published', true)

    const progress = totalLessons ? (completedLessons.length / totalLessons) * 100 : 0

    // Update enrollment
    const { error } = await supabase
      .from('enrollments')
      .update({
        completed_lessons: completedLessons,
        progress: Math.round(progress),
        last_accessed_at: new Date().toISOString()
      })
      .eq('user_id', user.id)
      .eq('course_id', courseId)

    if (error) {
      throw new Error('Failed to mark lesson as complete')
    }
  },

  // Searches courses by query using Supabase
  async searchCourses(query: string, page: number = 1, limit: number = 10): Promise<{ courses: Course[]; pagination: any }> {
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await supabase
      .from('courses')
      .select('*', { count: 'exact' })
      .eq('is_published', true)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) {
      throw new Error('Failed to search courses')
    }

    return {
      courses: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    }
  },

  // Gets courses by category using Supabase
  async getCoursesByCategory(category: string, page: number = 1, limit: number = 10): Promise<{ courses: Course[]; pagination: any }> {
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await supabase
      .from('courses')
      .select('*', { count: 'exact' })
      .eq('is_published', true)
      .eq('category', category)
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) {
      throw new Error('Failed to fetch courses by category')
    }

    return {
      courses: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    }
  },
}
