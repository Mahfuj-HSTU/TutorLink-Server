import prisma from '../../lib/prisma.ts'

const getPlatformStats = async () => {
  const [tutorCount, studentCount, subjectCount, ratingAgg, rateAgg] =
    await Promise.all([
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

const getFeaturedTutor = async () => {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  // Find the tutor with the highest total earnings from completed bookings
  const topEarners = await prisma.booking.groupBy({
    by: ['tutorId'],
    where: { status: 'COMPLETED' },
    _sum: { price: true },
    orderBy: { _sum: { price: 'desc' } },
    take: 1
  })

  // Fall back to highest-rated tutor if no completed bookings exist
  let tutorId: string | null = topEarners[0]?.tutorId ?? null
  if (!tutorId) {
    const fallback = await prisma.tutorProfile.findFirst({
      orderBy: { rating: 'desc' },
      select: { id: true }
    })
    tutorId = fallback?.id ?? null
  }

  if (!tutorId) return null

  const [tutor, monthlyAgg, allTimeAgg, weeklyBookings] = await Promise.all([
    prisma.tutorProfile.findUnique({
      where: { id: tutorId },
      include: {
        user: { select: { name: true } },
        categories: { take: 1, select: { name: true } }
      }
    }),
    prisma.booking.aggregate({
      where: { tutorId, status: 'COMPLETED', startTime: { gte: startOfMonth } },
      _sum: { price: true },
      _count: true
    }),
    prisma.booking.aggregate({
      where: { tutorId, status: 'COMPLETED' },
      _sum: { price: true },
      _count: true
    }),
    prisma.booking.findMany({
      where: {
        tutorId,
        status: 'COMPLETED',
        startTime: { gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) }
      },
      select: { startTime: true }
    })
  ])

  if (!tutor) return null

  const monthStudents = await prisma.booking.findMany({
    where: { tutorId, status: 'COMPLETED', startTime: { gte: startOfMonth } },
    select: { studentId: true },
    distinct: ['studentId']
  })

  const weeklyActivity = Array.from({ length: 7 }, (_, i) => {
    const target = new Date(now)
    target.setDate(target.getDate() - (6 - i))
    const dayStr = target.toISOString().split('T')[0]
    return weeklyBookings.filter(
      (b) => b.startTime.toISOString().split('T')[0] === dayStr
    ).length
  })

  const nameParts = tutor.user.name.trim().split(' ')
  const displayName =
    nameParts.length > 1
      ? `${nameParts[0]} ${nameParts[nameParts.length - 1][0]}.`
      : nameParts[0]

  const monthsOnPlatform = Math.max(
    1,
    Math.floor(
      (now.getTime() - tutor.createdAt.getTime()) / (30 * 24 * 60 * 60 * 1000)
    )
  )

  return {
    displayName,
    subject: tutor.categories[0]?.name ?? 'General',
    monthsOnPlatform,
    hourlyRate: Math.round(tutor.hourlyRate),
    monthlyEarnings: Math.round(monthlyAgg._sum.price ?? 0),
    monthlySessionCount: monthlyAgg._count,
    monthlyStudentCount: monthStudents.length,
    totalEarnings: Math.round(allTimeAgg._sum.price ?? 0),
    totalSessionCount: allTimeAgg._count,
    rating: tutor.rating,
    weeklyActivity
  }
}

export const StatsService = { getPlatformStats, getFeaturedTutor }
