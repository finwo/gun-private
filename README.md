# gun-private

> quick attempt at making a private gun network

## Setup

- `git clone https://github.com/finwo/gun-private`
- `npm install`
- `npm run server`
- browse to [localhost:3000](http://localhost:3000/)

## Where is what

custom packages:
- [sws](lib/sws/sws.js): A websocket library using [ws-transform][ws-transform] to apply [rc4-crypt][rc4-crypt] to all
  websockets

application code:

- server code: [server/index.js](server/index.js)
- client code: [public/assets/.client.js](public/assets/.client.js)
- client html: [public/index.html](public/index.html)

[ws-transform]: https://npmjs.com/package/ws-transform
[rc4-crypt]: https://npmjs.com/package/rc4-crypt
