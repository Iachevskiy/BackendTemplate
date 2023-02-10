import 'reflect-metadata'
import { ApolloServer } from 'apollo-server'
import { PrismaClient } from '@prisma/client';
import { buildSchema } from "type-graphql";
import { resolvers } from "@generated/type-graphql";

import CustomAuthChecker from './CustomAuthChecker'
import CustomResolvers from './CustomResolvers'
import './Permissions'
import { verifyToken } from "./Utils";


const prisma = new PrismaClient()

const app = async () => {

    const schema = await buildSchema({
        resolvers: [...resolvers, ...CustomResolvers ],
        authChecker: CustomAuthChecker,
        validate: { forbidUnknownValues: false }
    })

    const server = new ApolloServer({
        schema,
        context: async ({ req}) => {
            // get the user token from the headers

            const authHeader = req.headers.authorization
            console.log('ApolloServer authHeader', authHeader)
            const token = authHeader && authHeader.split(' ')[1];
            if (token == null) {
                return {
                    prisma
                };
            }

            console.log('ApolloServer authHeader 2', authHeader)
            const { userId, role} = await verifyToken(token);

            return {
                userId,
                role,
                prisma
            };


        },
    });

    server.listen({ port: 4000 }, () =>
        console.log('🚀 Server ready at: <http://localhost:4000>')
    )
}

app()