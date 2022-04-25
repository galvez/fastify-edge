import FastifyEdge from '../index.js'

const app = FastifyEdge()

app.addHook('onSend', (req, reply, payload) => {
  return `${payload} World!`
})

app.get('/', (_, reply) => reply.send('Hello'))
