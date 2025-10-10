import type { StudentProfile, StudentDashboard, Activity, Deadline } from '@/types/student-types'
import { supabase } from '@/lib/supabase'

export const studentService = {
  // Fetches student profile information using Supabase
  async getProfile(): Promise<StudentProfile> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error || !data) {
      throw new Error('Profile not found')
    }

    // Get enrollment statistics
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('*')
      .eq('user_id', user.id)

    const enrolledCourses = enrollments?.length || 0
    const completedCourses = enrollments?.filter(e => e.status === 'completed').length || 0
    const totalProgress = enrollments?.reduce((sum, e) => sum + (e.progress || 0), 0) / (enrolledCourses || 1)

    return {
      id: data.id,
      userId: user.id,
      name: data.name || data.full_name || 'User',
      email: user.email!,
      avatar: data.avatar_url,
      bio: data.bio,
      enrolledCourses: enrolledCourses.toString(),
      completedCourses: completedCourses.toString(),
      totalProgress: Math.round(totalProgress),
      createdAt: data.created_at,
      updatedAt: data.updated_at
    }
  },

  // Updates student profile information using Supabase
  async updateProfile(data: Partial<StudentProfile>): Promise<StudentProfile> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .update({
        name: data.name,
        bio: data.bio,
        avatar_url: data.avatar
      })
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      throw new Error('Failed to update profile')
    }

    return {
      id: profile.id,
      userId: user.id,
      name: profile.name || profile.full_name || 'User',
      email: user.email!,
      avatar: profile.avatar_url,
      bio: profile.bio,
      enrolledCourses: '0',
      completedCourses: '0',
      totalProgress: 0,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at
    }
  },

  // Fetches student dashboard data using Supabase
  async getDashboard(): Promise<StudentDashboard> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    // Get enrollment statistics
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('*')
      .eq('user_id', user.id)

    const enrolledCourses = enrollments?.length || 0
    const completedCourses = enrollments?.filter(e => e.status === 'completed').length || 0
    const totalProgress = enrollments?.reduce((sum, e) => sum + (e.progress || 0), 0) / (enrolledCourses || 1)

    // Get recent activity (simplified for now)
    const recentActivity: Activity[] = []

    // Get upcoming deadlines (simplified for now)
    const upcomingDeadlines: Deadline[] = []

    return {
      enrolledCourses,
      completedCourses,
      totalProgress: Math.round(totalProgress),
      recentActivity,
      upcomingDeadlines
    }
  },

  // Fetches recent activity for student using Supabase
  async getRecentActivity(limit: number = 10): Promise<Activity[]> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    // This would typically come from an activities table
    // For now, return empty array
    return []
  },

  // Fetches upcoming deadlines for student using Supabase
  async getUpcomingDeadlines(): Promise<Deadline[]> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    // This would typically come from assignments/deadlines table
    // For now, return empty array
    return []
  },

  // Gets student's course progress summary using Supabase
  async getProgressSummary(): Promise<{ totalCourses: number; completedCourses: number; averageProgress: number }> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('*')
      .eq('user_id', user.id)

    const totalCourses = enrollments?.length || 0
    const completedCourses = enrollments?.filter(e => e.status === 'completed').length || 0
    const averageProgress = enrollments?.reduce((sum, e) => sum + (e.progress || 0), 0) / (totalCourses || 1)

    return {
      totalCourses,
      completedCourses,
      averageProgress: Math.round(averageProgress)
    }
  },

  // Updates student avatar using Supabase
  async updateAvatar(avatarUrl: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    const { error } = await supabase
      .from('profiles')
      .update({ avatar_url: avatarUrl })
      .eq('id', user.id)

    if (error) {
      throw new Error('Failed to update avatar')
    }
  },

  // Gets student's learning statistics using Supabase
  async getLearningStats(): Promise<{ totalStudyTime: number; lessonsCompleted: number; coursesCompleted: number; streak: number }> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('*')
      .eq('user_id', user.id)

    const coursesCompleted = enrollments?.filter(e => e.status === 'completed').length || 0
    const lessonsCompleted = enrollments?.reduce((sum, e) => sum + (e.completed_lessons?.length || 0), 0) || 0

    return {
      totalStudyTime: 0, // Would need to track this separately
      lessonsCompleted,
      coursesCompleted,
      streak: 0 // Would need to track this separately
    }
  },
}
