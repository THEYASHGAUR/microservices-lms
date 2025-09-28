import { supabase } from '../config/supabase'
import { 
  Course, 
  CourseCategory, 
  Lesson, 
  Enrollment, 
  CourseReview, 
  CourseProgress,
  CourseWishlist,
  CreateCourseRequest,
  UpdateCourseRequest,
  CreateLessonRequest,
  UpdateLessonRequest,
  CourseStats,
  CourseWithDetails
} from '../models/course.model'

export class CourseService {
  // Fetches all published courses with pagination and filters
  async getCourses(filters: {
    category?: string
    level?: string
    search?: string
    page?: number
    limit?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  } = {}): Promise<{ courses: CourseWithDetails[], total: number }> {
    const { category, level, search, page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = filters
    
    let query = supabase
      .from('courses')
      .select(`
        *,
        instructor:instructor_id (
          id,
          raw_user_meta_data->first_name,
          raw_user_meta_data->last_name,
          raw_user_meta_data->avatar_url
        ),
        category:category_id (
          id,
          name,
          color
        )
      `)
      .eq('is_published', true)
      .order(sortBy, { ascending: sortOrder === 'asc' })

    if (category) {
      query = query.eq('category_id', category)
    }

    if (level) {
      query = query.eq('level', level)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const { data, error, count } = await query
      .range((page - 1) * limit, page * limit - 1)
      .limit(limit)

    if (error) throw error

    return {
      courses: data || [],
      total: count || 0
    }
  }

  // Fetches courses for a specific instructor
  async getInstructorCourses(instructorId: string): Promise<CourseWithDetails[]> {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        category:category_id (
          id,
          name,
          color
        )
      `)
      .eq('instructor_id', instructorId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Fetches a single course with all details
  async getCourseById(courseId: string, userId?: string): Promise<CourseWithDetails | null> {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        instructor:instructor_id (
          id,
          raw_user_meta_data->first_name,
          raw_user_meta_data->last_name,
          raw_user_meta_data->avatar_url
        ),
        category:category_id (
          id,
          name,
          color
        ),
        lessons (
          *
        ),
        course_reviews (
          *,
          user:user_id (
            id,
            raw_user_meta_data->first_name,
            raw_user_meta_data->last_name,
            raw_user_meta_data->avatar_url
          )
        )
      `)
      .eq('id', courseId)
      .single()

    if (error) throw error
    if (!data) return null

    // Get user enrollment if userId provided
    let userEnrollment = null
    if (userId) {
      const { data: enrollment } = await supabase
        .from('enrollments')
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .single()
      
      userEnrollment = enrollment
    }

    return {
      ...data,
      user_enrollment: userEnrollment
    }
  }

  // Creates a new course
  async createCourse(courseData: CreateCourseRequest, instructorId: string): Promise<Course> {
    const { data, error } = await supabase
      .from('courses')
      .insert({
        ...courseData,
        instructor_id: instructorId,
        status: 'draft',
        is_published: false
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Updates an existing course
  async updateCourse(courseId: string, courseData: UpdateCourseRequest, instructorId: string): Promise<Course> {
    const { data, error } = await supabase
      .from('courses')
      .update({
        ...courseData,
        updated_at: new Date().toISOString()
      })
      .eq('id', courseId)
      .eq('instructor_id', instructorId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Deletes a course
  async deleteCourse(courseId: string, instructorId: string): Promise<void> {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', courseId)
      .eq('instructor_id', instructorId)

    if (error) throw error
  }

  // Publishes/unpublishes a course
  async toggleCoursePublish(courseId: string, instructorId: string, publish: boolean): Promise<Course> {
    const { data, error } = await supabase
      .from('courses')
      .update({
        is_published: publish,
        status: publish ? 'published' : 'draft',
        updated_at: new Date().toISOString()
      })
      .eq('id', courseId)
      .eq('instructor_id', instructorId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Fetches course statistics for instructor
  async getInstructorCourseStats(instructorId: string): Promise<CourseStats> {
    const { data: courses, error } = await supabase
      .from('courses')
      .select('*')
      .eq('instructor_id', instructorId)

    if (error) throw error

    const stats: CourseStats = {
      total_courses: courses?.length || 0,
      published_courses: courses?.filter(c => c.is_published).length || 0,
      draft_courses: courses?.filter(c => !c.is_published).length || 0,
      total_enrollments: courses?.reduce((sum, c) => sum + c.total_enrollments, 0) || 0,
      total_revenue: courses?.reduce((sum, c) => sum + (c.price * c.total_enrollments), 0) || 0,
      average_rating: courses?.reduce((sum, c) => sum + c.average_rating, 0) / (courses?.length || 1) || 0,
      total_lessons: courses?.reduce((sum, c) => sum + c.total_lessons, 0) || 0
    }

    return stats
  }

  // Fetches all course categories
  async getCourseCategories(): Promise<CourseCategory[]> {
    const { data, error } = await supabase
      .from('course_categories')
      .select('*')
      .eq('is_active', true)
      .order('name')

    if (error) throw error
    return data || []
  }

  // Enrolls a user in a course
  async enrollUserInCourse(userId: string, courseId: string): Promise<Enrollment> {
    const { data, error } = await supabase
      .from('enrollments')
      .insert({
        user_id: userId,
        course_id: courseId
      })
      .select()
      .single()

    if (error) throw error

    // Update course enrollment count
    await this.updateCourseEnrollmentCount(courseId, 1)

    return data
  }

  // Unenrolls a user from a course
  async unenrollUserFromCourse(userId: string, courseId: string): Promise<void> {
    const { error } = await supabase
      .from('enrollments')
      .delete()
      .eq('user_id', userId)
      .eq('course_id', courseId)

    if (error) throw error

    // Update course enrollment count
    await this.updateCourseEnrollmentCount(courseId, -1)
  }

  // Fetches user's enrolled courses
  async getUserEnrolledCourses(userId: string): Promise<CourseWithDetails[]> {
    const { data, error } = await supabase
      .from('enrollments')
      .select(`
        *,
        course:courses (
          *,
          instructor:instructor_id (
            id,
            raw_user_meta_data->first_name,
            raw_user_meta_data->last_name,
            raw_user_meta_data->avatar_url
          ),
          category:category_id (
            id,
            name,
            color
          )
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'active')

    if (error) throw error
    return data?.map(enrollment => ({
      ...enrollment.course,
      user_enrollment: enrollment
    })) || []
  }

  // Updates course enrollment count
  private async updateCourseEnrollmentCount(courseId: string, increment: number): Promise<void> {
    const { error } = await supabase.rpc('increment_course_enrollments', {
      course_id: courseId,
      increment_value: increment
    })

    if (error) throw error
  }

  // Updates lesson progress
  async updateLessonProgress(userId: string, courseId: string, lessonId: string, progress: number): Promise<void> {
    const { error } = await supabase
      .from('course_progress')
      .upsert({
        user_id: userId,
        course_id: courseId,
        lesson_id: lessonId,
        progress_percentage: progress,
        completed_at: progress === 100 ? new Date().toISOString() : null
      })

    if (error) throw error

    // Update overall course progress
    await this.updateCourseProgress(userId, courseId)
  }

  // Updates overall course progress
  private async updateCourseProgress(userId: string, courseId: string): Promise<void> {
    const { data: progress, error: progressError } = await supabase
      .from('course_progress')
      .select('progress_percentage')
      .eq('user_id', userId)
      .eq('course_id', courseId)

    if (progressError) throw progressError

    const averageProgress = progress?.reduce((sum, p) => sum + p.progress_percentage, 0) / (progress?.length || 1) || 0

    const { error } = await supabase
      .from('enrollments')
      .update({
        progress: averageProgress,
        last_accessed_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('course_id', courseId)

    if (error) throw error
  }

  // Adds course to wishlist
  async addToWishlist(userId: string, courseId: string): Promise<CourseWishlist> {
    const { data, error } = await supabase
      .from('course_wishlist')
      .insert({
        user_id: userId,
        course_id: courseId
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Removes course from wishlist
  async removeFromWishlist(userId: string, courseId: string): Promise<void> {
    const { error } = await supabase
      .from('course_wishlist')
      .delete()
      .eq('user_id', userId)
      .eq('course_id', courseId)

    if (error) throw error
  }

  // Fetches user's wishlist
  async getUserWishlist(userId: string): Promise<CourseWithDetails[]> {
    const { data, error } = await supabase
      .from('course_wishlist')
      .select(`
        *,
        course:courses (
          *,
          instructor:instructor_id (
            id,
            raw_user_meta_data->first_name,
            raw_user_meta_data->last_name,
            raw_user_meta_data->avatar_url
          ),
          category:category_id (
            id,
            name,
            color
          )
        )
      `)
      .eq('user_id', userId)
      .order('added_at', { ascending: false })

    if (error) throw error
    return data?.map(item => item.course) || []
  }
}
