import jwt from 'jsonwebtoken'
import cookie from 'cookie'
import Prisma from '@/Services/Prisma'

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

export default {
  verifyToken,
  createAndSendTokens,
  getTokens
}
