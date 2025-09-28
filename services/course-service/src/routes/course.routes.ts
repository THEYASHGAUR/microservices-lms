import { Router } from 'express'
import { CourseController } from '../controllers/course.controller'
import { authenticateToken, requireInstructorOrAdmin, requireStudent } from '../../../shared/middlewares/auth.middleware'

const router = Router()
const courseController = new CourseController()

// Public routes (no authentication required)
router.get('/categories', courseController.getCourseCategories)
router.get('/', courseController.getCourses)
router.get('/:courseId', courseController.getCourseById)
router.get('/:courseId/lessons', courseController.getCourseLessons)

// Protected routes (authentication required)
router.use(authenticateToken)

// Student routes
router.post('/:courseId/enroll', requireStudent, courseController.enrollInCourse)
router.delete('/:courseId/enroll', requireStudent, courseController.unenrollFromCourse)
router.get('/user/enrolled', requireStudent, courseController.getUserEnrolledCourses)
router.get('/user/wishlist', requireStudent, courseController.getUserWishlist)
router.post('/:courseId/wishlist', requireStudent, courseController.addToWishlist)
router.delete('/:courseId/wishlist', requireStudent, courseController.removeFromWishlist)
router.put('/:courseId/lessons/:lessonId/progress', requireStudent, courseController.updateLessonProgress)

// Instructor routes
router.get('/instructor/courses', requireInstructorOrAdmin, courseController.getInstructorCourses)
router.get('/instructor/stats', requireInstructorOrAdmin, courseController.getInstructorCourseStats)
router.post('/', requireInstructorOrAdmin, courseController.createCourse)
router.put('/:courseId', requireInstructorOrAdmin, courseController.updateCourse)
router.delete('/:courseId', requireInstructorOrAdmin, courseController.deleteCourse)
router.put('/:courseId/publish', requireInstructorOrAdmin, courseController.toggleCoursePublish)

// Lesson management routes (instructor only)
router.post('/:courseId/lessons', requireInstructorOrAdmin, courseController.createLesson)
router.put('/lessons/:lessonId', requireInstructorOrAdmin, courseController.updateLesson)
router.delete('/lessons/:lessonId', requireInstructorOrAdmin, courseController.deleteLesson)
router.put('/:courseId/lessons/reorder', requireInstructorOrAdmin, courseController.reorderLessons)

// Lesson access routes
router.get('/lessons/:lessonId', courseController.getLessonById)

export default router
