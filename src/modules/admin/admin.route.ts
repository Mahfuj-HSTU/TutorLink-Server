import express from 'express'
import { UserRole, verifyAuth } from '../../middleware/verifyAuth.ts'
import { AdminController } from './admin.controller.ts'

const router = express.Router()

// Admin Only
router.get('/users', verifyAuth(UserRole.ADMIN), AdminController.getAllUsers)

router.patch(
	'/users/:id',
	verifyAuth(UserRole.ADMIN),
	AdminController.updateUserStatus
)

export const AdminRoutes = router
