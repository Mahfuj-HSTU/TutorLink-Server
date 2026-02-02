import type { Request, Response } from 'express'
import { TutorService } from './tutor.service.ts'
import { asyncHandler } from '../../lib/asyncHandler.ts'

const getAllTutors = asyncHandler(async (req: Request, res: Response) => {
	const result = await TutorService.getAllTutors(req.query)

	res.status(200).json({
		success: true,
		data: result
	})
})

const getTutorById = asyncHandler(async (req: Request, res: Response) => {
	const result = await TutorService.getTutorById(req.params.id as string)

	res.status(200).json({
		success: true,
		data: result
	})
})

const createProfile = asyncHandler(async (req: Request, res: Response) => {
	const userId = req.user.id

	const result = await TutorService.createProfile(userId, req.body)

	res.status(201).json({
		success: true,
		data: result
	})
})

const updateProfile = asyncHandler(async (req: Request, res: Response) => {
	const userId = req.user.id

	const result = await TutorService.updateProfile(userId, req.body)

	res.status(200).json({
		success: true,
		data: result
	})
})

const updateCategories = asyncHandler(async (req: Request, res: Response) => {
	const userId = req.user.id

	const result = await TutorService.updateCategories(
		userId,
		req.body.categoryIds
	)

	res.status(200).json({
		success: true,
		data: result
	})
})

export const TutorController = {
	getAllTutors,
	getTutorById,
	createProfile,
	updateProfile,
	updateCategories
}
