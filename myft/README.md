# n-ui myft/[![Circle CI](https://circleci.com/gh/Financial-Times/n-ui/myft/tree/master.svg?style=svg)](https://circleci.com/gh/Financial-Times/n-ui/myft/tree/master)

Client-side module to handle display of generic myft ui e.g. add to myft buttons

## Consuming

* Include JS and SCSS
* Templates are provided for the following:

### Following

	{{>n-ui/myft/templates/follow}}
	{{>n-ui/myft/templates/unfollow}}

The templates require a _conceptId_ variable. You can also override the button text by providing a _buttonText_ property.

You can require different versions of the button as below:
	{{>n-ui/myft/templates/follow version='3'}}

You can require different variants of the button as below:
	{{>n-ui/myft/templates/follow variant='standout'}}
	{{>n-ui/myft/templates/follow variant='inverse'}}

You can require different sizes of the button as below:
	{{>n-ui/myft/templates/follow size="big" variant='standout'}}

### Save for later

	{{>n-ui/myft/templates/save-for-later contentId=id}}
	{{>n-ui/myft/templates/unsave-for-later contentId=id}}

The templates require an _contentId_ variable. You can also override the button text by providing a _buttonText_ property.

## JS API

- `init()` Sets up listeners to update all myft buttons (follow, save, preference) to match the user's preferences
- 'updateUi(el)' Update the ui within a given element to match the user's preferences. If `el` is undefined applies to the whole page

To detect changes to myft buttons states listen for the `nButtons.stateChange` event

## Releasing

This is a bower module, to release update the git tag.

Communicates with
[next-user-preferences-api](http://github.com/Financial-Times/next-user-preferences-api)
to store preferences Details are stored against users' eRightsID.

Also contains client side polling of User Notifications.

## Testing

Run `make test` to run Karma/Mocha tests.
