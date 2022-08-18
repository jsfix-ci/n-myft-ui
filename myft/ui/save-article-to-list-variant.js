import Overlay from '@financial-times/o-overlay';
import myFtClient from 'next-myft-client';
import { uuid } from 'n-ui-foundations';
import getToken from './lib/get-csrf-token';
import isMobile from './lib/is-mobile';
import stringToHTMLElement from './lib/convert-string-to-html-element';

const csrfToken = getToken();

let lists = [];
let haveLoadedLists = false;
let createListOverlay;

export default async function openSaveArticleToListVariant (contentId, options = {}) {
	const { name, showPublicToggle = false } = options;

	function createList (newList, cb) {
		if(!newList || !newList.name) {
			if (!lists.length) attachDescription();
			return contentElement.addEventListener('click', openFormHandler, { once: true });
		}

		myFtClient.add('user', null, 'created', 'list', uuid(), { name: newList.name,	token: csrfToken })
			.then(detail => {
				myFtClient.add('list', detail.subject, 'contained', 'content', contentId, { token: csrfToken }).then((data) => {
					const createdList = { name: newList.name, uuid: data.actorId, checked: true, isShareable: !!newList.isShareable };
					lists.unshift(createdList);
					const listElement = ListsElement(lists, addToList, removeFromList);
					const overlayContent = document.querySelector('.o-overlay__content');
					overlayContent.insertAdjacentElement('afterbegin', listElement);
					const announceListContainer = document.querySelector('.myft-ui-create-list-variant-announcement');
					announceListContainer.textContent = `${createdList.name} created`;
					contentElement.addEventListener('click', openFormHandler, { once: true });
					cb(contentId, createdList);
				});
			})
			.catch(() => {
				if (!lists.length) attachDescription();
				return contentElement.addEventListener('click', openFormHandler, { once: true });
			});
	}

	function addToList (list, cb) {
		if(!list) {
			return;
		}

		myFtClient.add('list', list.uuid, 'contained', 'content', contentId, { token: csrfToken }).then((addedList) => {
			cb();
			triggerAddToListEvent(contentId, addedList.actorId);
		});
	}

	function removeFromList (list, cb) {
		if(!list) {
			return;
		}

		myFtClient.remove('list', list.uuid, 'contained', 'content', contentId, { token: csrfToken }).then((removedList) => {
			cb();
			triggerRemoveFromListEvent(contentId, removedList.actorId);
		});
	}

	if (!haveLoadedLists) {
		lists = await getLists(contentId);
		haveLoadedLists = true;
	}

	const overlays = Overlay.getOverlays();
	const existingOverlay = overlays[name];
	if (existingOverlay) {
		existingOverlay.destroy();
	}

	const headingElement = HeadingElement();
	let [contentElement, removeDescription, attachDescription] = ContentElement(!lists.length);

	createListOverlay = new Overlay(name, {
		html: contentElement,
		heading: { title: headingElement.outerHTML },
		modal: false,
		parentnode: isMobile() ? '.o-share--horizontal' : '.o-share--vertical',
		class: 'myft-ui-create-list-variant',
	});

	function outsideClickHandler (e) {
		const overlayContent = document.querySelector('.o-overlay__content');
		const overlayContainer = document.querySelector('.o-overlay');
		// we don't want to close the overlay if the click happened inside the
		// overlay, except if the click happened on the overlay close button
		const isTargetInsideOverlay = overlayContainer.contains(e.target) && !e.target.classList.contains('o-overlay__close');
		if(createListOverlay.visible && (!overlayContent || !isTargetInsideOverlay)) {
			createListOverlay.close();
		}
	}

	function openFormHandler () {
		const formElement = FormElement(createList, showPublicToggle);
		const overlayContent = document.querySelector('.o-overlay__content');
		removeDescription();
		overlayContent.insertAdjacentElement('beforeend', formElement);
		formElement.elements[0].focus();
	}

	createListOverlay.open();

	const scrollHandler = getScrollHandler(createListOverlay.wrapper);
	const resizeHandler = getResizeHandler(createListOverlay.wrapper);

	createListOverlay.wrapper.addEventListener('oOverlay.ready', (data) => {
		if (lists.length) {
			const listElement = ListsElement(lists, addToList, removeFromList);
			const overlayContent = document.querySelector('.o-overlay__content');
			overlayContent.insertAdjacentElement('afterbegin', listElement);
		}

		positionOverlay(data.currentTarget);

		contentElement.addEventListener('click', openFormHandler, { once: true });

		document.querySelector('.article-content').addEventListener('click', outsideClickHandler);

		window.addEventListener('scroll', scrollHandler);

		window.addEventListener('oViewport.resize', resizeHandler);
	});

	createListOverlay.wrapper.addEventListener('oOverlay.destroy', () => {
		window.removeEventListener('scroll', scrollHandler);

		window.removeEventListener('oViewport.resize', resizeHandler);

		document.querySelector('.article-content').removeEventListener('click', outsideClickHandler);
	});
}

