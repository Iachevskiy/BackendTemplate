import { ERRORS_TRANSLATION, ERRORS_HTTP_CODE } from '../../Types'

export default {
  async requestDidStart () {
    return {
      async willSendResponse ({ response }) {
        const errorMessage = response?.errors?.[0]?.message
        if (errorMessage) {
          console.log('errorMessage', errorMessage)
          response.errors[0].message = ERRORS_TRANSLATION[errorMessage] || 'Error unknown'
          response.http.status = ERRORS_HTTP_CODE[errorMessage] || 500
        }
      }
    }
  }
}
