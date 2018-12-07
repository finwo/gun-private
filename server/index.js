// Ensure process.env
require('dotenv').config();

// Arg parsing
const argv = require('minimist')(process.argv.slice(2));

let key = argv.key || process.env.KEY || 'deadbeef';

// Load dependencies
const http = require('http'),
      sws  = require('ws-rc4');

// Load GUN & extras
const Gun = require('gun');

// Set up the http server
let server = http.createServer(Gun.serve(`${__dirname}/../public`));

// Start http
let port = parseInt(argv.port || process.env.PORT || 3000);
server.listen(port, err => {
  if (err) throw err;
  console.log('Listening on port', port);
});

// Start gun
let gun = Gun({
  ws       : {server},
  WebSocket: sws(key)
});

// let gun = new Gun();
// console.log(gun);

// if (argv.port) process.env.PORT = argv.port ? parseInt(argv.port) : 3000;
