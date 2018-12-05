const ascii    = c => c.charCodeAt(0),
      isBuffer = require('is-buffer');

module.exports = function (ar) {
  if(!ar) return null;
  if ('string' === typeof ar) ar = [...ar].map(ascii);
  if (isBuffer(ar)) ar = [...ar];
  if(!Array.isArray(ar)) return null;
  return ar.map(c => ('00' + c.toString(16)).substr(-2)).join('');
};
