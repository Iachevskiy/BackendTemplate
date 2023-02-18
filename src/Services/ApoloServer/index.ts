import { buildSchema } from 'type-graphql'
import CustomResolvers from '@/CustomResolvers'
import HandleAuthCheck from '@/Services/HandleAuthCheck'
import { resolvers } from '@generated/type-graphql'
import { ApolloServer } from 'apollo-server'
import prisma from '@/Services/Prisma'
import HandleErrors from '@/Services/HandleErrors'
import '@/Services/HandlePermissions'

export default async (): Promise<any> => {
  const schema = await buildSchema({
    resolvers: [...resolvers, ...CustomResolvers],
    authChecker: HandleAuthCheck,
    validate: { forbidUnknownValues: false }
  })

  const server = new ApolloServer({
    schema,
    context: async (context) => {
      // JWT.verifyUser(context)
      return {
        prisma,
        res: context.res,
        req: context.req
      }
    },
    csrfPrevention: true,
    cors: {
      origin: ['https://studio.apollographql.com', 'http://localhost:3000'],
      credentials: true
    },
    plugins: [
      HandleErrors
    ]
  })
  return server // or false if access denied
}
