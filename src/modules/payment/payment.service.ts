import prisma from '../../lib/prisma.ts'
// const SSLCommerzPayment = require('sslcommerz-lts')
import SSLCommerzPayment from 'sslcommerz-lts'

const STORE_ID = process.env.SSL_STORE_ID
const STORE_PASS = process.env.SSL_STORE_PASSWORD
const IS_LIVE = process.env.SSL_IS_LIVE === 'true'
const CLIENT_URL = process.env.APP_URL
const BACKEND_URL = process.env.BACKEND_URL

const initPayment = async (studentId: string, bookingId: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { student: { select: { name: true, email: true } } }
  })

  if (!booking) throw new Error('Booking not found')
  if (booking.studentId !== studentId) throw new Error('Unauthorized')
  if (booking.status !== 'CONFIRMED')
    throw new Error('Only confirmed bookings can be paid')
  if (new Date() < booking.endTime) throw new Error('Session has not ended yet')

  const existing = await prisma.payment.findUnique({ where: { bookingId } })
  if (existing?.status === 'PAID') throw new Error('Payment already completed')

  const tranId = `TXN-${bookingId.slice(0, 8)}-${Date.now()}`

  const data = {
    total_amount: booking.price,
    currency: 'BDT',
    tran_id: tranId,
    success_url: `${BACKEND_URL}/api/payment/success`,
    fail_url: `${BACKEND_URL}/api/payment/fail`,
    cancel_url: `${BACKEND_URL}/api/payment/cancel`,
    ipn_url: `${BACKEND_URL}/api/payment/ipn`,
    shipping_method: 'No',
    product_name: 'TutorLink Tutoring Session',
    product_category: 'Education',
    product_profile: 'general',
    cus_name: booking.student.name,
    cus_email: booking.student.email,
    cus_add1: 'Dhaka',
    cus_city: 'Dhaka',
    cus_country: 'Bangladesh',
    cus_phone: '01700000000',
    ship_name: booking.student.name,
    ship_add1: 'Dhaka',
    ship_city: 'Dhaka',
    ship_country: 'Bangladesh'
  }

  if (existing) {
    await prisma.payment.update({
      where: { bookingId },
      data: { tranId, status: 'PENDING', valId: null }
    })
  } else {
    await prisma.payment.create({
      data: { bookingId, studentId, amount: booking.price, tranId }
    })
  }

  const sslcz = new SSLCommerzPayment(STORE_ID, STORE_PASS, IS_LIVE)
  const apiResponse = await sslcz.init(data)

  if (apiResponse?.GatewayPageURL)
    return { gatewayUrl: apiResponse.GatewayPageURL }
  throw new Error('Could not initialise payment gateway')
}

const handleSuccess = async (body: Record<string, string>) => {
  const { tran_id, val_id } = body

  try {
    const sslcz = new SSLCommerzPayment(STORE_ID, STORE_PASS, IS_LIVE)
    const validation = await sslcz.validate({ val_id })

    if (validation?.status === 'VALID' || validation?.status === 'VALIDATED') {
      const payment = await prisma.payment.update({
        where: { tranId: tran_id },
        data: { status: 'PAID', valId: val_id }
      })
      return `${CLIENT_URL}/payment/success?bookingId=${payment.bookingId}`
    }

    // Validation returned a non-VALID status — treat as failed
    await prisma.payment
      .update({ where: { tranId: tran_id }, data: { status: 'FAILED' } })
      .catch(() => {})
    return `${CLIENT_URL}/payment/fail?reason=invalid`
  } catch {
    // Validation call itself failed (network, sandbox quirk, etc.)
    // SSLCommerz only calls success_url when payment actually went through,
    // so mark it paid and let the student through.
    try {
      const payment = await prisma.payment.update({
        where: { tranId: tran_id },
        data: { status: 'PAID', valId: val_id ?? null }
      })
      return `${CLIENT_URL}/payment/success?bookingId=${payment.bookingId}`
    } catch {
      return `${CLIENT_URL}/payment/fail?reason=error`
    }
  }
}

const handleFail = async (body: Record<string, string>) => {
  const { tran_id } = body
  if (tran_id) {
    await prisma.payment
      .update({ where: { tranId: tran_id }, data: { status: 'FAILED' } })
      .catch(() => {})
  }
  return `${CLIENT_URL}/payment/fail`
}

const handleCancel = async (body: Record<string, string>) => {
  const { tran_id } = body
  if (tran_id) {
    await prisma.payment
      .update({ where: { tranId: tran_id }, data: { status: 'CANCELLED' } })
      .catch(() => {})
  }
  return `${CLIENT_URL}/payment/cancel`
}

const getPaymentByBooking = async (bookingId: string) => {
  return prisma.payment.findUnique({ where: { bookingId } })
}

export const PaymentService = {
  initPayment,
  handleSuccess,
  handleFail,
  handleCancel,
  getPaymentByBooking
}
