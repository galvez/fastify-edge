/* global addEventListener */
/* global Response */

import { createRouter } from 'radix3';
import FastifyEdgeRequest, { readBody } from './request.js';
import FastifyEdgeReply, { kBody, kResponse, kRedirect } from './reply.js';

const kHooks = Symbol('kHooks');
const kRouter = Symbol('kRrouter');

const handleRequest = Symbol('handleRequest');
const sendResponse = Symbol('sendResponse');
const getRoute = Symbol('getRoute');
const runHooks = Symbol('runHooks');
const runOnSendHooks = Symbol('runOnSendHooks');

class FastifyEdge {
  [kHooks] = {
    onRequest: [],
    onSend: [],
    onResponse: [],
  };

  [kRouter] = null;

  constructor () {
    this[kRouter] = createRouter();
    addEventListener('fetch', this[handleRequest].bind(this));
  }

  [handleRequest] (event) {
    event.respondWith(this[sendResponse](event.request));
  }

  async [sendResponse] (request) {
    const url = new URL(request.url);
    const route = this[kRouter].lookup(url.pathname);
    if (!route) {
      return new Response('Not found', {
        headers: { 'content-type': 'text/plain' },
        status: 404,
      });
    }
    const req = new FastifyEdgeRequest(request, url, route);
    const reply = new FastifyEdgeReply(req);
    await req[readBody]();
    await this[runHooks](this[kHooks].onRequest, req, reply);
    await this[runHooks](route.onRequest, req, reply);
    await route.handler(req, reply);
    await this[runOnSendHooks](this[kHooks].onSend, req, reply);
    await this[runOnSendHooks](route.onSend, req, reply);
    await this[runHooks](this[kHooks].onResponse, req, reply);
    await this[runHooks](route.onResponse, req, reply);
    if (reply[kRedirect]) {
      return Response.redirect(...reply[kRedirect]);
    } else {
      return new Response(reply[kBody], reply[kResponse]);
    }
  }

  addHook (hook, func) {
    this[kHooks][hook].push(func);
  }

  route (settings) {
    const route = this[getRoute](settings.method, settings.path, settings);
    this[kRouter].insert(route.path, route);
  }

  get (path, settings) {
    const route = this[getRoute]('get', path, settings);
    this[kRouter].insert(path, route);
  }

  post (path, settings) {
    const route = this[getRoute]('post', path, settings);
    this[kRouter].insert(path, route);
  }

  put (path, settings) {
    const route = this[getRoute]('put', path, settings);
    this[kRouter].insert(path, route);
  }

  delete (path, settings) {
    const route = this[getRoute]('delete', path, settings);
    this[kRouter].insert(path, route);
  }

  options (path, settings) {
    const route = this[getRoute]('options', path, settings);
    this[kRouter].insert(path, route);
  }

  async [runHooks] (run, ...args) {
    if (typeof run === 'function') {
      run = [run];
    }
    if (Array.isArray(run)) {
      for (const hook of run) {
        await hook(...args);
      }
    }
  }

  async [runOnSendHooks] (run, req, reply) {
    let altered;
    let payload;
    if (typeof run === 'function') {
      run = [run];
    }
    if (Array.isArray(run)) {
      for (const hook of run) {
        payload = reply[kBody];
        // eslint-disable-next-line no-cond-assign
        if (altered = await hook(req, reply, payload) ?? false) {
          reply[kBody] = altered;
        }
      }
    }
  }

  [getRoute] (method, path, settings = {}) {
    const route = { method, path };
    if (typeof settings === 'function') {
      route.handler = settings;
    } else {
      Object.assign(route, settings);
    }
    return route;
  }
}

export default (...args) => new FastifyEdge(...args);
