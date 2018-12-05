let { EventEmitter } = require('events');

if ( 'object' === typeof window ) {
  module.exports = function(...args) {
    let ws  = new WebSocket(...args);
    let out = new EventEmitter;
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

      // DEBUG
      // this is to verify packages are actually being received
      console.log('incoming:', chunk);

      out.emit('message', chunk);
    };
    out.send = function(chunk) {
      ws.send(chunk);
    };
    return out;
  };

} else {
  module.exports = require('ws');
}
