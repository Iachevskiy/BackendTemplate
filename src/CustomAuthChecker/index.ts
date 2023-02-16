// валидация ролей
import { AuthenticationError } from 'apollo-server'
import { EErrors, ERoles } from '../Types'

import { verifyPassword, verifyToken, signToken } from '../Utils'

export default async ({ root, args, context, info }, roles) => {
  // // throw new AuthenticationError(EErrors.hasNotToken)
  // const accessToken = signToken({ userId: '1', ttt: 'ggg' })
  // const refreshToken = signToken({})
  //
  // const data = {
  //   userId: null
  // }
  //
  // try {
  //   //  проверяем входящий accessToken
  //   const { userId } = await verifyToken(accessToken)
  //   data.userId = userId
  // } catch (e) {
  //   // accessToken не валиден, проверяем refreshToken
  //   try {
  //     const { userId } = await verifyToken(refreshToken)
  //     data.userId = userId
  //     //  если refreshToken валиден
  //     //  генерим новый accessToken, возвращаем его на клиент
  //     const newAccessToken = signToken({ userId, ttt: 'ggg' })
  //     // res.setHeader('Set-Cookie', 'accessToken=newAccessToken')
  //   } catch (e) {
  //     // проброс ошибки 403
  //   }
  // }
  console.log('auch check')
  return true || roles.includes(context.role) // or false if access denied
}
