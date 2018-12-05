(async function() {
  const Gun = require('gun');

  // Initialize terminal
  window.term = new Terminal();
  document.body.appendChild(term.html);

  // Keep track of messages & users
  let activities = {},
      users    = {},
      config   = {};

  // Drawing the chat window
  function redraw() {
    term.clear();

    // Get times & sizes
    let now  = new Date().getTime(),
        cols = 80, // TODO
        rows = 24; // TODO

    // Write header
    let title = (config.subject||'NO SUBJECT');
    term.print('\u250C' + "\u2500".repeat(cols-2) + '\u2510' );
    term.print('\u2502' + title + (" ".repeat(cols - 2 - title.length)) + '\u2502');
    term.print("\u251C" + "\u2500".repeat(20) + '\u252C' + "\u2500".repeat(cols-23) + '\u2524' );

    // Fetch users to write
    let printUsers = [];
    Object.keys(users).forEach(function (id) {
      let user = users[id];
      if(printUsers.length > (rows-5)) return;
      let txt = user.name;
      if (user.time) {
        let tlen = user.time.length;
        if (txt.length > (19-tlen)) txt = txt.substr(0,17-tlen) + '..';
        while( txt.length < (19-tlen)) txt = txt + " ";
        txt += " " + user.time;
      } else {
        while( txt.length < 20) txt = txt + " ";
      }
      printUsers.push(txt);
    });

    // Fetch activities to write
    let printLines = [];
    Object.keys(activities).forEach(function(id) {
      let activity = activities[id];
      let txt = '';
      switch(activity.cmd) {
        case 'enter':
          txt = activity.usr + " entered the room.";
          break;
        case 'message':
          txt = activity.usr + ': ' + activity.txt;
          break;
        case 'subject':
          txt = activity.usr + " changed the subject from '" + activity.old + "' to '" + activity.new + "'";
          break;
        case 'nick':
          txt = activity.old + " took a new username: " + activity.new;
          break;
      }
      while(txt.length) {
        let line = txt.substr(0,cols-23);
        printLines.push(line + " ".repeat(cols-23-line.length));
        txt = txt.substr(cols-23);
      }
    });

    // Remove older activities
    while(printLines.length > (rows-5)) printLines.shift();

    // Print all
    for (let i=5; i<rows; i++) {
      term.print(
        '\u2502' +
        (printUsers.shift() || " ".repeat(20)) +
        '\u2502' +
        (printLines.shift() || " ".repeat(20)) +
        '\u2502'
      );
    }

    // Footer
    term.print('\u2514' + "\u2500".repeat(20) + '\u2534' + "\u2500".repeat(cols-23) + '\u2518');
  }


  // Fetch encryption key
  term.clear();
  let key = await new Promise( done => {
    term.input('Encryption key', done);
  });

  // Fetch username
  term.clear();
  let username = await new Promise( done => {
    term.input('Username', done);
  });

  // Initialize the storage
  window.gun = Gun({
    peers: ['http://' + document.location.host + '/gun'],
    WebSocket: require('sws')(key)
  });

  // Configure chat
  gun.get('config').on(function(conf) {
    config = conf;
    redraw();
  });

  // Subscribe to activity list
  gun.get('activity').map().on(function (activity, id) {
    activities[id] = activity;
    console.log('activity', activity);
    redraw();
  });

  // Subscribe to user list
  gun.get('user').map().on(function (user, id) {
    console.log('user',user);
    const now = new Date().getTime(),
          exp = now - (30*1000);
    users[id] = user;
    Object.keys(users).forEach(function(uid) {
      if (!users[uid]) return delete users[uid];
      if (!users[uid].iat) return delete users[uid];
      if (!users[uid].name) return delete users[uid];
      if (users[uid].iat < exp) return delete users[uid];
    });
    redraw();
  });

  // Add myself to the user list
  let userRef = gun.get('user').set({ name: username, iat: new Date().getTime(), time: 'n/a' });
  setInterval(function() {
    const now = new Date();
    userRef.get('iat').put(now.getTime());
    userRef.get('time').put( ('00'+now.getHours()).substr(-2) + ':' + ('00'+now.getMinutes()).substr(-2));
  },20*1000);

  // Notify the group I entered
  gun.get('activity').set({
    cmd: 'enter',
    usr: username,
    iat: new Date().getTime(),
  });

  (function inputListener(data) {

    // Handle sending a message
    if (data) {
      if (data[0] === '/') {
        let [cmd,...args] = data.substr(1).split(' ');
        switch(cmd) {
          case 'subject':
          case 'title':
            gun.get('activity').set({
              cmd: 'subject',
              usr: username,
              iat: new Date().getTime(),
              old: config.subject || 'NO SUBJECT',
              new: args.join(' ')
            });
            gun.get('config').get('subject').put(args.join(' '));
            break;
          case 'nick':
            gun.get('activity').set({
              cmd: 'nick',
              iat: new Date().getTime(),
              old: username,
              new: args.join(' ')
            });
            username = args.join(' ');
            userRef.get('name').put(username);
            break;
          default:
            redraw();
            break;
        }
      } else {
        gun.get('activity').set({
          cmd: 'message',
          usr: username,
          iat: new Date().getTime(),
          txt: data
        });
      }
    }

    term.input(false,inputListener);
  })();
})();
