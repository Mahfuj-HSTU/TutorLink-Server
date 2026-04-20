import prisma from '../../lib/prisma.ts'

const getPlatformStats = async () => {
	const [tutorCount, studentCount, subjectCount, ratingAgg, rateAgg] = await Promise.all([
		prisma.user.count({ where: { role: 'TUTOR' } }),
		prisma.user.count({ where: { role: 'STUDENT' } }),
		prisma.category.count({ where: { isActive: true } }),
		prisma.review.aggregate({ _avg: { rating: true } }),
		prisma.tutorProfile.aggregate({ _avg: { hourlyRate: true } })
	])

	return {
		tutorCount,
		studentCount,
		subjectCount,
		avgRating: Math.round((ratingAgg._avg.rating ?? 0) * 10) / 10,
		avgHourlyRate: Math.round(rateAgg._avg.hourlyRate ?? 0)
	}
}

export const StatsService = { getPlatformStats }
