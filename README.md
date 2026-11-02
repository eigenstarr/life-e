# Life

A weekly planner dashboard that balances school, homework, SAT prep, gym, golf, app development and free time around 8 hours of sleep.

Open `index.html` in any browser. No build step, no dependencies.

## What it does

- **Now**: the block you are in, time left, and what comes next
- **Weekly targets**: 4 gym sessions, 4 golf sessions, 7 hours of SAT prep, app development blocks
- **Day timeline**: the full schedule for any day, with a marker for the current time; check off gym, golf, SAT and homework/app blocks
- **Today's workout**: a 4-day gym program built around golf (push, legs, pull, full-body power), mobility on non-gym days, and a golf practice plan on golf days
- **SAT hour**: a topic for each day with a YouTube lesson search, the official Question Bank, Bluebook practice tests and Khan Academy
- **Week scorecard**: every session for the week in one table, golf-scorecard style

Progress is saved in your browser (localStorage), so it stays on the device you use.

## Editing the schedule

Everything lives in `index.html`. The schedule is the `SCHED` object, the gym program is `WORKOUT`, golf plans are `GOLF`, and SAT topics are `SAT`. Golf blocks assume about 30 minutes of round-trip driving.

`src/dashboard.html` is the same page without the `<html>`/`<head>` wrapper, used for publishing as a Claude artifact.

## Credits

Interface designed following [unslop](https://github.com/heydamir/unslop) by Damir Sokolovsky ([@heydamir](https://x.com/heydamir)), CC BY 4.0.
