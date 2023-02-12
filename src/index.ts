import 'reflect-metadata'
import { ApolloServer } from 'apollo-server'
import { PrismaClient } from '@prisma/client'
import { buildSchema } from 'type-graphql'
import { resolvers } from '@generated/type-graphql'

import CustomAuthChecker from './CustomAuthChecker'
import CustomResolvers from './CustomResolvers'
import './Permissions'
import { verifyToken } from './Utils'

const prisma = new PrismaClient()

const setHttpPlugin = {
  async requestDidStart () {
    return {
      async willSendResponse ({ response }) {
        // response.http.headers.set('Custom-Header', 'hello')
        // console.log('willSendResponse', response?.errors?.[0])
        if (response?.errors?.[0]?.message === 'Invalid token firebase') {
          response.http.status = 400
        }
      }
    }
  }
}

const app = async (): Promise<void> => {
  const schema = await buildSchema({
    resolvers: [...resolvers, ...CustomResolvers],
    authChecker: CustomAuthChecker,
    validate: { forbidUnknownValues: false }
  })

  const server = new ApolloServer({
    schema,
    context: async ({ req, res }) => {
      // get the user token from the headers

      // res.setHeader('Set-Cookie', 'testcuc=testdd')

      const authHeader = req.headers.authorization
      // console.log(' cookie', req.headers.cookie)
      const token = authHeader?.split(' ')[1]
      if (token == null) {
        return {
          prisma, res
        }
      }

      // console.log('ApolloServer authHeader 2', authHeader)
      const { userId, role } = await verifyToken(token)

      return {
        userId,
        role,
        prisma
      }
    },
    formatError: (err) => {
      console.log('formatError', err.message)
      // Don't give the specific errors to the client.
      if (err.message.startsWith('Database Error: ')) {
        return new Error('Internal server error')
      }

      // Otherwise return the original error. The error can also
      // be manipulated in other ways, as long as it's returned.
      return err
    },
    csrfPrevention: true,
    cors: {
      origin: ['https://studio.apollographql.com', 'http://localhost:3000'],
      credentials: true
    },
    plugins: [
      setHttpPlugin
    ]
  })

  server.listen({ port: 4000 }, () => { console.log('🚀 Server ready at: <http://localhost:4000>') }
  )
}

app()
