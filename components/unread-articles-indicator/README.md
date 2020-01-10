# n-myft-ui/unread-articles-indicator

![unread article indicator](https://user-images.githubusercontent.com/21194161/72087965-38d9c080-3301-11ea-9616-d1b31132c269.png)

## How the unread articles number is gotten

:one: Determine the time(`feedStartTime`) which is the user's last active time (the process is explained below)

:two: Determine the time(`startTime`) to be used to count unread articles for the current visit. It is `feedStartTime` or `myFTIndicatorDismissedAt`&ast;, whichever comes later.

:three: Fetch myft feed articles for the user

:four: Count the articles published after the timestamp(`startTime`)

---
&ast; `myFTIndicatorDismissedAt` is stored in `window.localStorage` when user visits myFT feed page, and then the unread aricle indicator is cleared to `0`.

---
![unread article count](https://user-images.githubusercontent.com/21194161/72248809-f0b3ea00-35ef-11ea-899f-0ac0abba6ba6.png)

To keep the number consistent on **cross devices**, it fetches the last 'active' time for a user via a Volt Procedure called UserInfo.
