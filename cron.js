#!/usr/bin/env node
const parse = require('.');

function prettyPrint(obj) {
  console.log('minute', obj.min);
  console.log('hour', obj.hour);
  console.log('day of month', obj.dayofmonth);
  console.log('month', obj.month);
  console.log('day of week', obj.dayofweek);
  console.log('command', obj.cmd);
}

try {
  prettyPrint(parse(process.argv[2]));
}
catch (e) {
  console.warn(e.message);
  process.exit(1);
}
