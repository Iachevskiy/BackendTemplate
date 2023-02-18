import Prisma from '@/Services/Prisma'
import JWT from '@/Services/JWT'

const fetchUser = async (userId: string): Promise<any> => {
  try {
    const userData = await Prisma.user.findUnique({
      where: { id: userId }
    })
    return userData
  } catch (e) {
    console.error('fetchUser error')
    throw new Error('')
  }
}

// Проверяем токены юзыра, если что обновляем первый токен или разлогиниваем
export const verifyUser = async (context: Record<string, any>): Promise<any> => {
  const { accessToken, refreshToken } = JWT.getTokens(context)
  let userId: string
  let userData: any = null

  // проверяем refreshToken на отсутствие
  if (!refreshToken) {
    console.error('verifyUser: has not refreshToken')
    throw new Error('')
  }

  // проверяем accessToken
  if (accessToken) {
    try {
      userId = JWT.verifyToken(accessToken)
    } catch (e) {
      console.error('verifyToken(accessToken)')
    }
  }

  if (!userId) {
    try {
      userId = JWT.verifyToken(refreshToken)
      userData = await fetchUser(userId)

      if (userData.refreshToken !== refreshToken) {
        console.error('userData.refreshToken !== refreshToken')
        throw new Error('')
      }
    } catch (e) {
      console.error('verifyToken(refreshToken)')
      throw new Error('')
    }
  }

  if (!userData) {
    try {
      userData = await fetchUser(userId)
    } catch (e) {
      console.error('load userData')
      throw new Error('')
    }
  }

  if (!accessToken) {
    console.log('accessToken create new')
    await JWT.createAndSendTokens(context, userData.id, ['accessToken'])
  }

  return userData
}
