import {
    Arg,
    Ctx, Field,
    Mutation, ObjectType,
    Resolver
} from "type-graphql";

import { UserCreateInput } from "@generated/type-graphql";
import {signToken, hashPassword} from '../../../Utils'

import { UserWithToken } from '../../../Types'


@Resolver()
export class CustomResolverAuthRegister {
    // кастомный метод, принимающий аргументы определенного типа
    @Mutation(returns => UserWithToken, { nullable: true })
    async register(
        @Ctx() { prisma },
        @Arg("data") newUserData: UserCreateInput,
    ): Promise<UserWithToken | null>
    {
        // @ts-ignore
        const { email, firstName, password } = newUserData;
        const hashedPassword = await hashPassword(password);
        const user = await prisma.user.create({
            data: {
                email, firstName, password: hashedPassword
            },
        });

        const res = {
            ...user,
            token: signToken({ userId: user.id })
        }
        console.log('user', res)
        return res
    }
}