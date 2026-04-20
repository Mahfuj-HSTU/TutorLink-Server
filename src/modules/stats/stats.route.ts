import express from 'express'
import { StatsController } from './stats.controller.ts'

const router = express.Router()

router.get('/', StatsController.getStats)

export const StatsRoutes = router
