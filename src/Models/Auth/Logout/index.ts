import Prisma from '@/Services/Prisma'

export const logout = async (context: Record<string, any>, userId: string): Promise<void> => {
  console.log('logout')
  // Очищяем токены, удаляя соответствующие куки у клиента, очищаем рефреш токен в базе
  try {
    await Prisma.user.update({
      where: {
        id: userId
      },
      data: {
        refreshToken: null
      }
    })
    context.res.setHeader('Set-Cookie',
      [
        'accessToken=delete; expires=Thu, 01 Jan 1970 00:00:00 GMT',
        'refreshToken=delete; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      ])
  } catch (e) {
    console.log('error can not logout')
  }
}
