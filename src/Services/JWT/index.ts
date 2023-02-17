import jwt from 'jsonwebtoken'
import cookie from 'cookie'
import Prisma from '../Prisma'
import { type User } from '@generated/type-graphql'

const getTokens = (context: Record<string, any>): Record<string, any> => {
  const cookies = cookie.parse(context.req.headers.cookie || '')
  return {
    accessToken: cookies.accessToken,
    refreshToken: cookies.refreshToken
  }
}
const verifyToken = (token: string): string => {
  const data: Record<string, any> = jwt.verify(token, process.env.JWT_SECRET) as Record<string, any>
  return data.userId
}

const createAndSendTokens = async (context: Record<string, any>, userId: string, tokens: Array<'accessToken' | 'refreshToken'>): Promise<void> => {
  const cookie = []
  if (tokens.length) {
    if (tokens.includes('accessToken')) {
      const token = jwt.sign({ userId, token: 'access' }, process.env.JWT_SECRET)
      const timeout = 60 * 60 // секунды / час
      cookie.push(`accessToken=${token};Max-Age=${timeout}`)
    }
    if (tokens.includes('refreshToken')) {
      const token = jwt.sign({ userId, token: 'refresh' }, process.env.JWT_SECRET)
      // рефреш токен сохраняем в базе у юзера
      try {
        await Prisma.user.update({
          where: {
            id: userId
          },
          data: {
            refreshToken: token
          }
        })
        const timeout = 60 * 60 * 2 // секунды
        cookie.push(`refreshToken=${token};Max-Age=${timeout}`)
      } catch (e) {
        console.log('error on update refreshToken')
      }
    }
    if (cookie.length) {
      context.res.setHeader('Set-Cookie', cookie)
    }
  }
}

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

// Создаем токены, отправляем куками на клиент, рефреш токен сохраняем в базе у юзера
const login = async (context: Record<string, any>, phoneUser: string): Promise<User | null> => {
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

    await createAndSendTokens(context, userData.id, ['accessToken', 'refreshToken'])

    delete userData.refreshToken
    return userData
  } catch (e) {
    console.log('user not found')
  }
}

const logout = async (context: Record<string, any>, userId: string): Promise<void> => {
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

// Проверяем токены юзыра, если что обновляем первый токен или разлогиниваем
const verifyUser = async (context: Record<string, any>): Promise<any> => {
  const { accessToken, refreshToken } = getTokens(context)
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
      userId = verifyToken(accessToken)
    } catch (e) {
      console.error('verifyToken(accessToken)')
    }
  }

  if (!userId) {
    try {
      userId = verifyToken(refreshToken)
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
    await createAndSendTokens(context, userData.id, ['accessToken'])
  }

  return userData
}

export default {
  verifyToken,
  login,
  logout,
  verifyUser
}
