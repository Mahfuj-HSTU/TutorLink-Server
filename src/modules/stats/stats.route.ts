import express from 'express'
import { StatsController } from './stats.controller.ts'

const router = express.Router()

router.get('/', StatsController.getStats)
router.get('/featured-tutor', StatsController.getFeaturedTutor)

export const StatsRoutes = router
