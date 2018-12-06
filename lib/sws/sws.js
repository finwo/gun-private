const rc4       = require('rc4-crypt'),
      transform = require('ws-transform'),
      WS        = require('cws');

module.exports = function (key) {

  // Creating an encrypted client
  function sws(...args) {
    return transform(new WS(...args), {
      egress : rc4(key),
      ingress: rc4(key),
      convert: 'string'
    })
  }

  // Creating an encrypted server
  sws.Server = function (...args) {
    let server = new WS.Server(...args),
        local  = Object.create(server);

    // Intercept event registering
    local.on = function (type, listener) {
      if ('connection' !== type) {
        server.on(type, listener);
        return local;
      }
      server.on('connection', function (socket, req) {
        listener(transform(socket, {
          egress : rc4(key),
          ingress: rc4(key),
          convert: 'string'
        }), req);
      });
      return local;
    };

    // Return the intercepted server
    return local;
  };

  // Add alias
  sws.Client = sws;

  // Return the encrypted socket lib
  return sws;
};
