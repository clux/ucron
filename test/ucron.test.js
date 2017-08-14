const test = require('bandage');
const parse = require('..');

test('canonical', function *T(t) {
  t.eq(parse('*/15 0 1,15 * 1-5 /usr/bin/find'), {
    min: '0 15 30 45',
    hour: '0',
    dayofmonth: '1 15',
    month: '1 2 3 4 5 6 7 8 9 10 11 12',
    dayofweek: '1 2 3 4',
    cmd: '/usr/bin/find'
  });
});

var checkError = function (t, str, kls, reason) {
  try {
    parse(str);
    t.false('should not reach this');
  }
  catch (e) {
    // could match this error message a bit better, but w/e
    t.ok(e instanceof kls, reason);
  }
};

test('invalids', function *T(t) {
  checkError(t, '* * * * *', Error, 'need a command');
  checkError(t, '60 * * * * ls', RangeError, 'minute too high');
  checkError(t, '* 24 * * * ls', RangeError, 'hour too high');
  checkError(t, '* * 32 * * ls', RangeError, 'dayofmonth too high');
  checkError(t, '* * * 13 * ls', RangeError, 'month too high');
  checkError(t, '* * * * 7 ls', RangeError, 'day too high');
  checkError(t, 'a,b,c * * * * ls', TypeError, 'invalid comma list');
  checkError(t, '5-65 * * * * ls', RangeError, 'invalid range bounds subset');
  checkError(t, '5,62 * * * * ls', RangeError, 'invalid comma bounds');
  checkError(t, '5-2 * * * * ls', RangeError, 'invalid reverse range bounds');
  checkError(t, '*/7 * * * * ls', RangeError, 'invalid star over minute');
  checkError(t, '* * */3 * * ls', RangeError, 'invalid star over dayofmonth');
});

test('syntax', function *T(t) {
  t.eq(parse('*/5 */3 5 */3 */1 ls'), {
    min: '0 5 10 15 20 25 30 35 40 45 50 55',
    hour: '0 3 6 9 12 15 18 21',
    dayofmonth: '5',
    month: '1 4 7 10',
    dayofweek: '0 1 2 3 4 5 6',
    cmd: 'ls'
  }, 'dividing');

  t.eq(parse('1,2,3 2,3,4 4,5,6 7,8,9 3,4 ls'), {
    min: '1 2 3',
    hour: '2 3 4',
    dayofmonth: '4 5 6',
    month: '7 8 9',
    dayofweek: '3 4',
    cmd: 'ls'
  }, 'comma separated');

  t.eq(parse('1-4 2-5 4-7 7-10 3-5 ls'), {
    min: '1 2 3',
    hour: '2 3 4',
    dayofmonth: '4 5 6',
    month: '7 8 9',
    dayofweek: '3 4',
    cmd: 'ls'
  }, 'range separated');

  // verify * by just checking that the length is the expected range if we split again
  const all = parse('* * * * * ls');
  t.eq(all.min.split(' ').length, 60, 'num minutes');
  t.eq(all.hour.split(' ').length, 24, 'num hours');
  t.eq(all.dayofmonth.split(' ').length, 31, 'num dayofmonth');
  t.eq(all.month.split(' ').length, 12, 'num month');
  t.eq(all.dayofweek.split(' ').length, 7, 'num dayofweek');
});
