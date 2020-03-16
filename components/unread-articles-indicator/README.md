# n-myft-ui/unread-articles-indicator

![unread article indicator](https://user-images.githubusercontent.com/21194161/72087965-38d9c080-3301-11ea-9616-d1b31132c269.png)


## What?

It indicates to the user that articles they've not yet read have been published to their myft feed since they last visited the site.

## Why?

- To encourage a myFT feed habit
- To provide a utility to the user so they don't need to check their feed unnecessarily


## Where?

- **.com only**:
  - next-front-page
  - next-stream-page
  - next-article
  - next-myft-page

## When?

- June 2018 - intial implementation [AB Test results](https://sites.google.com/ft.com/ftproductanalytics/analysis/myft/myft-feed-page)
- Sep 2018 - sync across devices
- Oct 2019 - add favicon [AB Test results](https://sites.google.com/ft.com/ftproductanalytics/tests/engagement/myftunreadfavicon)
- Nov 2019 - automatically update (polling)


## Behaviour

- The indicator consists of a red circle and a count of the number of new and unread articles since a user was last active on the site (or the app). The article count is hidden on the mobile breakpoint if the number is double digits (i.e. too large to fit in the circle)

- The favicon is updated to reflect what the indicator is showing

- The article count updates automatically without the user having to refresh the page every 20 minutes

- The count is reset to 0 when the user visits their myFT feed page on [ft.com](https://www.ft.com/ft.com/myft/following)

- The count is reset every day at midnight

- The count is reset after 30 minutes of site inactivity - 🐛 thought to be a bug

- The state of the indicator is synched between different browsers, however it's not expected to be real-time
---

## How the unread articles number is determined

:one: Determine the time(`feedStartTime`) which is the user's last active time (the process is explained below)

:two: Determine the time(`startTime`) to be used to count unread articles for the current visit. It is `feedStartTime` or `myFTIndicatorDismissedAt`&ast;, whichever comes later.

:three: Fetch myft feed articles for the user

:four: Count the articles published after the timestamp(`startTime`)

---
&ast; `myFTIndicatorDismissedAt` timestamp is stored in `window.localStorage` when user visits [myFT feed page](https://www.ft.com/myft/following).

---
![unread article count](https://user-images.githubusercontent.com/21194161/72608180-11df4800-391a-11ea-973b-4a52933561ab.png)

To keep the number synched  on **cross devices**, it fetches the last 'active' time for a user via a Volt Procedure called UserInfo.