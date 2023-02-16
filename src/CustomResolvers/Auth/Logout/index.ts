import JWT from '../../../Services/JWT'
import {
  Arg,
  Ctx,
  Query,
  Resolver
} from 'type-graphql'

import { User } from '@generated/type-graphql'

@Resolver()
export class CustomResolverAuthLogout {
  // кастомный метод, принимающий аргументы определенного типа
  @Query(returns => User, { nullable: true })
  async logout (
    @Ctx() context,
      // @Arg('password') password: string,
      @Arg('userId') userId: string
  ): Promise<null> {
    try {
      await JWT.logout(context, userId)
    } catch (e) {

    }
    return null
  }
}
