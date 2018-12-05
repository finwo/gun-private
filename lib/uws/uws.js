let { EventEmitter } = require('events');

if ( 'object' === typeof window ) {
  module.exports = function(...args) {
    let ws  = new WebSocket(...args);
    let out = new EventEmitter();
    ws.onopen = function() {
      out.emit('open')
    };
    ws.onclose = function() {
      out.emit('close')
    };

    ws.onmessage = async function(chunk) {
      chunk = chunk.data || chunk;

      if ('function' === typeof Blob) {
        if (chunk instanceof Blob) {
          chunk = Buffer.from(await new Response(chunk).arrayBuffer());
        }
      }

      out.emit('message', chunk);
    };

    let queue = [];
    out.send = function(chunk) {
      queue.push(chunk);
      let current;
      try {
        while(queue.length) {
          current = queue.shift();
          ws.send(current);
        }
      } catch(e) {
        if (current) queue.unshift(current);
      }
    };
    return out;
  };

} else {
  module.exports = require('ws');
}
