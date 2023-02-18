import {
  type ResolversEnhanceMap,
  applyResolversEnhanceMap
} from '@generated/type-graphql'

// указываем роутам доступные роли
import { Authorized } from 'type-graphql'

const resolversEnhanceMap: ResolversEnhanceMap = {
  User: {
    user: [Authorized('VIEWER')]
  }
}

applyResolversEnhanceMap(resolversEnhanceMap)
