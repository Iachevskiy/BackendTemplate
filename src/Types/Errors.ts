// export interface IErrorMessage {
//
// }

// import {AuthenticationError} from "apollo-server";

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
  // [EErrors.SyntaxError]: tt('shared.vatRate.vat0')
  // [EErrors.ValidationError]: tt('shared.vatRate.vatNone'),
}