function showMessageOverlay () {
	function onContinue () {
		messageOverlay.destroy();
		createListOverlay.show();
	}

	const messageElement = MessageElement(onContinue);

	const messageOverlay = new Overlay('myft-ui-create-list-variant-message', {
		html: messageElement,
		modal: false,
		parentnode: isMobile() ? '.o-share--horizontal' : '.o-share--vertical',
		class: 'myft-ui-create-list-variant-message',
	});

	const scrollHandler = getScrollHandler(messageOverlay.wrapper);
	const resizeHandler = getResizeHandler(messageOverlay.wrapper);

	messageOverlay.open();

	messageOverlay.wrapper.addEventListener('oOverlay.ready', (data) => {
		positionOverlay(data.currentTarget);

		window.addEventListener('scroll', scrollHandler);

		window.addEventListener('oViewport.resize', resizeHandler);
	});

	messageOverlay.wrapper.addEventListener('oOverlay.destroy', () => {
		window.removeEventListener('scroll', scrollHandler);

		window.removeEventListener('oViewport.resize', resizeHandler);
	});

	return messageOverlay;
}

function getScrollHandler (target) {
	return realignOverlay(window.scrollY, target);
}

function getResizeHandler (target) {
	return function resizeHandler () {
		positionOverlay(target);
	};
}

function FormElement (createList, showPublicToggle) {
	const formString = `
	<form class="myft-ui-create-list-variant-form">
		<label class="myft-ui-create-list-variant-form-name o-forms-field">
			<span class="o-forms-input o-forms-input--text">
				<input class="myft-ui-create-list-variant-text" type="text" name="list-name" aria-label="List name">
			</span>
		</label>

		${showPublicToggle ?
		`<div class="myft-ui-create-list-variant-form-public o-forms-field" role="group">
				<span class="o-forms-input o-forms-input--toggle">
					<label>
						<input class="myft-ui-create-list-variant-form-toggle" type="checkbox" name="is-shareable" value="public" checked>
						<span class="myft-ui-create-list-variant-form-toggle-label o-forms-input__label">
							<span class="o-forms-input__label__main">
								Public
							</span>
							<span id="myft-ui-create-list-variant-form-public-description" class="o-forms-input__label__prompt">
								Your profession & list will be visible to others
							</span>
						</span>
					</label>
				</span>
			</div>` :
		''
}

		<div class="myft-ui-create-list-variant-form-buttons">
			<button class="o-buttons o-buttons--primary o-buttons--inverse o-buttons--big" type="click">
			Cancel
			</button>
			<button class="o-buttons o-buttons--big o-buttons--secondary" type="submit">
			Add
			</button>
		</div>
	</form>
	`;

	const formElement = stringToHTMLElement(formString);

	function handleSubmit (event) {
		event.preventDefault();
		event.stopPropagation();
		const inputListName = formElement.querySelector('input[name="list-name"]');
		const inputIsShareable = formElement.querySelector('input[name="is-shareable"]');

		const newList = {
			name: inputListName.value,
			isShareable: inputIsShareable ? inputIsShareable.checked : false
		};

		createList(newList, ((contentId, createdList) => {
			triggerCreateListEvent(contentId, createdList.uuid);
			triggerAddToListEvent(contentId, createdList.uuid);
			positionOverlay(createListOverlay.wrapper);

			if (createdList.isShareable) {
				createListOverlay.close();
				showMessageOverlay();
			}
		}));
		formElement.remove();

	}

	function handleCancelClick (event) {
		event.preventDefault();
		event.stopPropagation();

		createList(((contentId, listId) => {
			triggerCreateListEvent(contentId, listId);
			triggerAddToListEvent(contentId, listId);
			positionOverlay(createListOverlay.wrapper);
		}));
		formElement.remove();
	}

	formElement.querySelector('button[type="submit"]').addEventListener('click', handleSubmit);
	formElement.querySelector('button[type="click"]').addEventListener('click', handleCancelClick);

	return formElement;
}

