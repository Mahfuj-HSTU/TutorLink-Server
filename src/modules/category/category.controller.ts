import type { Request, Response } from 'express'
import { CategoryService } from './category.service.ts'
import { asyncHandler } from '../../lib/asyncHandler.ts'

const getAllCategories = asyncHandler(async (req: Request, res: Response) => {
	const result = await CategoryService.getAllCategories()

	res.status(200).json({
		success: true,
		data: result
	})
})

const createCategory = asyncHandler(async (req: Request, res: Response) => {
	const result = await CategoryService.createCategory(req.body)

	res.status(201).json({
		success: true,
		data: result
	})
})

const updateCategory = asyncHandler(async (req: Request, res: Response) => {
	const result = await CategoryService.updateCategory(
		req.params.id as string,
		req.body
	)

	res.status(200).json({
		success: true,
		data: result
	})
})

const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
	await CategoryService.deleteCategory(req.params.id as string)

	res.status(200).json({
		success: true,
		message: 'Category deleted successfully'
	})
})

export const CategoryController = {
	getAllCategories,
	createCategory,
	updateCategory,
	deleteCategory
}
