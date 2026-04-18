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
	bookingId: string,
	status: BookingStatus
) => {
	return prisma.booking.update({
		where: { id: bookingId },
		data: { status }
	})
}

const cancelStudentBooking = async (studentId: string, bookingId: string) => {
	const booking = await prisma.booking.findUnique({
		where: { id: bookingId }
	})

	if (!booking) throw new Error('Booking not found')
	if (booking.studentId !== studentId) throw new Error('Unauthorised')
	if (booking.status !== 'CONFIRMED') throw new Error('Only confirmed bookings can be cancelled')

	return prisma.booking.update({
		where: { id: bookingId },
		data: { status: 'CANCELLED' }
	})
}

export const BookingService = {
	createBooking,
	getStudentBookings,
	getTutorBookings,
	updateBookingStatus,
	cancelStudentBooking
}
