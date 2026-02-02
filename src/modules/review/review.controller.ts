import type { Request, Response } from 'express'
import { ReviewService } from './review.service.ts'
import { asyncHandler } from '../../lib/asyncHandler.ts'

const createReview = asyncHandler(async (req: Request, res: Response) => {
	const studentId = req.user.id

	const result = await ReviewService.createReview(studentId, req.body)

	res.status(201).json({
		success: true,
		data: result
	})
})

const getTutorReviews = asyncHandler(async (req: Request, res: Response) => {
	const result = await ReviewService.getTutorReviews(req.params.id as string)

	res.status(200).json({
		success: true,
		data: result
	})
})

export const ReviewController = {
	createReview,
	getTutorReviews
}
