import { ERRORS_TRANSLATION } from '../../Types'

export default {
  async requestDidStart () {
    console.log('34 setHttpPlugin 00')
    return {
      async willSendResponse ({ response }) {
        // response.http.headers.set('Custom-Header', 'hello')
        // console.log('willSendResponse', response?.errors?.[0])
        console.log('setHttpPlugin 0')
        if (response?.errors?.[0]?.message) {
          console.log('setHttpPlugin 1')
          response.http.status = 401

          response.errors[0].message = response.errors[0].message.replace('Context creation failed: ', '5')

          const errorMessage = ERRORS_TRANSLATION[response.errors[0].message]
          console.log('setHttpPlugin 2')
          if (errorMessage) {
            console.log('setHttpPlugin 3')
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            response.errors[0].message === errorMessage
            console.log('setHttpPlugin 4')
          }
        }
      }
    }
  }
}
