import { FastifyEdge, sendResponse } from './index.js';

class FastifyBun extends FastifyEdge {
  setup () {
    this.fetch = request => this[sendResponse](request);
  }
}

export default (...args) => new FastifyBun(...args);
