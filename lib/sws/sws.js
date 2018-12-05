const WS      = ('function' === typeof WebSocket) ? WebSocket : require('ws'),
      through = require('through'),
      rc4     = require('rc4');

console.log(WS);

function wrapSocket( socket, key ) {
  let ws       = Object.create(socket),
      listener = function(){};

  // let encrypt = rc4(key),
  //     decrypt = rc4(key);
  //
  let queue = [];

  // Intercept send
  ws.send = async function(plain) {
  //   console.log('out', plain);
  //   let ciphertext = await encrypt(plain);
  //   queue.push(ciphertext);
    queue.push(plain);
    let current = null;
    try {
      while(queue.length) {
        current = queue.shift();
        socket.send(current);
      }
    } catch(e) {
      if(current) queue.unshift(current);
    }
  };

  if ('on' in socket) {
  //   console.log('node');
  //
    // Intercept on-message
    ws.on = function(type, listener) {
      console.log('ws.on', type, listener);
      switch(type) {
        case 'message':
          async function incoming(ciphertext) {
  //           console.log('INCOMING MESSAGE');
            console.log('in',ciphertext);
  //           let plain = await decrypt(ciphertext.data || ciphertext);
  //           console.log('in:', plain.toString());
  //           listener(plain.toString());
            listener(ciphertext);
          }
          return socket.on('message',incoming);
        default:
          return socket.on(type,listener);
      }
    };

  } else {
    console.log('browser');

    // Intercept onmessage
    socket.onmessage = async function incoming(ciphertext) {
      ciphertext = ciphertext.data || ciphertext;

      if ('function' === typeof Blob) {
        if (ciphertext instanceof Blob) {
          ciphertext = Buffer.from(await new Response(ciphertext).arrayBuffer());
        }
      }

      console.log('in', ciphertext);
      // let plain = await decrypt(ciphertext.data || ciphertext);
      // console.log('in:', plain.toString());
      // listener(plain.toString());
      listener(ciphertext);
    };

    Object.defineProperty(ws,'onmessage', {
      enumerable  : true,
      configurable: true,
      get         : () => listener,
      set         : (value) => listener = value,
    });
  //
  }


  return ws;
}

module.exports = function (key) {
  function sws(...args) {
    return wrapSocket(new WS(...args),key);
  }

  sws.Server = function (...args) {
    let org = new WS.Server(...args),
        wss = Object.create(org);

    // Intercept on-connection
    wss.on = function (type, listener) {
      switch (type) {

        // Add encryption layer
        case 'connection':
          return org.on(type, function (socket, req) {
            listener(wrapSocket(socket,key),req);
          });

        // Do not modify
        default:
          return org.on(type, listener);
      }
    };

    return wss;
  };

  return sws;
};



