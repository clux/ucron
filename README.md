# ucron
Minimalistic cron parser / expander. Not published on `npm`.

## Usage
Clone and `npm link` to create the `ucron` binary on your `PATH`.
Alternatively, just clone and run `./cron.js "cronexpr"`. without `npm`.

```sh
$ ucron "*/15 0 1,15 * 1-5 /usr/bin/find me"
minute 0 15 30 45
hour 0
day of month 1 15
month 1 2 3 4 5 6 7 8 9 10 11 12
day of week 1 2 3 4
command /usr/bin/find me
```

## Caveats
**Only** allows the 5 most normal types of cron expressions with integers within the [normal bounds](https://en.wikipedia.org/wiki/Cron#Overview).

- integer (at this unit)
- */integer (at every 1 over this unit)
- comma separated integer (these units only)
- integer-integer (all integers units in the specified range [start,end-1])
- * (all available integer units in allowed range)

`ucron` also does not care for things like:

- running on the 31st day of even numbered months.
- allowing day 7 in days (some allow this)
- expressions given in unsorted order (you get what you put in)