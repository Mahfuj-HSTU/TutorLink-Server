import express from 'express'
import { PaymentController } from './payment.controller.ts'
import { UserRole, verifyAuth } from '../../middleware/verifyAuth.ts'

const router = express.Router()

// Student initiates payment
router.post('/init', verifyAuth(UserRole.STUDENT), PaymentController.init)

// SSLCommerz callbacks — no auth, browser/server redirects
router.post('/success', PaymentController.success)
router.post('/fail', PaymentController.fail)
router.post('/cancel', PaymentController.cancel)
router.post('/ipn', PaymentController.ipn)

export const PaymentRoutes = router
