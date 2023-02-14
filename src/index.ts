import 'reflect-metadata'
import { isObject, isArray } from 'lodash'
import { ApolloServer } from 'apollo-server'
import { PrismaClient } from '@prisma/client'
import { buildSchema } from 'type-graphql'
import { resolvers } from '@generated/type-graphql'
import CustomAuthChecker from './CustomAuthChecker'
import CustomResolvers from './CustomResolvers'
import './Permissions'
import { verifyToken } from './Utils'

import HandleErrors from './Services/HandleErrors'

const prisma = new PrismaClient()

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

      // console.log(req.body.variables)

      const variables = req.body?.variables

      const findToken = (obj) => {
        Object.keys(obj).forEach(key => {
          if (isArray(obj[key])) {
            return
          }
          if (isObject(obj[key])) {
            findToken(obj[key])
          }
          if (obj[key] === 'idByToken') {
            // здесь меняем idByToken на id клиента из jwt
            obj[key] = 1
          }
        })
      }

      if (variables) {
        findToken(variables)
      }

      // console.log('variables', variables)

      // throw new AuthenticationError(ERRORS_TRANSLATION[EErrors.hasNotToken])

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
