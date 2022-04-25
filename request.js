
// query
// body
// params
// headers
// raw
// req
// server
// id
// log
// ip
// ips
// hostname
// protocol
// method
// url
// routerMethod
// routerPath
// is404
// connection
// socket
// context

const kBody = Symbol('kBody');

export const readBody = Symbol('readBody');

export default class FastifyEdgeRequest {
  url = null
  query = null
  body = null
  params = null
  headers = null
  raw = null
  constructor (request, url, route) {
    this.url = `${url.pathname}${url.search}`;
    this.origin = url.origin;
    this.hostname = url.hostname;
    this.protocol = url.protocol.replace(':', '');
    this.raw = request;
    this.query = new Proxy(url.searchParams, {
      get: (params, param) => params.get(param),
    });
    this.params = route.params;
    this.headers = new Proxy(this.raw.headers, {
      get: (headers, header) => headers.get(header),
    });
  }

  get body () {
    return this[kBody] || this.raw.body;
  }

  async [readBody] () {
    // Mostly adapted from https://developers.cloudflare.com/workers/examples/read-post/
    const { headers } = this.raw;
    const contentType = headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      this[kBody] = await this.raw.json();
    } else if (contentType.includes('application/text')) {
      this[kBody] = this.raw.text();
    } else if (contentType.includes('text/html')) {
      this[kBody] = this.raw.text();
    } else if (contentType.includes('form')) {
      const formData = await this.raw.formData();
      const body = {};
      for (const entry of formData.entries()) {
        body[entry[0]] = entry[1];
      }
      this[kBody] = body;
    }
  }
}
