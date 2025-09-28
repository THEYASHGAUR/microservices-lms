import { supabase } from '../config/supabase'
import { Lesson, CreateLessonRequest, UpdateLessonRequest } from '../models/course.model'

export class LessonService {
  // Fetches all lessons for a course
  async getCourseLessons(courseId: string, userId?: string): Promise<Lesson[]> {
    let query = supabase
      .from('lessons')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index')

    // If user is not enrolled, only show published lessons
    if (userId) {
      const { data: enrollment } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .single()

      if (!enrollment) {
        query = query.eq('is_published', true)
      }
    } else {
      query = query.eq('is_published', true)
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
  }

  // Fetches a single lesson
  async getLessonById(lessonId: string, userId?: string): Promise<Lesson | null> {
    const { data, error } = await supabase
      .from('lessons')
      .select(`
        *,
        course:courses (
          id,
          title,
          instructor_id
        )
      `)
      .eq('id', lessonId)
      .single()

    if (error) throw error
    if (!data) return null

    // Check if user has access to this lesson
    if (userId && !data.is_published) {
      const { data: enrollment } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', userId)
        .eq('course_id', data.course_id)
        .single()

      if (!enrollment) {
        throw new Error('Access denied: User not enrolled in this course')
      }
    }

    return data
  }

  // Creates a new lesson
  async createLesson(courseId: string, lessonData: CreateLessonRequest, instructorId: string): Promise<Lesson> {
    // Verify instructor owns the course
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id')
      .eq('id', courseId)
      .eq('instructor_id', instructorId)
      .single()

    if (courseError || !course) {
      throw new Error('Course not found or access denied')
    }

    const { data, error } = await supabase
      .from('lessons')
      .insert({
        ...lessonData,
        course_id: courseId,
        is_published: false
      })
      .select()
      .single()

    if (error) throw error

    // Update course total lessons count
    await this.updateCourseLessonCount(courseId, 1)

    return data
  }

  // Updates an existing lesson
  async updateLesson(lessonId: string, lessonData: UpdateLessonRequest, instructorId: string): Promise<Lesson> {
    // Verify instructor owns the course
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select(`
        *,
        course:courses (
          id,
          instructor_id
        )
      `)
      .eq('id', lessonId)
      .single()

    if (lessonError || !lesson || lesson.course.instructor_id !== instructorId) {
      throw new Error('Lesson not found or access denied')
    }

    const { data, error } = await supabase
      .from('lessons')
      .update({
        ...lessonData,
        updated_at: new Date().toISOString()
      })
      .eq('id', lessonId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Deletes a lesson
  async deleteLesson(lessonId: string, instructorId: string): Promise<void> {
    // Verify instructor owns the course
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select(`
        *,
        course:courses (
          id,
          instructor_id
        )
      `)
      .eq('id', lessonId)
      .single()

    if (lessonError || !lesson || lesson.course.instructor_id !== instructorId) {
      throw new Error('Lesson not found or access denied')
    }

    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', lessonId)

    if (error) throw error

    // Update course total lessons count
    await this.updateCourseLessonCount(lesson.course_id, -1)
  }

  // Publishes/unpublishes a lesson
  async toggleLessonPublish(lessonId: string, instructorId: string, publish: boolean): Promise<Lesson> {
    // Verify instructor owns the course
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select(`
        *,
        course:courses (
          id,
          instructor_id
        )
      `)
      .eq('id', lessonId)
      .single()

    if (lessonError || !lesson || lesson.course.instructor_id !== instructorId) {
      throw new Error('Lesson not found or access denied')
    }

    const { data, error } = await supabase
      .from('lessons')
      .update({
        is_published: publish,
        updated_at: new Date().toISOString()
      })
      .eq('id', lessonId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Reorders lessons within a course
  async reorderLessons(courseId: string, lessonOrders: { lessonId: string, orderIndex: number }[], instructorId: string): Promise<void> {
    // Verify instructor owns the course
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id')
      .eq('id', courseId)
      .eq('instructor_id', instructorId)
      .single()

    if (courseError || !course) {
      throw new Error('Course not found or access denied')
    }

    // Update each lesson's order index
    for (const { lessonId, orderIndex } of lessonOrders) {
      const { error } = await supabase
        .from('lessons')
        .update({ order_index: orderIndex })
        .eq('id', lessonId)
        .eq('course_id', courseId)

      if (error) throw error
    }
  }

  // Updates course total lessons count
  private async updateCourseLessonCount(courseId: string, increment: number): Promise<void> {
    const { error } = await supabase.rpc('increment_course_lessons', {
      course_id: courseId,
      increment_value: increment
    })

    if (error) throw error
  }

  // Gets next lesson for a user
  async getNextLesson(courseId: string, userId: string): Promise<Lesson | null> {
    const { data: progress, error: progressError } = await supabase
      .from('course_progress')
      .select('lesson_id')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .eq('progress_percentage', 100)

    if (progressError) throw progressError

    const completedLessonIds = progress?.map(p => p.lesson_id) || []

    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', courseId)
      .eq('is_published', true)
      .not('id', 'in', `(${completedLessonIds.join(',')})`)
      .order('order_index')
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  // Gets lesson progress for a user
  async getLessonProgress(userId: string, lessonId: string): Promise<number> {
    const { data, error } = await supabase
      .from('course_progress')
      .select('progress_percentage')
      .eq('user_id', userId)
      .eq('lesson_id', lessonId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data?.progress_percentage || 0
  }
}
