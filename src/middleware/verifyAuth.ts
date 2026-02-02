import type { NextFunction, Request, Response } from 'express'
import { auth as betterAuth } from '../lib/auth.ts'

export enum UserRole {
	STUDENT = 'STUDENT',
	TUTOR = 'TUTOR',
	ADMIN = 'ADMIN'
}

export const verifyAuth = (...roles: UserRole[]) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const session = await betterAuth.api.getSession({
				headers: req.headers as any
			})
			if (!session?.user) {
				return res.status(401).json({ message: 'Unauthorized' })
			}

			req.user = {
				id: session.user.id,
				email: session.user.email,
				name: session.user.name,
				role: session.user.role as string
			}
			if (roles.length && !roles.includes(req.user.role as UserRole)) {
				return res
					.status(401)
					.json({ message: 'You are not authorized to perform this action' })
			}
			next()
		} catch (error) {
			next(error)
		}
	}
}
