function dispatchEvent (document, detail) {
	const event = new CustomEvent('oTracking.event', {
		detail,
		bubbles: true
	});

	document.body.dispatchEvent(event);
}

module.exports = {

	digestOpened: (document) => dispatchEvent(document, {
		category: 'component',
		action: 'open',
		messaging: 'myft-digest'
	}),

	digestClosed: (document) => dispatchEvent(document, {
		category: 'component',
		action: 'close',
		messaging: 'myft-digest'
	}),

	digestLinkClicked: (document, link) => dispatchEvent(document, {
		category: 'element',
		action: 'click',
		messaging: 'myft-digest-link',
		contentID: link.dataset.contentId
	})

};
