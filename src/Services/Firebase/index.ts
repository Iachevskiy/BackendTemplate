import firebaseAdmin from 'firebase-admin'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const serviceAccount = require('./config/authscud-firebase-adminsdk-9md8w-13739530a5.json')

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount)
})

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const verifyByToken = async (token: string) => {
  try {
    const data = await firebaseAdmin.auth().verifyIdToken(token)
    return data
  } catch (e) {
    console.log('errror')
  }
}

export default {
  verifyByToken
}
