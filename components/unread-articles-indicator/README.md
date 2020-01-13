# n-myft-ui/unread-articles-indicator

![unread article indicator](https://user-images.githubusercontent.com/21194161/72087965-38d9c080-3301-11ea-9616-d1b31132c269.png)

It is displayed on next-article / next-stream-page / next-front-page / next-myft-page.

## Behaviour

- It displays number which is counted unread articles published after user's last active time
- It won't update the number if user is on the same device and also it is within the **device session** (the session expires in 30 mins from the last active time)
- It will display the same number as the last updated if other update process for counting number is in progress
- It will clear the number (it means no number next to myFT logo) when user visits [myFT feed page](https://www.ft.com/ft.com/myft/following)
- It synchronises the number between devices (the number may be different if the device is within the device session)

## How the unread articles number is gotten

:one: Determine the time(`feedStartTime`) which is the user's last active time (the process is explained below)

:two: Determine the time(`startTime`) to be used to count unread articles for the current visit. It is `feedStartTime` or `myFTIndicatorDismissedAt`&ast;, whichever comes later.

:three: Fetch myft feed articles for the user

:four: Count the articles published after the timestamp(`startTime`)

---
&ast; `myFTIndicatorDismissedAt` timestamp is stored in `window.localStorage` when user visits [myFT feed page](https://www.ft.com/myft/following).

---
![unread article count](https://user-images.githubusercontent.com/21194161/72248809-f0b3ea00-35ef-11ea-899f-0ac0abba6ba6.png)

To keep the number consistent on **cross devices**, it fetches the last 'active' time for a user via a Volt Procedure called UserInfo.
