import { Request, Response } from 'express'
import { CourseService } from '../services/course.service'
import { LessonService } from '../services/lesson.service'

// Extend Request interface to include user property
interface AuthenticatedRequest extends Request {
  user?: {
    id: string
    email: string
    role: string
  }
}

export class CourseController {
  private courseService: CourseService
  private lessonService: LessonService

  constructor() {
    this.courseService = new CourseService()
    this.lessonService = new LessonService()
  }

  // Fetches all published courses with filters
  getCourses = async (req: Request, res: Response) => {
    try {
      const filters = {
        category: req.query.category as string,
        level: req.query.level as string,
        search: req.query.search as string,
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        sortBy: req.query.sortBy as string || 'created_at',
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc'
      }

      const result = await this.courseService.getCourses(filters)
      res.json(result)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      res.status(500).json({ error: 'Failed to fetch courses', message: errorMessage })
    }
  }

  // Fetches courses for current instructor
  getInstructorCourses = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const instructorId = req.user?.id
      if (!instructorId) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const courses = await this.courseService.getInstructorCourses(instructorId)
      res.json(courses)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      res.status(500).json({ error: 'Failed to fetch instructor courses', message: errorMessage })
    }
  }

  // Fetches a single course by ID
  getCourseById = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { courseId } = req.params
      const userId = req.user?.id

      const course = await this.courseService.getCourseById(courseId, userId)
      if (!course) {
        return res.status(404).json({ error: 'Course not found' })
      }

      res.json(course)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      res.status(500).json({ error: 'Failed to fetch course', message: errorMessage })
    }
  }

  // Creates a new course
  createCourse = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const instructorId = req.user?.id
      if (!instructorId) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const course = await this.courseService.createCourse(req.body, instructorId)
      res.status(201).json(course)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      res.status(500).json({ error: 'Failed to create course', message: errorMessage })
    }
  }

  // Updates an existing course
  updateCourse = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { courseId } = req.params
      const instructorId = req.user?.id
      if (!instructorId) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const course = await this.courseService.updateCourse(courseId, req.body, instructorId)
      res.json(course)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      res.status(500).json({ error: 'Failed to update course', message: errorMessage })
    }
  }

  // Deletes a course
  deleteCourse = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { courseId } = req.params
      const instructorId = req.user?.id
      if (!instructorId) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      await this.courseService.deleteCourse(courseId, instructorId)
      res.status(204).send()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      res.status(500).json({ error: 'Failed to delete course', message: errorMessage })
    }
  }

  // Publishes/unpublishes a course
  toggleCoursePublish = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { courseId } = req.params
      const { publish } = req.body
      const instructorId = req.user?.id
      if (!instructorId) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const course = await this.courseService.toggleCoursePublish(courseId, instructorId, publish)
      res.json(course)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      res.status(500).json({ error: 'Failed to toggle course publish status', message: errorMessage })
    }
  }

  // Fetches course statistics for instructor
  getInstructorCourseStats = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const instructorId = req.user?.id
      if (!instructorId) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const stats = await this.courseService.getInstructorCourseStats(instructorId)
      res.json(stats)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      res.status(500).json({ error: 'Failed to fetch course statistics', message: errorMessage })
    }
  }

  // Fetches all course categories
  getCourseCategories = async (req: Request, res: Response) => {
    try {
      const categories = await this.courseService.getCourseCategories()
      res.json(categories)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      res.status(500).json({ error: 'Failed to fetch categories', message: errorMessage })
    }
  }

  // Enrolls user in a course
  enrollInCourse = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { courseId } = req.params
      const userId = req.user?.id
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const enrollment = await this.courseService.enrollUserInCourse(userId, courseId)
      res.status(201).json(enrollment)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      res.status(500).json({ error: 'Failed to enroll in course', message: errorMessage })
    }
  }

  // Unenrolls user from a course
  unenrollFromCourse = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { courseId } = req.params
      const userId = req.user?.id
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      await this.courseService.unenrollUserFromCourse(userId, courseId)
      res.status(204).send()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      res.status(500).json({ error: 'Failed to unenroll from course', message: errorMessage })
    }
  }

  // Fetches user's enrolled courses
  getUserEnrolledCourses = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const courses = await this.courseService.getUserEnrolledCourses(userId)
      res.json(courses)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      res.status(500).json({ error: 'Failed to fetch enrolled courses', message: errorMessage })
    }
  }

  // Updates lesson progress
  updateLessonProgress = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { courseId, lessonId } = req.params
      const { progress } = req.body
      const userId = req.user?.id
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      await this.courseService.updateLessonProgress(userId, courseId, lessonId, progress)
      res.json({ success: true })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      res.status(500).json({ error: 'Failed to update lesson progress', message: errorMessage })
    }
  }

  // Adds course to wishlist
  addToWishlist = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { courseId } = req.params
      const userId = req.user?.id
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const wishlistItem = await this.courseService.addToWishlist(userId, courseId)
      res.status(201).json(wishlistItem)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      res.status(500).json({ error: 'Failed to add to wishlist', message: errorMessage })
    }
  }

  // Removes course from wishlist
  removeFromWishlist = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { courseId } = req.params
      const userId = req.user?.id
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      await this.courseService.removeFromWishlist(userId, courseId)
      res.status(204).send()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      res.status(500).json({ error: 'Failed to remove from wishlist', message: errorMessage })
    }
  }

  // Fetches user's wishlist
  getUserWishlist = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const wishlist = await this.courseService.getUserWishlist(userId)
      res.json(wishlist)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      res.status(500).json({ error: 'Failed to fetch wishlist', message: errorMessage })
    }
  }

  // Fetches course lessons
  getCourseLessons = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { courseId } = req.params
      const userId = req.user?.id

      const lessons = await this.lessonService.getCourseLessons(courseId, userId)
      res.json(lessons)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      res.status(500).json({ error: 'Failed to fetch course lessons', message: errorMessage })
    }
  }

  // Fetches a single lesson
  getLessonById = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { lessonId } = req.params
      const userId = req.user?.id

      const lesson = await this.lessonService.getLessonById(lessonId, userId)
      if (!lesson) {
        return res.status(404).json({ error: 'Lesson not found' })
      }

      res.json(lesson)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      res.status(500).json({ error: 'Failed to fetch lesson', message: errorMessage })
    }
  }

  // Creates a new lesson
  createLesson = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { courseId } = req.params
      const instructorId = req.user?.id
      if (!instructorId) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const lesson = await this.lessonService.createLesson(courseId, req.body, instructorId)
      res.status(201).json(lesson)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      res.status(500).json({ error: 'Failed to create lesson', message: errorMessage })
    }
  }

  // Updates an existing lesson
  updateLesson = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { lessonId } = req.params
      const instructorId = req.user?.id
      if (!instructorId) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const lesson = await this.lessonService.updateLesson(lessonId, req.body, instructorId)
      res.json(lesson)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      res.status(500).json({ error: 'Failed to update lesson', message: errorMessage })
    }
  }

  // Deletes a lesson
  deleteLesson = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { lessonId } = req.params
      const instructorId = req.user?.id
      if (!instructorId) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      await this.lessonService.deleteLesson(lessonId, instructorId)
      res.status(204).send()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      res.status(500).json({ error: 'Failed to delete lesson', message: errorMessage })
    }
  }

  // Reorders lessons within a course
  reorderLessons = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { courseId } = req.params
      const { lessonOrders } = req.body
      const instructorId = req.user?.id
      if (!instructorId) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      await this.lessonService.reorderLessons(courseId, lessonOrders, instructorId)
      res.json({ success: true })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      res.status(500).json({ error: 'Failed to reorder lessons', message: errorMessage })
    }
  }
}
