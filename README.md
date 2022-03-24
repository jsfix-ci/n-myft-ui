# n-myft-ui [![CircleCI](https://circleci.com/gh/Financial-Times/n-myft-ui.svg?style=svg)](https://circleci.com/gh/Financial-Times/workflows/n-myft-ui)

Client side component for interaction with myFT.

There are two entry points (both for js and scss):

- myft
- myft-common

However, we are trying to transition to an approach where apps explicitly import just the individual components (from the `components/` directory) themselves.

These subdirectories may contain a README. If not, please speak to the myft team about how to use them.

## Making changes

n-myft-ui provides the CSS, JS and most templates for the myFT components on FT.com. We use semver to control rollout of the code.

As of August 2017, The following apps use n-myft-ui:

- next-front-page
- next-stream-page
- next-article
- next-myft-page
- next-tour-page
- next-video-page
- next-search-page

When you merge to main, you should make a new release and then roll it out to the apps, plus n-topic-card which contains a reference to this so that there aren't missing dependencies.

If you are making a major change, you will need to update the bower.json and package.json files for the above apps. For minor and patch updates, you can rebuild without cache from CircleCI.

## Running locally

```
make install
make build
make demo
```

View the demo on `localhost:5005`


## Migration Guide

### Upgrading from v23 to v24

V24 introduces some major changes to n-myft-ui components. Some of the components have been moved from handlebars to jsx. 

These components include:
- csrf-token
- follow-button
- save-for-later
- pin-button
- concept-list
- collections

A consumer of any of these components needs to render them directly as `jsx` components in a parent `jsx` component or use the `renderReactComponent` helper function provided by `@financial-times/dotcom-server-handlebars` in a consuming handlebars template/partial. 

#### Example rendering in a jsx component
```jsx
import { SaveForLater } from '@financial-times/n-myft-ui';

export default function Consumer() {
	return (
		<SaveForLater contentId={contentId} saveButtonWithIcon={true} flags={{myFtApiWrite:myFtApiWrite}}/>
	)
}
```

More examples of rendering these components can be found [here](https://github.com/Financial-Times/n-myft-ui/blob/main/demos/templates/demo.jsx) with component props passed in [here](https://github.com/Financial-Times/n-myft-ui/blob/dfbf06d10f78756871cfe8d2aeb863ce4bcca1e1/demos/app.js#L54).


#### Example rendering in a handlebars partial
To render a jsx component in a handlebars partial, consumers need to add the `helpers` provided by `@financial-times/dotcom-server-handlebars` to the PageKitHandlebars config in `express app engine` [see example](https://github.com/Financial-Times/n-myft-ui/blob/dfbf06d10f78756871cfe8d2aeb863ce4bcca1e1/demos/app.js#L41). 

```hbs
<div>
	<h2 class="demo-section__title">
		Follow button
	</h2>

	{{#followButton}}
		{{{renderReactComponent localPath="node_modules/@financial-times/n-myft-ui/components/follow-button/follow-button" flags=@root.flags}}}
	{{/followButton}}
</div>
```

More examples of rendering jsx in handlebars partials can be found [here](https://github.com/Financial-Times/n-myft-ui/blob/main/demos/templates/demo.html)
