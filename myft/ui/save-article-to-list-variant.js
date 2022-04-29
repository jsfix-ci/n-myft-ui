import Overlay from 'o-overlay';
import myFtClient from 'next-myft-client';
import { uuid } from 'n-ui-foundations';
import getToken from './lib/get-csrf-token';

const csrfToken = getToken();

let lists;

export default async function showSaveArticleToListVariant (name, contentId) {
	try {
		await openSaveArticleToListVariant (name, contentId);
	} catch(error) {
		handleError(error);
	}
}

async function openSaveArticleToListVariant (name, contentId) {
	if (!lists) {
		lists = await getLists(contentId);
	}

	const headingElement = HeadingElement();
	const descriptionElement = DescriptionElement();
	const contentElement = ContentElement(descriptionElement);

	function createList (list) {
		if(!list) {
			return;
		}

		myFtClient.add('user', null, 'created', 'list', uuid(), { name: list,	token: csrfToken })
			.then(detail => {
				myFtClient.add('list', detail.subject, 'contained', 'content', contentId, { token: csrfToken }).then((createdList) => {
					lists.push({ name: list, uuid: createdList.actorId, checked: true });
					const listElement = ListsElement(lists, addToList, removeFromList);
					const overlayContent = document.querySelector('.o-overlay__content');
					overlayContent.insertAdjacentElement('afterbegin', listElement);
					const announceListContainer = document.querySelector('.myft-ui-create-list-variant-announcement');
					announceListContainer.textContent = `${list} created`;
					triggerCreateListEvent(contentId);
					if (document.querySelector('.myft-ui-create-list-variant-add-description')) {
						descriptionElement.remove();
						contentElement.addEventListener('click', openFormHandler, { once: true });
					}
				});
			});
	}

	function addToList (list) {
		if(!list) {
			return;
		}

		myFtClient.add('list', list.uuid, 'contained', 'content', contentId, { token: csrfToken }).then(() => {
			const indexToUpdate = lists.indexOf(list);
			lists[indexToUpdate] = { ...lists[indexToUpdate], checked: true };
			const listElement = ListsElement(lists, addToList, removeFromList);
			const overlayContent = document.querySelector('.o-overlay__content');
			overlayContent.insertAdjacentElement('afterbegin', listElement);
			triggerAddToListEvent(contentId);
		});
	}

	function removeFromList (list) {
		if(!list) {
			return;
		}

		myFtClient.remove('list', list.uuid, 'contained', 'content', contentId, { token: csrfToken }).then(() => {
			const indexToUpdate = lists.indexOf(list);
			lists[indexToUpdate] = { ...lists[indexToUpdate], checked: false };
			const listElement = ListsElement(lists, addToList, removeFromList);
			const overlayContent = document.querySelector('.o-overlay__content');
			overlayContent.insertAdjacentElement('afterbegin', listElement);
			triggerRemoveFromListEvent(contentId);
		});
	}

	const overlays = Overlay.getOverlays();
	const existingOverlay = overlays[name];
	if (existingOverlay) {
		existingOverlay.destroy();
	}

	const createListOverlay = new Overlay(name, {
		html: contentElement,
		heading: { title: headingElement.outerHTML },
		modal: false,
		parentnode: isMobile() ? '.o-share--horizontal' : '.o-share--vertical',
		class: 'myft-ui-create-list-variant',
	});

	const realignListener = realignOverlay(window.scrollY);

	function outsideClickHandler (e) {
		try {
			const overlayContent = document.querySelector('.o-overlay__content');
			if(!overlayContent || !overlayContent.contains(e.target)) {
				createListOverlay.close();
			}
		} catch(error) {
			handleError(error);
		}
	}

	function openFormHandler () {
		try {
			const formElement = FormElement(createList);
			const overlayContent = document.querySelector('.o-overlay__content');
			overlayContent.insertAdjacentElement('beforeend', formElement);
			formElement.elements[0].focus();
		} catch(error) {
			handleError(error);
		}
	}

	createListOverlay.open();
	createListOverlay.wrapper.addEventListener('oOverlay.ready', (data) => {
		realignListener(data.currentTarget);

		if (lists && lists.length) {
			const listElement = ListsElement(lists, addToList, removeFromList);
			const overlayContent = document.querySelector('.o-overlay__content');
			overlayContent.insertAdjacentElement('afterbegin', listElement);
		}

		contentElement.addEventListener('click', openFormHandler, { once: true });

		document.querySelector('.article-content').addEventListener('click', outsideClickHandler, { once: true });
	});

	window.addEventListener('scroll', realignListener(createListOverlay.wrapper, window.scrollY));

	window.addEventListener('oViewport.resize', () => {
		realignListener(createListOverlay.wrapper);
	});
}

function stringToHTMLElement (string) {
	const template = document.createElement('template');
	template.innerHTML = string.trim();
	return template.content.firstChild;
}

