import jwt from 'jsonwebtoken'
import cookie from 'cookie'
import Prisma from '../Prisma'
import { type User } from '@generated/type-graphql'

const createToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET)
}

const verifyToken = (token): boolean => {
  return !!jwt.verify(token, process.env.JWT_SECRET) || false
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

    // Set a new cookie with the name
    context.res.setHeader('Set-Cookie', cookie.serialize('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 60 * 60 // 1 час
    }))
    // Set a new cookie with the name
    context.res.setHeader('Set-Cookie', cookie.serialize('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 2 // 1 час
    }))

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
    context.res.setHeader('Set-Cookie', cookie.serialize('accessToken', null))
    context.res.setHeader('Set-Cookie', cookie.serialize('refreshToken', null))
  } catch (e) {
    console.log('error can not logout')
  }
}

// Проверяем токены юзыра, если что обновляем первый токен или разлогиниваем
const verifyUser = (token): boolean => {
  return true
}

export default {
  createToken,
  verifyToken,
  login,
  logout,
  verifyUser
}
