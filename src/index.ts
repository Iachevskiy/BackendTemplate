import 'module-alias/register'
import 'reflect-metadata'

import * as dotenv from 'dotenv'

import ApoloServer from '@/Services/ApoloServer'
dotenv.config()

const app = async (): Promise<void> => {
  const server = await ApoloServer()

  server.listen(
    { port: 4000 },
    () => { console.log('🚀 Server ready at: <http://localhost:4000>') }
  )
}

app()
