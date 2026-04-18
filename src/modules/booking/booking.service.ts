import type { BookingStatus } from '../../../generated/prisma/enums.ts'
import prisma from '../../lib/prisma.ts'

const createBooking = async (studentId: string, payload: any) => {
	const { tutorId, startTime, endTime, price } = payload

	return prisma.booking.create({
		data: {
			studentId,
			tutorId,
			startTime: new Date(startTime),
			endTime: new Date(endTime),
			price
		}
	})
}

const getStudentBookings = async (studentId: string) => {
	return prisma.booking.findMany({
		where: { studentId },
		include: {
			tutor: {
				include: {
					user: { select: { name: true, image: true } }
				}
			}
		},
		orderBy: { createdAt: 'desc' }
	})
}

const getTutorBookings = async (userId: string) => {
	const tutor = await prisma.tutorProfile.findUnique({
		where: { userId }
	})

	if (!tutor) throw new Error('Tutor profile not found')

	return prisma.booking.findMany({
		where: { tutorId: tutor.id },
		include: {
			student: {
				select: { name: true, image: true }
			}
		},
		orderBy: { createdAt: 'desc' }
	})
}

const updateBookingStatus = async (
	callerId: string,
	callerRole: string,
	bookingId: string,
	status: BookingStatus
) => {
	const booking = await prisma.booking.findUnique({ where: { id: bookingId } })

	if (!booking) throw new Error('Booking not found')

	if (callerRole === 'STUDENT') {
		if (booking.studentId !== callerId) throw new Error('Unauthorised')
		if (status !== 'CANCELLED') throw new Error('Students can only cancel bookings')
		if (booking.status !== 'CONFIRMED') throw new Error('Only confirmed bookings can be cancelled')
	}

	return prisma.booking.update({
		where: { id: bookingId },
		data: { status }
	})
}

export const BookingService = {
	createBooking,
	getStudentBookings,
	getTutorBookings,
	updateBookingStatus
}
