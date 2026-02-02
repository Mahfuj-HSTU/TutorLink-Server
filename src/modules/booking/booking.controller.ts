import type { Request, Response } from 'express'
import { BookingService } from './booking.service.ts'
import { asyncHandler } from '../../lib/asyncHandler.ts'

const createBooking = asyncHandler(async (req: Request, res: Response) => {
	const studentId = req.user.id

	const result = await BookingService.createBooking(studentId, req.body)

	res.status(201).json({
		success: true,
		data: result
	})
})

const getStudentBookings = asyncHandler(async (req: Request, res: Response) => {
	const result = await BookingService.getStudentBookings(req.user.id)

	res.status(200).json({
		success: true,
		data: result
	})
})

const getTutorBookings = asyncHandler(async (req: Request, res: Response) => {
	const result = await BookingService.getTutorBookings(req.user.id)

	res.status(200).json({
		success: true,
		data: result
	})
})

const updateBookingStatus = asyncHandler(
	async (req: Request, res: Response) => {
		const result = await BookingService.updateBookingStatus(
			req.params.id as string,
			req.body.status
		)

		res.status(200).json({
			success: true,
			data: result
		})
	}
)

export const BookingController = {
	createBooking,
	getStudentBookings,
	getTutorBookings,
	updateBookingStatus
}
