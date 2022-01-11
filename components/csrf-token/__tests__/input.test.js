import React from 'react';
import { CsrfToken } from '../input';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

const props = {
	cacheablePersonalisedUrl: false
};

describe('Csrf Token Input', () => {

	test('It renders default button', async () => {
		let { container } = render(<CsrfToken {...props} />);
		expect(container.querySelector('[name=\'token\']')).toBeTruthy();
	});

	test('It renders csrf token attribute', async () => {
		let { container } = render(<CsrfToken cacheablePersonalisedUrl={true} csrfToken={'test-token'} />);
		expect(container.querySelector('[data-myft-csrf-token=\'test-token\']')).toBeTruthy();
	});


});
