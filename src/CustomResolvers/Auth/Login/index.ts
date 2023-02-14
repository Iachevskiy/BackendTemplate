import {
  Arg,
  Ctx,
  Query,
  Resolver
} from 'type-graphql'
import {
  User
} from '@generated/type-graphql'

// import { UserWithToken } from '../../../Types'

// @ts-expect-error
import firebaseAdmin from 'firebase-admin'
// import apolo from 'apollo-server'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const serviceAccount = require('./config/authscud-firebase-adminsdk-9md8w-13739530a5.json')

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount)
})

// import { signToken, verifyPassword } from '../../../Utils'

@Resolver()
export class CustomResolverAuthLogin {
  // кастомный метод, принимающий аргументы определенного типа
  @Query(returns => User, { nullable: true })
  async login (
    @Ctx() context,
      // @Arg('password') password: string,
      @Arg('tokenFirebase') tokenFirebase: string
  ): Promise<User | null> {
    const { prisma, res } = context
    const result: User = await prisma.user.findUnique({
      where: { id: 1 }
    })

    // console.log('login context ', context)

    const tt = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjVhNTA5ZjAxOWY3MGQ3NzlkODBmMTUyZDFhNWQzMzgxMWFiN2NlZjciLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vYXV0aHNjdWQiLCJhdWQiOiJhdXRoc2N1ZCIsImF1dGhfdGltZSI6MTY3NjEyNjkyMiwidXNlcl9pZCI6Ik1wbUdaNEtTOWpaNWZ5c0pvbmlSblc3OTNLMzIiLCJzdWIiOiJNcG1HWjRLUzlqWjVmeXNKb25pUm5XNzkzSzMyIiwiaWF0IjoxNjc2MTI2OTIyLCJleHAiOjE2NzYxMzA1MjIsInBob25lX251bWJlciI6Iis3OTIyODM2MDI5MiIsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsicGhvbmUiOlsiKzc5MjI4MzYwMjkyIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGhvbmUifX0.FVy6QyH41TupNej1j8STI01sBoDChq9hUvWWjg9MyJdAmKiSvtY2_9UHyq_RNN76-jdW6OG8imTuGqV2PtQE_FqYlZhFpMLDrg-6BA-TKQ9eEOprvDV15SKobJn2HeZHadWhycI-79vqfD2bhTSCbmHnAB59yaL3lHxQ-PGvGdSpRKRC0DoqfpYFue_86IUkENYsGModNsumAdOS-x5hvS9EOSGR8YABoPNUFURYGhTOLVcNf3uBj51x6D4symenaL61P1pBOOmMZJ51YQDZQl1JYauIA5WALY8qsoHJbkMfuXma3Uy5tx0L44_7gNlM_Ue4xfeWO8DSlYQey-HlIA'
    const ttError = 'yJhbGciOiJSUzI1NiIsImtpZCI6IjVhNTA5ZjAxOWY3MGQ3NzlkODBmMTUyZDFhNWQzMzgxMWFiN2NlZjciLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vYXV0aHNjdWQiLCJhdWQiOiJhdXRoc2N1ZCIsImF1dGhfdGltZSI6MTY3NjEyNjkyMiwidXNlcl9pZCI6Ik1wbUdaNEtTOWpaNWZ5c0pvbmlSblc3OTNLMzIiLCJzdWIiOiJNcG1HWjRLUzlqWjVmeXNKb25pUm5XNzkzSzMyIiwiaWF0IjoxNjc2MTI2OTIyLCJleHAiOjE2NzYxMzA1MjIsInBob25lX251bWJlciI6Iis3OTIyODM2MDI5MiIsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsicGhvbmUiOlsiKzc5MjI4MzYwMjkyIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGhvbmUifX0.FVy6QyH41TupNej1j8STI01sBoDChq9hUvWWjg9MyJdAmKiSvtY2_9UHyq_RNN76-jdW6OG8imTuGqV2PtQE_FqYlZhFpMLDrg-6BA-TKQ9eEOprvDV15SKobJn2HeZHadWhycI-79vqfD2bhTSCbmHnAB59yaL3lHxQ-PGvGdSpRKRC0DoqfpYFue_86IUkENYsGModNsumAdOS-x5hvS9EOSGR8YABoPNUFURYGhTOLVcNf3uBj51x6D4symenaL61P1pBOOmMZJ51YQDZQl1JYauIA5WALY8qsoHJbkMfuXma3Uy5tx0L44_7gNlM_Ue4xfeWO8DSlYQey-HlIA'

    // const test = async (): Promise<boolean | string> => {
    //   const number = false
    try {
      // await firebaseAdmin.auth().verifyIdToken(tokenFirebase)
      // console.log(res)
    } catch (error) {
      // throw new UserInputError('Invalid token firebase', {
      //   argumentName: 'token'
      // })
    }

    //
    //   return number
    // }
    // const number = test()
    // if (!number) {
    //   throw new UserInputError('Invalid argument value', {
    //     argumentName: 'id'
    //   })
    // }

    // const isValidPassword = await verifyPassword(result.password, password)

    // console.log('result', result, isValidPassword)

    // const token = signToken({
    //   userId: result.id,
    //   role: 'ADMIN'
    // })
    // const verifyTokenr = await verifyToken(token);
    // console.log('token', token, verifyTokenr)

    return {
      ...result
    }
    // if (isValidPassword) {
    //   return {
    //     ...result,
    //     token
    //   }
    // } else {
    //   throw new Error('Invalid password')
    // }
  }
}
