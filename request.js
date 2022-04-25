
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

export default class FastifyEdgeRequest {
  query = null
  body = null
  params = null
  headers = null
  raw = null
  constructor (request, url, route) {
    this.raw = request;
    this.query = new Proxy(url.searchParams, {
      get: (params, param) => params.get(param),
    });
    this.params = route.params;
    this.headers = new Proxy(request.headers, {
      get: (headers, header) => headers.get(header),
    });
  }
}
