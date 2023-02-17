import {
  Arg,
  Ctx,
  Query,
  Resolver
} from 'type-graphql'

import { User } from '@generated/type-graphql'
import { AuthenticationError } from 'apollo-server'
import { EErrors } from '../../Types'
import Firebase from '../../Services/Firebase'
import JWT from '../../Services/JWT'

@Resolver()
export class CustomResolverAuth {
  // Метод верификации пользователя по токенам
  @Query(returns => User, { nullable: true })
  async verification (@Ctx() context): Promise<User | null> {
    try {
      const userData = await JWT.verifyUser(context)
      return userData
    } catch (e) {
      throw new AuthenticationError(EErrors.hasNotToken)
    }
  }

  // Метод для сброса токенов/ выхода из системы
  @Query(returns => User, { nullable: true })
  async logout (@Ctx() context, @Arg('userId') userId: string): Promise<null> {
    try {
      await JWT.logout(context, userId)
    } catch (e) {

    }
    return null
  }

  // Метод для авторизации по токену Firebase
  @Query(returns => User, { nullable: true })
  async loginByFirebaseToken (@Ctx() context, @Arg('tokenFirebase') tokenFirebase: string): Promise<User | null> {
    try {
      // проверяем токен firebase
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { phone_number } = await Firebase.verifyByToken(tokenFirebase)
      // логинем
      const user: User = await JWT.login(context, phone_number)

      console.log('user', user)

      return user
    } catch (e) {
      console.log('loginByFirebaseToken error')
    }
    return null
  }

  // Метод для авторизации по токену Firebase
  @Query(returns => User, { nullable: true })
  async liteLogin (@Ctx() context): Promise<User | null> {
    try {
      const user: User = await JWT.login(context, '+79228360292')

      console.log('user', user)

      return user
    } catch (e) {
      console.log('liteLogin error')
    }
    return null
  }
}
