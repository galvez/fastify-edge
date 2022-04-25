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

## Supported APIs

### Request

<table>
<tr>
<td>
  
`query`

</td>
<td>
  
Maps to the `fetch` request URL's `searchParams` object through a `Proxy`.

</td>
</tr>
<tr>
<td>

`body`

</td>
<td>

The consumed body following the parsing pattern from [this example](https://developers.cloudflare.com/workers/examples/read-post/).

</td>
</tr>
<tr>
<td>

`params`

</td>
<td>
  
The parsed route params from the internal Radix-tree router, **[radix3](https://github.com/unjs/radix3)**.
  
</td>
</tr>
<tr>
<td>

`headers`

</td>
<td>
Maps to the `fetch` request `headers` object through a `Proxy`.

</td>
</tr>
<tr>
<td>

`raw`

</td>
<td>The raw `fetch` Request object</td>
</tr>
</table>

## Supported hooks

The original Fastify `onRequest`, `onSend` and `onResponse` are supported.

They can be set at the **global** and **route** levels.

## Limitations

- No support for `preHandler`, `preParsing` and `preValdation` hooks
- No support for Fastify's plugin system (yet)
- No support for Fastify's logging and validation facilities
- Still heavily experimental, more equivalent APIs coming soon
