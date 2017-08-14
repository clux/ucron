// only allow the following 5 types of expressions:
const pureInteger = /^(\d*)$/;
const rangeSeparated = /^(\d*)\-(\d*)$/;
const starOver = /^\*\/(\d*)$/;
const commaSeparated = /\,/;
const isStar = /^\*$/;

function validate(value, help, lb, ub) {
  // standalone star => expand the full [lb, ub] range
  if (isStar.test(value)) {
    return Array.from(Array(ub+1-lb).keys()).map((n) => n + lb).join(' ');
  }

  // standalone integer => verify bounds then return the integer
  if (pureInteger.test(value)) {
    const res = value | 0;
    if (res < lb || res > ub) {
      throw new RangeError(help + ' expression:' + value + ' not in: [' + lb + ',' + ub +']');
    }
    return value;
  }

  // */integer expression => check for an even divisor, then expand the range
  if (starOver.test(value)) {
    const every = value.match(starOver)[1];
    // only allow numbers that perfectly divide upper bound + 1
    if (Math.floor((ub-lb+1)/every) !== (ub-lb+1)/every) {
      throw new RangeError(help + ' expression:' + value + ' does not evenly divide ' + (ub+1));
    }
    return Array.from(Array((ub-lb+1)/every).keys()).map((n) => lb + n * every).join(' ');
  }

  // lower-upper expression - verify the bounds, then expand the range
  if (rangeSeparated.test(value)) {
    [_, lower, upper] = value.match(rangeSeparated);
    lower = lower | 0;
    upper = upper | 0;
    if (lower < lb || upper > ub) {
      throw new RangeError(help + ' expression:' + value + ' is in: [' + lb + ',' + ub +']');
    }
    return Array.from(Array(upper-lower).keys()).map((n) => n + lower).join(' ');
  }

  // comma separated expression - verify bounds and return the same expression
  if (commaSeparated.test(value)) {
    const res = value.split(commaSeparated).map((s) => parseInt(s, 10));
    if (!res.every(Number.isFinite)) {
      throw new TypeError(help + ' expression: ' + value + ' contains non-integers');
    }
    if (res.some((x) => x < lb || x > ub)) {
      throw new RangeError(help + ' expression: ' + value + ' not in: [' + lb + ',' + ub +']');
    }
    return res.join(' ');
  }

  // if we are here then we failed to parse any of the above - consider it invalid
  throw new Error(help + ' expression: ' + value + ' not understood');
}

module.exports = function parse(str) {
  const res = str.split(' ');
  if (res.length < 6) {
    throw new Error('Invalid cron string with only ' + res.length + ' elements');
  }
  return {
    min: validate(res[0], 'minute', 0, 59),
    hour: validate(res[1], 'hour', 0, 23),
    dayofmonth: validate(res[2], 'dayofmonth', 1, 31),
    month: validate(res[3], 'month', 1, 12),
    dayofweek: validate(res[4], 'dayofweek', 0, 6),
    cmd: res.slice(5).join(' ')
  };
};
