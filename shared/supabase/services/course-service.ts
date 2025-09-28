// Course Service specific Supabase configuration
// This file contains course-specific Supabase operations and types

import { getSupabaseClient } from '../index'
import type { Course, Lesson, Enrollment, CourseCategory, PaginatedResponse } from '../types'

export class CourseServiceSupabase {
  private supabase = getSupabaseClient()

  // Fetches all published courses with pagination and filters
  async getCourses(filters: {
    category?: string
    level?: string
    search?: string
    page?: number
    limit?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  } = {}): Promise<PaginatedResponse<Course>> {
    const { category, level, search, page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = filters
    
    let query = this.supabase
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
      data: data || [],
      total: count || 0,
      page,
      limit,
      hasMore: (count || 0) > page * limit
    }
  }

  // Fetches courses for a specific instructor
  async getInstructorCourses(instructorId: string): Promise<Course[]> {
    const { data, error } = await this.supabase
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
  async getCourseById(courseId: string, userId?: string): Promise<Course | null> {
    const { data, error } = await this.supabase
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
      const { data: enrollment } = await this.supabase
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
  async createCourse(courseData: Partial<Course>, instructorId: string): Promise<Course> {
    const { data, error } = await this.supabase
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
  async updateCourse(courseId: string, courseData: Partial<Course>, instructorId: string): Promise<Course> {
    const { data, error } = await this.supabase
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
    const { error } = await this.supabase
      .from('courses')
      .delete()
      .eq('id', courseId)
      .eq('instructor_id', instructorId)

    if (error) throw error
  }

  // Publishes/unpublishes a course
  async toggleCoursePublish(courseId: string, instructorId: string, publish: boolean): Promise<Course> {
    const { data, error } = await this.supabase
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
  async getInstructorCourseStats(instructorId: string): Promise<{
    total_courses: number
    published_courses: number
    draft_courses: number
    total_enrollments: number
    total_revenue: number
    average_rating: number
    total_lessons: number
  }> {
    const { data: courses, error } = await this.supabase
      .from('courses')
      .select('*')
      .eq('instructor_id', instructorId)

    if (error) throw error

    return {
      total_courses: courses?.length || 0,
      published_courses: courses?.filter(c => c.is_published).length || 0,
      draft_courses: courses?.filter(c => !c.is_published).length || 0,
      total_enrollments: courses?.reduce((sum, c) => sum + c.total_enrollments, 0) || 0,
      total_revenue: courses?.reduce((sum, c) => sum + (c.price * c.total_enrollments), 0) || 0,
      average_rating: courses?.reduce((sum, c) => sum + c.average_rating, 0) / (courses?.length || 1) || 0,
      total_lessons: courses?.reduce((sum, c) => sum + c.total_lessons, 0) || 0
    }
  }

  // Fetches all course categories
  async getCourseCategories(): Promise<CourseCategory[]> {
    const { data, error } = await this.supabase
      .from('course_categories')
      .select('*')
      .eq('is_active', true)
      .order('name')

    if (error) throw error
    return data || []
  }

  // Enrolls a user in a course
  async enrollUserInCourse(userId: string, courseId: string): Promise<Enrollment> {
    const { data, error } = await this.supabase
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
    const { error } = await this.supabase
      .from('enrollments')
      .delete()
      .eq('user_id', userId)
      .eq('course_id', courseId)

    if (error) throw error

    // Update course enrollment count
    await this.updateCourseEnrollmentCount(courseId, -1)
  }

  // Fetches user's enrolled courses
  async getUserEnrolledCourses(userId: string): Promise<Course[]> {
    const { data, error } = await this.supabase
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
    return data?.map(enrollment => enrollment.course) || []
  }

  // Updates course enrollment count
  private async updateCourseEnrollmentCount(courseId: string, increment: number): Promise<void> {
    const { error } = await this.supabase.rpc('increment_course_enrollments', {
      course_id: courseId,
      increment_value: increment
    })

    if (error) throw error
  }
}
