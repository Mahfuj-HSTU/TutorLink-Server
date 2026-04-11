import express from 'express'
import { AdminRoutes } from '../modules/admin/admin.route.ts'
import { BookingRoutes } from '../modules/booking/booking.route.ts'
import { CategoryRoutes } from '../modules/category/category.route.ts'
import { ReviewRoutes } from '../modules/review/review.route.ts'
import { TutorRoutes } from '../modules/tutor/tutor.route.ts'

const router = express.Router()

router.use('/admin', AdminRoutes)
router.use('/bookings', BookingRoutes)
router.use('/categories', CategoryRoutes)
router.use('/reviews', ReviewRoutes)
router.use('/tutors', TutorRoutes)

export const MainRouter = router