function ContentElement (hasDescription) {
	const description = '<p class="myft-ui-create-list-variant-add-description">Lists are a simple way to curate your content</p>';

	const content = `
		<div class="myft-ui-create-list-variant-footer">
			<button class="myft-ui-create-list-variant-add" data-trackable="add-to-new-list" text="Add to a new list">Add to a new list</button>
			${hasDescription ? `
			${description}
		` : ''}
		</div>
	`;

	const contentElement = stringToHTMLElement(content);

	function removeDescription () {
		const descriptionElement = contentElement.querySelector('.myft-ui-create-list-variant-add-description');
		if (descriptionElement) {
			descriptionElement.remove();
		}
	}

	function attachDescription () {
		const descriptionElement = stringToHTMLElement(description);
		contentElement.insertAdjacentElement('beforeend', descriptionElement);
	}

	return [contentElement, removeDescription, attachDescription];
}

function HeadingElement () {
	const heading = `
		<span class="myft-ui-create-list-variant-heading">Added to <a href="https://www.ft.com/myft/saved-articles" data-trackable="saved-articles">saved articles</a> in <span class="myft-ui-create-list-variant-icon"><span class="myft-ui-create-list-variant-icon-visually-hidden">my FT</span></span></span>
		`;

	return stringToHTMLElement(heading);
}

function ListsElement (lists, addToList, removeFromList) {
	const currentList = document.querySelector('.myft-ui-create-list-variant-lists');
	if (currentList) {
		currentList.remove();
	}

	const listCheckboxElement = ListCheckboxElement(addToList, removeFromList);

	const listsTemplate = `
	<div class="myft-ui-create-list-variant-lists o-forms-field o-forms-field--optional" role="group">
		<span class="myft-ui-create-list-variant-lists-text">Add to list</span>
		<span class="myft-ui-create-list-variant-lists-container o-forms-input o-forms-input--checkbox">
		</span>
	</div>
	`;
	const listsElement = stringToHTMLElement(listsTemplate);

	const listsElementContainer = listsElement.querySelector('.myft-ui-create-list-variant-lists-container');

	lists.map(list => listsElementContainer.insertAdjacentElement('beforeend', listCheckboxElement(list)));

	return listsElement;
}

function ListCheckboxElement (addToList, removeFromList) {
	return function (list) {

		const listCheckbox = `<label>
		<input type="checkbox" name="default" value="${list.uuid}" ${list.checked ? 'checked' : ''}>
		<span class="o-forms-input__label">
			<span class="o-normalise-visually-hidden">
			${list.checked ? 'Remove article from ' : 'Add article to ' }
			</span>
			${list.name}
		</span>
	</label>
	`;

		const listCheckboxElement = stringToHTMLElement(listCheckbox);

		const [ input ] = listCheckboxElement.children;

		function handleCheck (event) {
			event.preventDefault();
			const isChecked = event.target.checked;

			function onListUpdated () {
				const indexToUpdate = lists.indexOf(list);
				lists[indexToUpdate] = { ...lists[indexToUpdate], checked: isChecked };
				listCheckboxElement.querySelector('input').checked = isChecked;
			}

			return isChecked ? addToList(list, onListUpdated) : removeFromList(list, onListUpdated);
		}

		input.addEventListener('click', handleCheck);

		return listCheckboxElement;
	};
}

