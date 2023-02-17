import {
  Arg,
  Ctx,
  Query,
  Resolver
} from 'type-graphql'

import { User } from '@generated/type-graphql'

import Firebase from '../../../../Services/Firebase'
import JWT from '../../../../Services/JWT'

@Resolver()
export class CustomResolverLoginByFirebaseToken {
  // кастомный метод, принимающий аргументы определенного типа
  @Query(returns => User, { nullable: true })
  async loginByFirebaseToken (
    @Ctx() context,
      @Arg('tokenFirebase') tokenFirebase: string
  ): Promise<User | null> {
    console.log('loginByFirebaseToken')

    try {
      // проверяем токен firebase
      const data = await Firebase.verifyByToken(tokenFirebase)
      console.log('data', data)
      // логинем
      const user: User = await JWT.login(context, '+79228360292')
      console.log('user', user)

      return user
    } catch (e) {

    }

    return null
  }
}
