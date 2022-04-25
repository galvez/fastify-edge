# fastify-edge

An experimental **lightweight worker version** of [Fastify](https://fastify.io).

Currently **Cloudflare Workers** are supported.

**Deno Deploy** support is planned next.

## Install

```js
npm i fastify-edge --save
````

## Usage

```js
import FastifyEdge from 'fastify-edge'

const app = FastifyEdge()

app.addHook('onSend', (req, reply, payload) => {
  return `${payload} World!`
})

app.get('/', (req, reply) => {
  reply.send('Hello')
})
```

See [`example/`](https://github.com/galvez/fastify-edge/tree/main/example) with [`miniflare`](https://github.com/cloudflare/miniflare).

## Hooks

The original Fastify `onRequest`, `onSend` and `onResponse` are supported.

## Limitations

- No support for `preHandler`, `preParsing` and `preValdation` hooks
- No support for Fastify's plugin system (yet)
- No support for Fastify's logging and validation facilities
- Still heavily experimental, more equivalent APIs coming soon
