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
  
`req.query`

</td>
<td>
  
Maps to the `fetch` request URL's `searchParams` object through a `Proxy`.

</td>
</tr>
<tr>
<td>

`req.body`

</td>
<td>

The consumed body following the parsing pattern from [this example](https://developers.cloudflare.com/workers/examples/read-post/).

</td>
</tr>
<tr>
<td>

`req.params`

</td>
<td>
  
The parsed route params from the internal Radix-tree router, **[radix3](https://github.com/unjs/radix3)**.
  
</td>
</tr>
<tr>
<td>

`req.headers`

</td>
<td>

Maps to the `fetch` request `headers` object through a `Proxy`.

</td>
</tr>
<tr>
<td>

`req.raw`

</td>
<td>

The raw `fetch` Request object

</td>
</tr>
</table>


### Reply

<table>
<tr>
<td>

`reply.code(code)`

</td>
<td>

Sets the `fetch` Response `status` property.

</td>
</tr>
<tr>
<td>

`reply.header(header, value)`

</td>
<td>
  
Adds an individual header to the `fetch` Response `headers` object.
  
</td>
</tr>
<tr>
<td>

`reply.headers(object)`

</td>
<td>

Adds multiple headers to the `fetch` Response `headers` object.

</td>
</tr>
<tr>
<td>

`req.getHeader(header)`

</td>
<td>

Retrieves an individual header from `fetch` Response `headers` object.

</td>
</tr>
<tr>
<td>

`req.getHeaders()`

</td>
<td>

Retrieves all headers from `fetch` Response `headers` object.

</td>
</tr>
<tr>
<td>

`req.removeHeader(header)`

</td>
<td>

Remove an individual header from `fetch` Response `headers` object.

</td>
</tr>
<tr>
<td>

`req.hasHeader(header)`

</td>
<td>

Asserts presence of an individual header in the `fetch` Response `headers` object.

</td>
</tr>
<tr>
<td>

`req.redirect([code,] dest)`

</td>
<td>

Sets the `statusCode` and redirect `Location` for the `Response` object.

</td>
</tr>
<tr>
<td>

`req.type(contentType)`

</td>
<td>

Sets the `content-type` header for the `Response` object.

</td>
</tr>
<tr>
<td>

`req.send(data)`

</td>
<td>

Sets the `body` for the `Response` object.<br>

Can be a **string**, an **object** (automatically JSON-serialized), a **buffer** or a **stream**.

</td>
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
