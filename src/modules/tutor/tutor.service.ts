import prisma from '../../lib/prisma.ts'

const getAllTutors = async (query: any) => {
	const { category, minRate, maxRate, search } = query

	return prisma.tutorProfile.findMany({
		where: {
			isVerified: true,
			isAvailable: true,
			hourlyRate: {
				gte: minRate ? Number(minRate) : undefined,
				lte: maxRate ? Number(maxRate) : undefined
			},
			categories: category
				? {
						some: { slug: category }
					}
				: undefined,
			OR: search
				? [
						{ headline: { contains: search, mode: 'insensitive' } },
						{ bio: { contains: search, mode: 'insensitive' } }
					]
				: undefined
		},
		include: {
			user: {
				select: { name: true, image: true }
			},
			categories: true
		}
	})
}

const getTutorById = async (id: string) => {
	return prisma.tutorProfile.findUnique({
		where: { id },
		include: {
			user: {
				select: { name: true, image: true, email: true }
			},
			categories: true,
			reviews: {
				include: {
					student: { select: { name: true, image: true } }
				}
			}
		}
	})
}

const createProfile = async (userId: string, payload: any) => {
	return prisma.tutorProfile.create({
		data: {
			userId,
			...payload
		}
	})
}

const updateProfile = async (userId: string, payload: any) => {
	return prisma.tutorProfile.update({
		where: { userId },
		data: payload
	})
}

const updateCategories = async (userId: string, categoryIds: string[]) => {
	return prisma.tutorProfile.update({
		where: { userId },
		data: {
			categories: {
				set: categoryIds.map((id) => ({ id }))
			}
		}
	})
}

export const TutorService = {
	getAllTutors,
	getTutorById,
	createProfile,
	updateProfile,
	updateCategories
}
