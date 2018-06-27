export function toggleState (button, alreadyToggled) {
	const ariaLabel = button.getAttribute('aria-label');
	const alternateAriaLabel = button.getAttribute('data-alternate-label');

	if (ariaLabel) {
		button.setAttribute('aria-label', alternateAriaLabel);
		button.setAttribute('title', alternateAriaLabel);
		button.setAttribute('data-alternate-label', ariaLabel);
	}

	const text = button.textContent || button.innerText;

	if (text) {
		const textVariant = button.getAttribute('data-text-variant');
		const textVariantEl = button.querySelector('[data-variant-label]');
		const textEl = (textVariant && textVariantEl) ? textVariantEl : button;
		const alternateText = button.getAttribute('data-alternate-text') || alternateAriaLabel;
		textEl.textContent = alternateText;
		if(textVariant) {
			const setAltText = alternateText.includes('Saved') ? 'Save ' : 'Saved ';
			button.setAttribute('data-alternate-text', setAltText);
		} else {
			button.setAttribute('data-alternate-text', text);
		}
	}

	const isPressed = button.getAttribute('aria-pressed') === 'true';

	if (!alreadyToggled) {
		button.setAttribute('aria-pressed', !isPressed);
	}

	button.dispatchEvent(new CustomEvent('nButtons.stateChange', {
		detail: {
			state: isPressed
		},
		bubbles: true
	}));

	return button;
}
