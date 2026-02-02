import express from 'express'
import { ReviewController } from './review.controller.ts'
import { UserRole, verifyAuth } from '../../middleware/verifyAuth.ts'

const router = express.Router()

router.post('/', verifyAuth(UserRole.STUDENT), ReviewController.createReview)
router.get('/tutor/:id', ReviewController.getTutorReviews)

export const ReviewRoutes = router
