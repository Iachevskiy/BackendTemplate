import JWT from '../../../Services/JWT'
import {
  // Arg,
  Ctx,
  Query,
  Resolver
} from 'type-graphql'

import { User } from '@generated/type-graphql'
import { AuthenticationError } from 'apollo-server'
import { EErrors } from '../../../Types'

@Resolver()
export class CustomResolverAuthVerification {
  // кастомный метод, принимающий аргументы определенного типа
  @Query(returns => User, { nullable: true })
  async verification (
    @Ctx() context
      // @Arg('password') password: string,
      // @Arg('userId') userId: string
  ): Promise<User | null> {
    console.log('CustomResolverAuthVerification')

    try {
      const userData = await JWT.verifyUser(context)
      return userData
    } catch (e) {
      throw new AuthenticationError(EErrors.hasNotToken)
    }
  }
}