function FormElement (createList) {
	const formString = `
	<form class="myft-ui-create-list-variant-form">
		<label class="o-forms-field">
			<span class="o-forms-input o-forms-input--text">
				<input type="text" name="list-name" aria-label="List name">
			</span>
		</label>
		<button class="o-buttons o-buttons--secondary" type="submit">
			Save
		</button>
	</form>
	`;

	const formElement = stringToHTMLElement(formString);

	function handleSubmit (event) {
		try {
			event.preventDefault();
			event.stopPropagation();
			const inputListName = formElement.querySelector('input[name="list-name"]');
			createList(inputListName.value);
			inputListName.value = '';
			formElement.remove();
		} catch(error) {
			handleError(error);
		}
	}

	formElement.querySelector('button[type="submit"]').addEventListener('click', handleSubmit);

	return formElement;
}

function ContentElement (descriptionElement) {
	const content = `
		<div class="myft-ui-create-list-variant-footer">
			<button class="myft-ui-create-list-variant-add">Add to a new list</button>
		</div>
	`;

	const contentElement = stringToHTMLElement(content);

	if (!lists.length) {
		contentElement.insertAdjacentElement('beforeend', descriptionElement);
	}

	return contentElement;
}

function DescriptionElement () {
	const description = '<p class="myft-ui-create-list-variant-add-description">Lists are a simple way to curate your content</p>';

	return stringToHTMLElement(description);
}

function HeadingElement () {
	const heading = `
		<span class="myft-ui-create-list-variant-heading">Added to <a href="https://www.ft.com/myft/saved-articles">saved articles</a> in <span class="myft-ui-create-list-variant-icon"><span class="myft-ui-create-list-variant-icon-visually-hidden">my FT</span></span></span>
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
		<span class="myft-ui-create-list-variant-lists-text">Add to a list</span>
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
		<input type="checkbox" name="default" value="${list.name}" ${list.checked ? 'checked' : ''}>
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
			return event.target.checked ? addToList(list) : removeFromList(list);
		}

		input.addEventListener('click', handleCheck);

		return listCheckboxElement;
	};
}

function realignOverlay (originalScrollPosition) {
	return function (target, currentScrollPosition) {
		try {
			if(currentScrollPosition && Math.abs(currentScrollPosition - originalScrollPosition) < 120) {
				return;
			}

			originalScrollPosition = currentScrollPosition;

			target.style['min-width'] = '340px';
			target.style['width'] = '100%';
			target.style['margin-top'] = '-50px';
			target.style['left'] = 0;

			if (isMobile()) {
				target.style['position'] = 'absolute';
				target.style['margin-left'] = 0;
				target.style['margin-top'] = 0;
				target.style['top'] = calculateLargerScreenHalf(target) === 'ABOVE' ? '-120px' : '50px';
			} else {
				target.style['position'] = 'absolute';
				target.style['margin-left'] = '45px';
				target.style['top'] = '220px';
			}
		} catch (error) {
			handleError(error);
		}
	};
}

function isMobile () {
	const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

	return vw <= 980;
}

function calculateLargerScreenHalf (target) {
	const vh = Math.min(document.documentElement.clientHeight || 0, window.innerHeight || 0);

	const targetBox = target.getBoundingClientRect();
	const spaceAbove = targetBox.top;
	const spaceBelow = vh - targetBox.bottom;

	return spaceBelow < spaceAbove ? 'ABOVE' : 'BELOW';
}

async function getLists () {
	return myFtClient.getAll('created', 'list')
		.then(lists => lists.filter(list => !list.isRedirect))
		.then(lists => {
			return lists.map(list => ({ name: list.name, uuid: list.uuid, checked: false }));
		});
}

function triggerAddToListEvent (contentId) {
	return document.body.dispatchEvent(new CustomEvent('oTracking.event', {
		detail: {
			category: 'professorLists',
			action: 'add-to-list',
			article_id: contentId,
			teamName: 'customer-products-us-growth',
			amplitudeExploratory: true
		},
		bubbles: true
	}));
}

function triggerRemoveFromListEvent (contentId) {
	return document.body.dispatchEvent(new CustomEvent('oTracking.event', {
		detail: {
			category: 'professorLists',
			action: 'remove-from-list',
			article_id: contentId,
			teamName: 'customer-products-us-growth',
			amplitudeExploratory: true
		},
		bubbles: true
	}));
}

function triggerCreateListEvent (contentId) {
	document.body.dispatchEvent(new CustomEvent('oTracking.event', {
		detail: {
			category: 'professorLists',
			action: 'create-list',
			article_id: contentId,
			teamName: 'customer-products-us-growth',
			amplitudeExploratory: true
		},
		bubbles: true
	}));

	return document.body.dispatchEvent(new CustomEvent('oTracking.event', {
		detail: {
			category: 'myFT',
			action: 'create-list-success',
			article_id: contentId
		},
		bubbles: true
	}));
}

function handleError (error) {
	document.body.dispatchEvent(new CustomEvent('oErrors.log', {
		bubbles: true,
		detail: {
			error,
			info: { component: 'professorLists' },
		}
	}));
}
