import {
    Arg,
    Ctx,
    Query,
    Resolver
} from "type-graphql";

import { UserWithToken } from '../../../Types'

import {signToken, verifyPassword, verifyToken} from '../../../Utils'

@Resolver()
export class CustomResolverAuthLogin {
    // кастомный метод, принимающий аргументы определенного типа
    @Query(returns => UserWithToken, {nullable: true})
    async login(
        @Ctx() {prisma},
        @Arg("password") password: string,
        @Arg("email",) email: string,
    ): Promise<UserWithToken | null> {
        const result = await prisma.user.findUnique({
            where: { email },
        });
        const isValidPassword =  await verifyPassword(result.password, password);

        // console.log('result', result, isValidPassword)

        const token = signToken({
                userId: result.id,
                role: 'ADMIN'
            })
        // const verifyTokenr = await verifyToken(token);
        // console.log('token', token, verifyTokenr)

        if (isValidPassword) {
            return {
                ...result,
                token,
            }
        } else {
            throw new Error("Invalid password");
            return null
        }

    }
}