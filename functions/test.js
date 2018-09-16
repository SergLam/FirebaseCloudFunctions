let data = 'AnodaDev123';
let buff = new Buffer(data);
let base64data = buff.toString('base64');

console.log('"' + data + '" converted to Base64 is "' + base64data + '"');

let data1 = 'UkVEQUNURUQ=';
let buff1 = new Buffer(data1, 'base64');
let text1 = buff.toString('ascii');

console.log('"' + data1 + '" converted from Base64 to ASCII is "' + text1 + '"');
