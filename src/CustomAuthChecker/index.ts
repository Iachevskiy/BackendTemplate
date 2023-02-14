// валидация ролей
import { AuthenticationError } from 'apollo-server'
import { EErrors, ERRORS_TRANSLATION } from '../Types'

export default ({ root, args, context, info }, roles) => {
  console.log('customAuthChecker context 3', args, roles)
  args.where.id = 22
  // throw new AuthenticationError(ERRORS_TRANSLATION[EErrors.hasNotToken])

  return true || roles.includes(context.role) // or false if access denied
}
