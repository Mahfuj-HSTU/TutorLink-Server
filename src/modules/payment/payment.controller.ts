import type { Request, Response } from 'express'
import { asyncHandler } from '../../lib/asyncHandler.ts'
import { PaymentService } from './payment.service.ts'

const init = asyncHandler(async (req: Request, res: Response) => {
	const result = await PaymentService.initPayment(req.user.id, req.body.bookingId)
	res.status(200).json({ success: true, data: result })
})

const success = asyncHandler(async (req: Request, res: Response) => {
	const redirectUrl = await PaymentService.handleSuccess(req.body)
	res.redirect(redirectUrl)
})

const fail = asyncHandler(async (req: Request, res: Response) => {
	const redirectUrl = await PaymentService.handleFail(req.body)
	res.redirect(redirectUrl)
})

const cancel = asyncHandler(async (req: Request, res: Response) => {
	const redirectUrl = await PaymentService.handleCancel(req.body)
	res.redirect(redirectUrl)
})

// IPN — server-to-server notification from SSLCommerz (same as success logic)
const ipn = asyncHandler(async (req: Request, res: Response) => {
	await PaymentService.handleSuccess(req.body)
	res.status(200).send('IPN received')
})

export const PaymentController = { init, success, fail, cancel, ipn }