function MessageElement (onContinue) {
	const message = `
	<div class="myft-ui-create-list-variant-message-content" >
		<div class="myft-ui-create-list-variant-message-text" aria-live="polite">
			<h3>Thank you for your interest in making a public list</h3>
			<p>We're currently testing this feature. For now, your list remains private and isn't visible to others.</p>
		</div>
		<div class="myft-ui-create-list-variant-message-buttons">
			<button class="o-buttons o-buttons--big o-buttons--secondary">
			Continue
			</button>
		</div>
	</div>
`;

	const messageElement = stringToHTMLElement(message);

	messageElement.querySelector('button').addEventListener('click', onContinue);

	return messageElement;
}

function realignOverlay (originalScrollPosition, target) {
	return function () {
		const currentScrollPosition = window.scrollY;

		if(Math.abs(currentScrollPosition - originalScrollPosition) < 120) {
			return;
		}

		if (currentScrollPosition) {
			originalScrollPosition = currentScrollPosition;;
		}

		positionOverlay(target);
	};
}

function positionOverlay (target) {
	target.style['min-width'] = '340px';
	target.style['width'] = '100%';
	target.style['margin-top'] = 0;
	target.style['left'] = 0;
	target.style['top'] = 0;

	if (isMobile()) {
		const shareNavComponent = document.querySelector('.share-nav__horizontal');
		const topHalfOffset = target.clientHeight + 10;
		target.style['position'] = 'absolute';
		target.style['margin-left'] = 0;
		target.style['top'] = calculateLargerScreenHalf(shareNavComponent) === 'ABOVE' ? `-${topHalfOffset}px` : '50px';
	} else {
		target.style['position'] = 'absolute';
		target.style['margin-left'] = '45px';
	}
}

function calculateLargerScreenHalf (target) {
	if (!target) {
		return 'BELOW';
	}

	const vh = Math.min(document.documentElement.clientHeight || 0, window.innerHeight || 0);

	const targetBox = target.getBoundingClientRect();
	const spaceAbove = targetBox.top;
	const spaceBelow = vh - targetBox.bottom;

	return spaceBelow < spaceAbove ? 'ABOVE' : 'BELOW';
}

async function getLists (contentId) {
	return myFtClient.getListsContent()
		.then(results => results.items.map(list => {
			const isChecked = Array.isArray(list.content) && list.content.some(content => content.uuid === contentId);
			return { name: list.name, uuid: list.uuid, checked: isChecked, content: list.content, isShareable: false };
		}));
}

function triggerAddToListEvent (contentId, listId) {
	return document.body.dispatchEvent(new CustomEvent('oTracking.event', {
		detail: {
			category: 'list',
			action: 'add-success',
			article_id: contentId,
			list_id: listId,
			teamName: 'customer-products-us-growth',
			amplitudeExploratory: true
		},
		bubbles: true
	}));
}

function triggerRemoveFromListEvent (contentId, listId) {
	return document.body.dispatchEvent(new CustomEvent('oTracking.event', {
		detail: {
			category: 'list',
			action: 'remove-success',
			article_id: contentId,
			list_id: listId,
			teamName: 'customer-products-us-growth',
			amplitudeExploratory: true
		},
		bubbles: true
	}));
}

function triggerCreateListEvent (contentId, listId) {
	document.body.dispatchEvent(new CustomEvent('oTracking.event', {
		detail: {
			category: 'list',
			action: 'create-success',
			article_id: contentId,
			list_id: listId,
			teamName: 'customer-products-us-growth',
			amplitudeExploratory: true
		},
		bubbles: true
	}));
}
