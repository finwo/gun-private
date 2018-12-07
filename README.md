# gun-private

> quick attempt at making a private gun network

## Setup

- `git clone https://github.com/finwo/gun-private`
- `npm install`
- `npm run server`
- browse to [localhost:3000](http://localhost:3000/)

## Where is what

application code:

- server code: [server/index.js](server/index.js)
- client code: [public/assets/.client.js](public/assets/.client.js)
- client html: [public/index.html](public/index.html)

## How does it work

Based on [gun/examples/http-external-ws][gun/examples/http-external-ws], we set up a regular GUN server with a custom
websocket library (namely [ws-rc4][ws-rc4], allowing that as the only external communication). All clients wanting to
connect to this server are now required to use rc4 encryption with the same key as the server is using.

If a client without the correct key attempts to connect to the server (or any other node), it will only see jibberish
on the connection, preventing it from joining the network and accessing data.

## TL;DR;

```js
let gun = Gun({
  WebSocket: require('ws-rc4')("ENCRYPTION KEY")
})
```


[ws-transform]: https://npmjs.com/package/ws-transform
[gun/examples/http-external-ws]: https://github.com/amark/gun/blob/master/examples/http-external-ws.js
[ws-rc4]: https://npmjs.com/package/ws-rc4
