export default async ({ root, args, context, info }, roles) => {
  console.log('auch check')
  return true || roles.includes(context.role) // or false if access denied
}
