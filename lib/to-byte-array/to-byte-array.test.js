// import b64url  from 'base64url';
import expect  from 'expect';
import toBytes from './to-byte-array';
import toHex   from 'to-hex';
//
test('Hex string input', () => {
  expect(toHex(toBytes('48656c6c6f20576f726c64'))).toBe('48656c6c6f20576f726c64');
});

// test('base64url string input', () => {
//   expect(toHex(toBytes('SGVsbG8gV29ybGQ'))).toBe('48656c6c6f20576f726c64');
// });

test('String input', () => {
  expect(toHex(toBytes('Hello World'))).toBe('48656c6c6f20576f726c64');
});

test('Buffer input', () => {
  expect(toHex(toBytes(Buffer.from('Hello World')))).toBe('48656c6c6f20576f726c64');
});

test('Array input', () => {
  expect(toHex(toBytes([ 0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x20, 0x57, 0x6f, 0x72, 0x6c, 0x64 ]))).toBe('48656c6c6f20576f726c64');
});

test('Unsupported input', () => {
  expect(toBytes({foo:'bar'})).toBeNull();
  expect(toBytes(true)).toBeNull();
  expect(toBytes(false)).toBeNull();
  expect(toBytes(null)).toBeNull();
  expect(toBytes(undefined)).toBeNull();
});
