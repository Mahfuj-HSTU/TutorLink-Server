import { auth } from '../lib/auth.ts'
import prisma from '../lib/prisma.ts'

async function seed() {
  try {
    console.log('Seeding admin...')
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@tutorlink.com' }
    })

    if (existingAdmin) {
      console.log('Admin already exists! Skipping seed.')
      return
    }

    const res = await auth.api.signUpEmail({
      body: {
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        name: 'System Admin',
        role: 'ADMIN',
        phone: '01234567893'
      }
    })
    console.log('Admin seeded successfully!')
  } catch (err) {
    console.error('Error seeding admin:', err)
  }
}

seed()
