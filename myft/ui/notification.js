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

function isMobile () {
	const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

	return vw <= 980;
}

function stringToHTMLElement (string) {
	const template = document.createElement('template');
	template.innerHTML = string.trim();
	return template.content.firstChild;
}

const messageTemplate = `
	<p>Removed from <a href="https://www.ft.com/myft/saved-articles">saved articles</a> in myFT</p>
`;

function show (options) {
	if (isShowing) {
		return;
	}

	options = Object.assign({}, defaults, options);

	const messageNode = stringToHTMLElement(messageTemplate);

	container = document.createElement('div');
	container.className = 'myft-notification';
	container.appendChild(messageNode);

	const parentNodeClass = isMobile() ? '.o-share--horizontal' : '.o-share--vertical';
	const parentNode = document.querySelector(parentNodeClass);

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

	if (container) {
		container.parentNode.removeChild(container);
		document.removeEventListener('keydown', focusTrap);
	}
}

export default {
	show,
	hide,
};
