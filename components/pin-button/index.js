import Delegate from 'ftdomdelegate';
import myftApiClient from 'next-myft-client';
import serialize from 'form-serialize';

const delegate = new Delegate(document.body);

const trackPinningAction = ({ action }) =>
	new CustomEvent('oTracking.event', {
		detail: {
			category: 'n-messaging',
			messaging: 'myft-onboarding-pinning-promo',
			action
		},
		bubbles: true
	});

const findAncestor = (el, selector) => el.classList.contains(selector) || el.dataset[selector] !== undefined
	? el
	: el.parentElement && findAncestor(el.parentElement, selector);

const setLoading = el => el && el.classList.add('loading');

const togglePrioritised = (conceptId, prioritised, formData) => {
	if (prioritised) {
		myftApiClient.remove('user', null, 'prioritised', 'concept', conceptId, formData);
	} else {
		myftApiClient.add('user', null, 'prioritised', 'concept', conceptId, formData);
	}

	// These custom events are used by envoy so we know when to show or hide promos
	document.body.dispatchEvent(trackPinningAction({
		action: 'act'
	}));
};

export default () => {
	myftApiClient.init()
		.then(() => {
			delegate.off();
			delegate.on('click', 'button[data-prioritise-button]', event => {
				event.preventDefault();

				const form = findAncestor(event.target, 'myftPrioritise');
				const formData = form ? serialize(form, { hash: true }) : {};
				const { conceptId, prioritised } = event.target.dataset;
				const wrapper = findAncestor(event.target, 'myft-pin-button-wrapper');

				setLoading(wrapper);
				togglePrioritised(conceptId, prioritised === 'true', formData);
			});
		});
};
