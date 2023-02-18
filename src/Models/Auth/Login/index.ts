import Prisma from '@/Services/Prisma'
import JWT from '@/Services/JWT'
import { type User } from '@generated/type-graphql'

// Создаем токены, отправляем куками на клиент, рефреш токен сохраняем в базе у юзера
export const login = async (context: Record<string, any>, phoneUser: string): Promise<User | null> => {
  let userData: User | null = null

  // Ищем юзера по телефону в базе или создаем
  try {
    userData = await Prisma.user.findUnique({
      where: { phone: phoneUser }
    })

    if (!userData) {
      userData = await Prisma.user.create({
        data: {
          phone: phoneUser
        }
      })
    }

    await JWT.createAndSendTokens(context, userData.id, ['accessToken', 'refreshToken'])

    delete userData.refreshToken
    return userData
  } catch (e) {
    console.log('user not found')
  }
}
