import prisma from '../../lib/prisma.ts'

const createReview = async (studentId: string, payload: any) => {
  const { tutorId, bookingId, rating, comment } = payload
  const review = await prisma.review.create({
    data: {
      studentId,
      tutorId,
      bookingId,
      rating,
      comment
    }
  })
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

const updateReview = async (
  studentId: string,
  reviewId: string,
  payload: { rating?: number; comment?: string }
) => {
  const existing = await prisma.review.findUnique({ where: { id: reviewId } })

  if (!existing) throw new Error('Review not found')
  if (existing.studentId !== studentId) throw new Error('Unauthorized')
  const review = await prisma.review.update({
    where: { id: reviewId },
    data: payload
  })
  const stats = await prisma.review.aggregate({
    where: { tutorId: existing.tutorId },
    _avg: { rating: true },
    _count: { rating: true }
  })

  await prisma.tutorProfile.update({
    where: { id: existing.tutorId },
    data: {
      rating: stats._avg.rating || 0,
      totalReviews: stats._count.rating
    }
  })
  return review
}

export const ReviewService = {
  createReview,
  getTutorReviews,
  updateReview
}
