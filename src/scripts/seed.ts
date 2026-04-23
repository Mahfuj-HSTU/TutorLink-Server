import { auth } from '../lib/auth.ts'
import prisma from '../lib/prisma.ts'

async function seed() {
  try {
    console.log('Seeding admin...')

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@tutorlink.com' }
    })

    if (existingAdmin) {
      console.log('Admin already exists! Skipping seed.')
      return
    }

    // Use better-auth API to properly hash password and create related records
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
