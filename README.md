# Life

A weekly planner dashboard that balances school, homework, SAT prep, gym, golf, app development and free time around 8 hours of sleep.

Live at the Vercel URL below, or open `index.html` in any browser. No build step, no dependencies. It opens in dark mode; the button in the top right switches to light and remembers your choice.

## Pages

- **Today**: what you're doing now, weekly targets, the day timeline, today's workout and golf plan
- **Gym**: weekly training plan and guided workouts
- **SAT**: today's lesson and practice links, plus the week's topics
- **Week**: the scorecard
- **Settings**: theme (dark, light or system), lb or kg, rest timer and vibration, backup and restore, clearing data

## What it does

- **Now**: the block you are in, time left, and what comes next
- **Weekly targets**: 5 workouts (4 lifts + cardio), 4 golf sessions, 7 hours of SAT prep, app development blocks
- **Day timeline**: the full schedule for any day, with a marker for the current time; check off gym, golf, SAT and homework/app blocks
- **Gym**: a weekly plan (Mon push, Wed pull, Thu push, Fri cardio, Sat pull) with a body map of the muscles each day works. Start a workout and it walks you through it: weights pre-filled from last time, plus/minus steppers for weight and reps, a rest timer between sets, progression hints when you hit the top of the rep range, your best lift per exercise, and live volume. Finishing a workout checks it off in your schedule. The workout flow is modeled on [openGym](https://github.com/DuarteSantos8/openGym) and rebuilt from scratch here; no openGym code is included
- **Golf**: a practice plan for each golf day
- **SAT hour**: a topic for each day with a YouTube lesson search, the official Question Bank, Bluebook practice tests and Khan Academy
- **Week scorecard**: every session for the week in one table, golf-scorecard style

Progress saves automatically in your browser (localStorage) and stays there between visits, including an unfinished workout and a running rest timer. Each device keeps its own copy; use Settings → Copy backup / Restore to move data between devices.

On a phone, open the site and add it to your Home Screen (Safari: Share → Add to Home Screen). It then opens like an app, works offline, and Safari will not clear its data.

## Editing the schedule

Everything lives in `index.html`. The schedule is the `SCHED` object, exercises are `EX`, the weekly gym plan is `ROUTINE`, golf plans are `GOLF`, and SAT topics are `SAT`. Golf blocks assume about 30 minutes of round-trip driving.

`src/dashboard.html` is the page body; run `python3 build.py` after editing it to regenerate `index.html`.

## Credits

Interface designed following [unslop](https://github.com/heydamir/unslop) by Damir Sokolovsky ([@heydamir](https://x.com/heydamir)), CC BY 4.0.
