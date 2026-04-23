import express from 'express'
import { CategoryController } from './category.controller.ts'
import { UserRole, verifyAuth } from '../../middleware/verifyAuth.ts'

const router = express.Router()
router.get('/', CategoryController.getAllCategories)
router.get(
  '/all',
  verifyAuth(UserRole.ADMIN),
  CategoryController.getAllCategoriesAdmin
)
router.post('/', verifyAuth(UserRole.ADMIN), CategoryController.createCategory)
router.patch(
  '/:id',
  verifyAuth(UserRole.ADMIN),
  CategoryController.updateCategory
)
router.delete(
  '/:id',
  verifyAuth(UserRole.ADMIN),
  CategoryController.deleteCategory
)

export const CategoryRoutes = router
