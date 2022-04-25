import FastifyEdge from '../index.js';

const app = FastifyEdge();

app.addHook('onSend', (req, reply, payload) => {
  if (req.url === '/') {
    return `${payload} World!`;
  }
});

app.get('/', (_, reply) => {
  reply.send('Hello');
});

app.get('/redirect', (_, reply) => {
  reply.redirect('/');
});

app.get('/route-hook', {
  onRequest (_, reply) {
    reply.send('<b>Content from onRequest hook</b>');
  },
  handler (_, reply) {
    reply.type('text/html');
  }
});
