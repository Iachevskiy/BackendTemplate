import 'reflect-metadata'

import { ApolloServer } from 'apollo-server'
import prisma from './Services/Prisma'
import JWT from './Services/JWT'

import { buildSchema } from 'type-graphql'
import { resolvers } from '@generated/type-graphql'
import CustomAuthChecker from './CustomAuthChecker'
import CustomResolvers from './CustomResolvers'
import './Permissions'

import HandleErrors from './Services/HandleErrors'

const app = async (): Promise<void> => {
  const schema = await buildSchema({
    resolvers: [...resolvers, ...CustomResolvers],
    authChecker: CustomAuthChecker,
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

  server.listen({ port: 4000 }, () => { console.log('🚀 Server ready at: <http://localhost:4000>') }
  )
}

app()
