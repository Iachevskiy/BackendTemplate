import {Field, ObjectType} from "type-graphql";
import {
    User,
} from "@generated/type-graphql";

@ObjectType()
export class UserWithToken extends User {
    @Field()
    token: string;
}