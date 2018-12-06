# gun-private

> quick attempt at making a private gun network

## Setup

- `git clone https://github.com/finwo/gun-private`
- `npm install`
- `npm run server`
- browse to [localhost:3000](http://localhost:3000/)

## Where is what

custom packages:

- [to-byte-array](lib/to-byte-array/to-byte-array.js) -- convert some common data to bytes
- [to-hex](lib/to-hex/to-hex.js) -- convert some common data to hexidecimal
- [rc4](lib/rc4/rc4.js) -- small symmetric cryptography lib (don't assume it's safe)
- [sws](lib/sws/sws.js) -- the goal of this test

application code:

- server code: [server/index.js](server/index.js)
- client code: [public/assets/.client.js](public/assets/.client.js)
- client html: [public/index.html](public/index.html)
