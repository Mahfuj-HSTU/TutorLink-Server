import prisma from '../../lib/prisma.ts'

const getAllUsers = async () => {
  const result = await prisma.user.findMany({
    where: {
      role: {
        not: 'ADMIN'
      }
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isBanned: true,
      createdAt: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return result
}

const updateUserStatus = async (userId: string, isBanned: boolean) => {
  const result = await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      isBanned
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isBanned: true
    }
  })
  return result
}

export const AdminService = {
  getAllUsers,
  updateUserStatus
}
