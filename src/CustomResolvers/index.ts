import { CustomResolverAuthRegister } from './Auth/Register'
import { CustomResolverAuthLogin } from './Auth/Login'
import { CustomResolverLoginByFirebaseToken } from './Auth/Login/ByFirebase'
import { CustomResolverAuthLogout } from './Auth/Logout'

export default [
  CustomResolverAuthRegister,
  CustomResolverAuthLogin,
  CustomResolverLoginByFirebaseToken,
  CustomResolverAuthLogout
]
