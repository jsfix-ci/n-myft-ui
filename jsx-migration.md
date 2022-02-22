### Handlebars to JSX migration notes

This document serves as a troubleshooting guide for `handlebars` components that have been migrated to `jsx`. Also, notes can be added to this document for anything related to the migration.

A common cause of issues/bugs with migrated components is missing HTML attributes. The business logic related to these components heavily depend on these attributes and their values. If an action related to any of these migrated components fails, compare the jsx version and the handlebars version to see if an attribute is getting the wrong value or is missing.

Another cause of issues will be missing flags. Ensure consuming applications pass the required flags to these components.

Currently we have migrated the following `handlebars` partials to `jsx`:
- components/collections/collections.jsx [handlebars fount here](https://github.com/Financial-Times/n-myft-ui/blob/dfbf06d10f78756871cfe8d2aeb863ce4bcca1e1/components/collections/collections.html)
- components/concept-list/concept-list.jsx [handlebars found here](https://github.com/Financial-Times/n-myft-ui/blob/dfbf06d10f78756871cfe8d2aeb863ce4bcca1e1/components/concept-list/concept-list.html)
- components/follow-button/follow-button.jsx [handlebars found here](https://github.com/Financial-Times/n-myft-ui/blob/bf2145fcfd211001dfab6a3a271dd72808d062bd/components/follow-button/follow-button.html)
- components/pin-button/pin-button.jsx [handlebars found here](https://github.com/Financial-Times/n-myft-ui/blob/dfbf06d10f78756871cfe8d2aeb863ce4bcca1e1/components/pin-button/pin-button.html)
- components/save-for-later/save-for-later.jsx [handlebars found here](https://github.com/Financial-Times/n-myft-ui/blob/11d483364bb0f002c3a0b45bc024c83bb055268e/components/save-for-later/save-for-later.jsx)
- components/instant-alert/instant-alert.jsx [handlebars found here](https://github.com/Financial-Times/n-myft-ui/blob/dfbf06d10f78756871cfe8d2aeb863ce4bcca1e1/components/instant-alert/instant-alert.html)