const through = require('through'),
      rc4     = require('rc4'),
      WS      = require('uws');

module.exports = function(key) {
  function sws(...args) {
    return wrap(new WS(...args),key);
  }
  sws.Server = function(...args) {
    let server = new WS.Server(...args),
        proxy  = Object.create(server);
    // Intercept on
    proxy.on = function(type,listener) {
      if ('connection' !== type) return server.on(type,listener);
      return server.on('connection', function(socket, req) {
        listener(wrap(socket,key),req);
      });
    };
    return proxy;
  };

  return sws;
};

function wrap(ws,key) {
  let local = Object.create(ws);
  console.log(ws);

  local.send = function(chunk) {
    console.log('OUT', chunk);
    return ws.send(chunk);
  };

  local.on = function( type, listener ) {
    if ('message' !== type) return ws.on(type,listener);
    return ws.on('message', function(chunk) {
      console.log('IN', chunk);
      listener(chunk);
    });
  }

  Object.defineProperty(local,'onmessage',{
    enumerable: true,
    configurable: true,
    get: () => function(){},
    set: listener => local.on('message',listener)
  });

  return local;
}

// function wrapSocket( socket, key ) {
//   let ws       = Object.create(socket),
//       listener = function(){};
//
//   // let encrypt = rc4(key),
//   //     decrypt = rc4(key);
//   //
//   let queue = [];
//
//   // Intercept send
//   ws.send = async function(plain) {
//   //   console.log('out', plain);
//   //   let ciphertext = await encrypt(plain);
//   //   queue.push(ciphertext);
//     queue.push(plain);
//     let current = null;
//     try {
//       while(queue.length) {
//         current = queue.shift();
//         socket.send(current);
//       }
//     } catch(e) {
//       if(current) queue.unshift(current);
//     }
//   };
//
//   if ('on' in socket) {
//   //   console.log('node');
//   //
//     // Intercept on-message
//     ws.on = function(type, listener) {
//       console.log('ws.on', type, listener);
//       switch(type) {
//         case 'message':
//           async function incoming(ciphertext) {
//   //           console.log('INCOMING MESSAGE');
//             console.log('in',ciphertext);
//   //           let plain = await decrypt(ciphertext.data || ciphertext);
//   //           console.log('in:', plain.toString());
//   //           listener(plain.toString());
//             listener(ciphertext);
//           }
//           return socket.on('message',incoming);
//         default:
//           return socket.on(type,listener);
//       }
//     };
//
//   } else {
//     console.log('browser');
//
//     // Intercept onmessage
//     socket.onmessage = async function incoming(ciphertext) {
//       ciphertext = ciphertext.data || ciphertext;
//
//       if ('function' === typeof Blob) {
//         if (ciphertext instanceof Blob) {
//           ciphertext = Buffer.from(await new Response(ciphertext).arrayBuffer());
//         }
//       }
//
//       console.log('in', ciphertext);
//       // let plain = await decrypt(ciphertext.data || ciphertext);
//       // console.log('in:', plain.toString());
//       // listener(plain.toString());
//       listener.call(this,ciphertext);
//     };
//
//     Object.defineProperty(ws,'onmessage', {
//       enumerable  : true,
//       configurable: true,
//       get         : () => listener,
//       set         : (value) => listener = value,
//     });
//   //
//   }
//
//
//   return ws;
// }
