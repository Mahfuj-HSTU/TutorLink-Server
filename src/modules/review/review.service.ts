import prisma from '../../lib/prisma.ts'

const createReview = async (studentId: string, payload: any) => {
	const { tutorId, bookingId, rating, comment } = payload

	// Create review
	const review = await prisma.review.create({
		data: {
			studentId,
			tutorId,
			bookingId,
			rating,
			comment
		}
	})

	// Recalculate rating
	const stats = await prisma.review.aggregate({
		where: { tutorId },
		_avg: { rating: true },
		_count: { rating: true }
	})

	await prisma.tutorProfile.update({
		where: { id: tutorId },
		data: {
			rating: stats._avg.rating || 0,
			totalReviews: stats._count.rating
		}
	})

	return review
}

const getTutorReviews = async (tutorId: string) => {
	return prisma.review.findMany({
		where: { tutorId },
		include: {
			student: {
				select: { name: true, image: true }
			}
		},
		orderBy: { createdAt: 'desc' }
	})
}

export const ReviewService = {
	createReview,
	getTutorReviews
}
