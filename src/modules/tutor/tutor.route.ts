import express from 'express'
import { TutorController } from './tutor.controller.ts'
import { UserRole, verifyAuth } from '../../middleware/verifyAuth.ts'

const router = express.Router()

// Public
router.get('/', TutorController.getAllTutors)
router.get('/:id', TutorController.getTutorById)

// Tutor Protected
router.post(
	'/profile',
	verifyAuth(UserRole.TUTOR),
	TutorController.createProfile
)
router.put(
	'/profile',
	verifyAuth(UserRole.TUTOR),
	TutorController.updateProfile
)
router.put(
	'/categories',
	verifyAuth(UserRole.TUTOR),
	TutorController.updateCategories
)

export const TutorRoutes = router
