export enum EErrors {
  hasNotToken = 'hasNotToken',
}

export enum EErrorsTypes {
  AuthenticationError = 'AuthenticationError',
  SyntaxError = 'SyntaxError',
  ValidationError = 'ValidationError',
  ForbiddenError = 'ForbiddenError',
  UserInputError = 'UserInputError',
}

export const ERRORS_TRANSLATION = {
  [EErrors.hasNotToken]: 'Отсутствует токен авторизации, авторизуйтесь, пожалуйста'
}

export const ERRORS_HTTP_CODE = {
  [EErrors.hasNotToken]: 404
}
