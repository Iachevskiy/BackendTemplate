// валидация ролей
export default ({ root, args, context, info }, roles) => {
        // here you can read user from context -  context.role
        // and check his permission in db against `roles` argument
        // that comes from `@Authorized`, eg. ["ADMIN", "MODERATOR"] roles
        console.log('customAuthChecker context 3', args)
        return roles.includes(context.role); // or false if access denied
    }