import type { Request, Response } from 'express'
import { asyncHandler } from '../../lib/asyncHandler.ts'
import { AdminService } from './admin.service.ts'

const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
	const result = await AdminService.getAllUsers()

	res.status(200).json({
		success: true,
		data: result
	})
})

const updateUserStatus = asyncHandler(async (req: Request, res: Response) => {
	const { isBanned } = req.body

	const result = await AdminService.updateUserStatus(
		req.params.id as string,
		isBanned as boolean
	)

	res.status(200).json({
		success: true,
		data: result
	})
})

export const AdminController = {
	getAllUsers,
	updateUserStatus
}
