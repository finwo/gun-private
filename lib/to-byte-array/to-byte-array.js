const isBuffer = require('is-buffer');

// This is NOT fool-proof
// Sufficient for this test though
module.exports = function toByteArray(subject) {

  // Already-parsed (sort-of)
  if (!subject) return null;
  if (Array.isArray(subject)) return subject;
  if (isBuffer(subject)) return [...subject];
  if ('string' !== typeof subject) return null;

  // Hex strings
  if (subject.match(/^([0-9a-f]{2})*$/i)) {
    return subject
      .match(/[0-9a-f]{2}/ig)
      .map(c => parseInt(c, 16));
  }

  // Use the string as bytes
  return [...Buffer.from(subject, 'utf8')];
};
