import stringToHTMLElement from './lib/convert-string-to-html-element';

let isShowing = false;
let container;
let timeout;
const defaults = { duration: 5000 };

function focusTrap (event) {
	const tabKeyCode = 9;
	const focusableElements = [].slice.call(
		container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
	).filter(element => !element.disabled);

	if (focusableElements.length && event.keyCode === tabKeyCode) {
		const lastElement = focusableElements[focusableElements.length - 1];
		// Loop focus back to the first element if focus has reached the focusable element
		if (event.target === lastElement) {
			focusableElements[0].focus();
			event.preventDefault();
		} else if (event.shiftKey && event.target === focusableElements[0]) { // loop to the bottom when shift+tabbing.
			lastElement.focus();
			event.preventDefault();
		}
	}
}

function show (options) {
	if (isShowing || !options.content || !options.parentSelector) {
		return;
	}

	options = Object.assign({}, defaults, options);

	const contentNode = stringToHTMLElement(options.content);

	container = document.createElement('div');
	container.className = 'myft-notification';
	container.appendChild(contentNode);

	const parentNode = document.querySelector(options.parentSelector);

	if (parentNode) {
		parentNode.appendChild(container);
		isShowing = true;

		timeout = setTimeout(
			hide,
			options.duration
		);

		document.addEventListener('keydown', focusTrap);
	}
}

function hide () {
	clearTimeout(timeout);
	isShowing = false;
	document.removeEventListener('keydown', focusTrap);

	if (container && container.parentNode) {
		container.parentNode.removeChild(container);
	}
}

export default {
	show,
	hide,
};
