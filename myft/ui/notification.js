let isInstantiated = false;
let container;

function isMobile () {
	const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

	return vw <= 980;
}

function stringToHTMLElement (string) {
	const template = document.createElement('template');
	template.innerHTML = string.trim();
	return template.content.firstChild;
}

function init () {
	if (isInstantiated) {
		return;
	}

	const messageTemplate = `
		<p>Removed from <a>saved articles</a> in myFT only.</p>
	`;

	const messageNode = stringToHTMLElement(messageTemplate);

	container = document.createElement('div');
	container.className = 'myft-notification';
	container.appendChild(messageNode);

	const parentNodeClass = isMobile() ? '.o-share--horizontal' : '.o-share--vertical';
	const parentNode = document.querySelector(parentNodeClass);

	if (parentNode) {
		parentNode.appendChild(container);
		isInstantiated = true;
	}
}

function destroy () {
	if (container) {
		container.parentNode.removeChild(container);
		isInstantiated = false;
	}
}

export default {
	init,
	destroy
};
