import expect from 'expect';
import toHex  from './to-hex';

test('Buffer to hex', ()=>{
  let buffer = Buffer.from('Hello World');
  expect(toHex(buffer)).toBe('48656c6c6f20576f726c64');
});

test('Raw to hex', ()=>{
  expect(toHex('Hello World')).toBe('48656c6c6f20576f726c64');
});

test('Unsupported input', ()=>{
  expect(toHex({foo:'bar'})).toBeNull();
  expect(toHex(false)).toBeNull();
  expect(toHex(true)).toBeNull();
  expect(toHex(null)).toBeNull();
  expect(toHex(undefined)).toBeNull();
});
