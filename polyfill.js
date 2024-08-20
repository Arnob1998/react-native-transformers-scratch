import 'react-native-skia-offscreencanvas/polyfill';
import 'text-encoding-polyfill'; // support TextEncoder
import { Buffer } from 'buffer';
import XRegExp from 'xregexp';

global.Buffer = Buffer;

// Replace default RegExp to support Unicode property escapes
const nativeRegExp = global.RegExp;
const newRegExp = (...args) => {
  global.RegExp = nativeRegExp;
  const result = XRegExp(...args);
  global.RegExp = newRegExp;
  return result;
};
global.RegExp = newRegExp;

console.log("polyfill loaded")
