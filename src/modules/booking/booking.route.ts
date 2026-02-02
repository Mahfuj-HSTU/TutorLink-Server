import express from 'express'
import { BookingController } from './booking.controller.ts'
import { UserRole, verifyAuth } from '../../middleware/verifyAuth.ts'

const router = express.Router()

// Student
router.post('/', verifyAuth(UserRole.STUDENT), BookingController.createBooking)
router.get(
	'/my',
	verifyAuth(UserRole.STUDENT),
	BookingController.getStudentBookings
)

// Tutor
router.get(
	'/tutor',
	verifyAuth(UserRole.TUTOR),
	BookingController.getTutorBookings
)
router.patch(
	'/:id/status',
	verifyAuth(UserRole.TUTOR),
	BookingController.updateBookingStatus
)

export const BookingRoutes = router
