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

The raw `fetch` request object.

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

Sets the `fetch` response `status` property.

</td>
</tr>
<tr>
<td>

`reply.header(key, value)`

</td>
<td>
  
Adds an individual header to the `fetch` response `headers` object.
  
</td>
</tr>
<tr>
<td>

`reply.headers(object)`

</td>
<td>

Adds multiple headers to the `fetch` response `headers` object.

</td>
</tr>
<tr>
<td>

`reply.getHeader(key)`

</td>
<td>

Retrieves an individual header from `fetch` response `headers` object.

</td>
</tr>
<tr>
<td>

`reply.getHeaders()`

</td>
<td>

Retrieves all headers from `fetch` response `headers` object.

</td>
</tr>
<tr>
<td>

`reply.removeHeader(key)`

</td>
<td>

Remove an individual header from `fetch` response `headers` object.

</td>
</tr>
<tr>
<td>

`reply.hasHeader(header)`

</td>
<td>

Asserts presence of an individual header in the `fetch` response `headers` object.

</td>
</tr>
<tr>
<td>

`reply.redirect(code, dest)`<br>
`reply.redirect(dest)`

</td>
<td>

Sets the `status` and redirect location for the `fetch` response object.<br>
Defaults to the HTTP **302 Found** response code.

</td>
</tr>
<tr>
<td>

`req.type(contentType)`

</td>
<td>

Sets the `content-type` header for the `fetch` response object.

</td>
</tr>
<tr>
<td>

`req.send(data)`

</td>
<td>

Sets the `body` for the `fetch` response object.<br>

Can be a **string**, an **object**, a **buffer** or a **stream**.

Objects are automatically serialized as JSON.

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
