
// https://www.fastify.io/docs/latest/Reference/Reply
// - statusCode ✅
// - code(statusCode) ✅
// - header(key, value) ✅
// - headers(object) ✅
// - getHeader(key) ✅
// - getHeaders() ✅
// - removeHeader(key) ✅
// - hasHeader(key) ✅
// - trailer(key, function) ❌
// - hasTrailer(key) ❌
// - removeTrailer(key) ❌
// - redirect([code,] dest) ✅
// - callNotFound() ❌
// - getResponseTime() ❌
// - type(contentType) ✅
// - serializer(func) ❌
// - sent ❌
// - hijack() ❌
// - type (contentType) ✅
// - send (data) ✅

const kStatusCode = Symbol('kStatusCode');
const kHeaders = Symbol('kHeaders');
const kRequest = Symbol('kRequest');

const buildRedirectLocation = Symbol('buildRedirectLocation');

export const kRedirect = Symbol('kRedirect');
export const kBody = Symbol('kBody');
export const kResponse = Symbol('kResponse');

export default class FastifyEdgeReply {
  [kStatusCode] = 200

  get [kResponse] () {
    return {
      status: this[kStatusCode],
      headers: this[kHeaders],
    };
  }

  constructor (req) {
    this[kRequest] = req;
    this[kHeaders] = {};
  }

  get statusCode () {
    return this[kStatusCode];
  }

  set statusCode (statusCode) {
    this[kStatusCode] = statusCode;
  }

  code (statusCode) {
    this[kStatusCode] = statusCode;
  }

  header (key, value) {
    this[kHeaders][key] = value;
  }

  headers (object) {
    Object.assign(this[kHeaders], object);
  }

  getHeader (key) {
    return this[kHeaders][key];
  }

  getHeaders () {
    return this[kHeaders];
  }

  removeHeader (key) {
    delete this[kHeaders][key];
  }

  hasHeader (key) {
    return key in this[kHeaders];
  }

  redirect (...args) {
    if (args.length === 1) {
      this[kRedirect] = [this[buildRedirectLocation](args[0]), 302];
    } else {
      this[kRedirect] = [this[buildRedirectLocation](args[1]), args[0]];
    }
  }

  type (contentType) {
    this[kHeaders]['content-type'] = contentType;
  }

  send (data) {
    if (typeof data === 'string') {
      if (!('content-type' in this[kHeaders])) {
        this[kHeaders]['content-type'] = 'text/plain; charset=utf-8';
      }
      this[kBody] = data;
    } else if (typeof data === 'object') {
      this[kBody] = JSON.stringify(data, null, 2);
    }
  }

  [buildRedirectLocation] (location) {
    if (!location.startsWith('http')) {
      console.log(this[kRequest]);
      return `${this[kRequest].protocol}://${this[kRequest].origin}${location}`;
    }
    return location;
  }
}
