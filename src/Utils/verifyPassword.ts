import { verify } from "argon2";

export const verifyPassword = async (hash, password) => {
    console.log('verifyPassword')
    return await verify(hash, password);
};