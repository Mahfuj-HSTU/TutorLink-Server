import type { Request, Response } from 'express'
import { StatsService } from './stats.service.ts'
import { asyncHandler } from '../../lib/asyncHandler.ts'

const getStats = asyncHandler(async (_req: Request, res: Response) => {
	const result = await StatsService.getPlatformStats()
	res.status(200).json({ success: true, data: result })
})

const getFeaturedTutor = asyncHandler(async (_req: Request, res: Response) => {
	const result = await StatsService.getFeaturedTutor()
	res.status(200).json({ success: true, data: result })
})

export const StatsController = { getStats, getFeaturedTutor }
