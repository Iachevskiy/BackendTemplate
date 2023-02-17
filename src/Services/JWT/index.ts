import jwt from 'jsonwebtoken'
import cookie from 'cookie'
import Prisma from '../Prisma'
import { type User } from '@generated/type-graphql'

const getTokens = (context: Record<string, any>) => {
  const cookies = cookie.parse(context.req.headers.cookie || '')
  return {
    accessToken: cookies.accessToken,
    refreshToken: cookies.refreshToken
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

const setToken = (context: Record<string, any>, typeToken: 'accessToken' | 'refreshToken', token): void => {
  context.res.setHeader('Set-Cookie', cookie.serialize(typeToken, token, {
    httpOnly: true,
    maxAge: 60 * 60 // 1 час
  }))
}

const createToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET)
}

const verifyToken = (token: string): string => {
  const data: Record<string, any> = jwt.verify(token, process.env.JWT_SECRET) as Record<string, any>
  return data.userId
}

// Создаем токены, отправляем куками на клиент, рефреш токен сохраняем в базе у юзера
const login = async (context: Record<string, any>, phoneUser: string): Promise<User | null> => {
  let userData: User | null = null
  // Ищем юзера по телефону в базе
  try {
    userData = await Prisma.user.findUnique({
      where: { phone: phoneUser }
    })
  } catch (e) {
    console.log('user not found')
  }

  if (userData) {
    const accessToken = createToken(userData.id)
    const refreshToken = createToken(userData.id)

    // рефреш токен сохраняем в базе у юзера
    try {
      await Prisma.user.update({
        where: {
          id: userData.id
        },
        data: {
          refreshToken
        }
      })
    } catch (e) {
      console.log('error on update refreshToken')
    }

    setToken(context, 'accessToken', accessToken)
    setToken(context, 'refreshToken', refreshToken)

    delete userData.refreshToken
    return userData
  }
}

// Принимаем:
// res - для удаления кук с клиента
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
    setToken(context, 'accessToken', null)
    setToken(context, 'refreshToken', null)
  } catch (e) {
    console.log('error can not logout')
  }
}

// Проверяем токены юзыра, если что обновляем первый токен или разлогиниваем
const verifyUser = async (context: Record<string, any>): Promise<any> => {
  console.log('verifyUser')
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
      userData = fetchUser(userId)
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
      userData = fetchUser(userId)
    } catch (e) {
      console.error('load userData')
      throw new Error('')
    }
  }

  if (!accessToken) {
    const accessToken = createToken(userId)
    setToken(context, 'accessToken', accessToken)
  }

  return userData
}

export default {
  createToken,
  verifyToken,
  login,
  logout,
  verifyUser
}
