---
title: 'Victory Laps in Baseball, part 1'
date: 2025/05/06
createdDate: '2026-06-01T01:13:27.000Z'
updatedDate: '2026-06-01T01:19:00.133Z'
tags:
  - fun
  - sports
---

Jeff Bezos said that business is like baseball without a constraint on the number of runs earned by a home run. In baseball the max is 4, in business the max can be over 1000. 

## What if home runs were worth 2 runs?
Parameters
- MLB Rules, except for the following caveats
- The batter who hits a home run runs **twice** around the bases, scoring twice.
    - Any runner already on base will continue to score once

Let's add a new sabermetric, **Victory Lap**

### What's the added value? (How boring does this make the game)?

#### Slugging Percentage
```
SLG = (1B + (2 × 2B) + (3 × 3B) + (4 × HR)) ÷ AB
```

Using the coefficients, we can say HRs are worth `4x` more than singles (4/1), `2x` more than doubles (4/2), and `4/3x` more than triples (4/3)

With our new ruleset, the HR coefficient gets doubled, victory lap rules.

```
SLG = (1B + (2 × 2B) + (3 × 3B) + (1 + <Victory Laps>) * (4 × HR)) ÷ AB
```

SLG-wise, you have to hit 8 singles in 8 AB match a single HR. Two lines will product the same SLG.

```
1B, 1B, 1B, 1B, 1B, 1B, 1B, 1B == HR, 7K
---
8 / 8 == 1 + 1 * 4 * 1 / 8
```

Making the HR 8x more valuable than the single, SLG-wise.

Let's just make a table

| Base | HR Value w/ VL |
| -------- | ------- |
| Singles | `(VL + 1) * 4` |
| Doubles | `(VL + 1) * 4 / 2` |
| Triples | `(VL + 1) * 4 / 3` |

--- 

#### Runs from 2025

It's difficult to say how much value exactly is added per victory lap. In 2025, [5650 home runs were hit in 163664 ABs, 21614 runs total were scored](https://www.statmuse.com/mlb/ask/how-many-home-runs-did-the-entire-league-hit-in-major-league-baseball-in-2025-in-regular-season). Meaning there's `3.45%` of all ABs ended in a HR. And `26.14%` of runs were scored by the HR hitter. If we include a victory lap, that percentage increases to `11300/27264 = 41.44%`, a significant increase. 

Does the first victory lap adds `15.3%` of value to the HR? 

### How much more time does it add to the game?

Well how long does it take for the average player to run the bases?

I just timed Schwarber at 25 seconds from ball-to-bat to round the bases and touch home plate, and it felt like he was moving faster than usual. Apparently Rhys Hoskins (**!!!** Who I may or may not look like?) took 34 seconds to round the bases once and holds the statcast record. Jose Bautista hit _his_ home run and has a trot time of 23 seconds. Schwarber is probably a little below average for rounding the bases, but he's been hitting the most of them, so for the sake of argument the average trot-time is 25s, 50s including the Victory Lap. 

Given the 2025 HRs, 141250 more seconds added to the game for VLs. That's 39.23 _hours_ of baseball added to the regular season for _Victory Laps_. Which sounds hilarious, yet the 2:40 Time/G average, 388800 total mins in 2025 only gets bumped to 391154 mins, which gets us to a whopping 2:41 Time/G. Good time for a table.

| 2025 Time/G | 2025 w/ VL Time/G |
| :--------: | :-------: |
| 2:40 | 2:41 |


## Questions for part 2

### At what point do we stop trying to hit other bases?

When does small ball because so insignificant that we just remove the bases?

### What HR pct does one need to get to in order to have to walk them every time?

I'm talking Bowser, Petey piranha batting numbers here, ifkyk.

