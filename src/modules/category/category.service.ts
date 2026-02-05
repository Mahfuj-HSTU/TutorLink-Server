import slugifyRaw from 'slugify'
import prisma from '../../lib/prisma.ts'

const slugify = slugifyRaw as unknown as (
	string: string,
	options?: any
) => string

const getAllCategories = async () => {
	return prisma.category.findMany({
		where: { isActive: true },
		orderBy: { name: 'asc' }
	})
}

const createCategory = async (payload: any) => {
	const slug = slugify(payload.name, { lower: true })

	return prisma.category.create({
		data: {
			name: payload.name,
			slug
		}
	})
}

const updateCategory = async (id: string, payload: any) => {
	const slug = payload.name ? slugify(payload.name, { lower: true }) : undefined

	return prisma.category.update({
		where: { id },
		data: {
			...payload,
			slug
		}
	})
}

const deleteCategory = async (id: string) => {
	return prisma.category.update({
		where: { id },
		data: { isActive: false } // Soft delete
	})
}

export const CategoryService = {
	getAllCategories,
	createCategory,
	updateCategory,
	deleteCategory
}
